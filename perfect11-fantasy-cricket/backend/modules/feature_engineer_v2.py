"""
Feature Engineering for Time-Aware Model (v2.0)
Creates all 27 features required by the Extra Trees model
"""
import pandas as pd
import numpy as np

def create_features_for_inference_v2(players, match_date, venue, historical_data,
                                     roles_by_season, roles_global, label_encoders):
    """
    Create 27 features for each player using only historical data

    Required features (from time-aware model):
    - Recent performance: avg_fp_last3, avg_fp_last5, avg_fp_last10, std_fp_last10, recent_form
    - Career: career_avg_fp, career_matches
    - Batting: avg_runs_last5, avg_runs_last10, strike_rate, boundary_rate
    - Bowling: avg_wickets_last5, avg_wickets_last10
    - Fielding: avg_catches_last5
    - Contextual: venue_avg_fp, venue_std_fp, opponent_avg_fp, opponent_std_fp, team_avg_fp, team_std_fp
    - Temporal: year, month, day_of_week
    - Categorical (encoded): role, team, opponent, venue
    """
    features_list = []

    # Get global stats from all historical data before this match
    global_hist = historical_data[historical_data['match_date'] < match_date]

    # Compute contextual stats
    venue_stats = compute_venue_stats(global_hist, venue)
    team_stats = {team: compute_team_stats(global_hist, team) for team in set(p['team'] for p in players)}

    for player in players:
        player_id = player['player_id']
        player_name = player['player_name']
        team = player['team']
        role = player.get('role', 'AR')  # Default to All-Rounder

        # Get opponent team
        opponent = get_opponent(players, team)
        opponent_stats = compute_opponent_stats(global_hist, opponent)

        # Get player's historical data (before this match)
        player_hist = global_hist[global_hist['player_id'] == player_id].sort_values('match_date')

        # Extract all 27 features
        feat = extract_all_features(
            player_id=player_id,
            player_hist=player_hist,
            match_date=match_date,
            venue=venue,
            venue_stats=venue_stats,
            opponent=opponent,
            opponent_stats=opponent_stats,
            team=team,
            team_stats=team_stats.get(team, {'avg_fp': 0, 'std_fp': 0}),
            role=role
        )

        # Encode categoricals
        feat['role'] = encode_safe(label_encoders['role'], role)
        feat['team'] = encode_safe(label_encoders['team'], team)
        feat['opponent'] = encode_safe(label_encoders['opponent'], opponent)
        feat['venue'] = encode_safe(label_encoders['venue'], venue)

        feat['player_id'] = player_id
        feat['player_name'] = player_name

        features_list.append(feat)

    return pd.DataFrame(features_list)

def extract_all_features(player_id, player_hist, match_date, venue, venue_stats,
                         opponent, opponent_stats, team, team_stats, role):
    """Extract all 27 features from player history"""
    feat = {}

    n = len(player_hist)

    if n == 0:
        # New player - use global defaults
        feat.update({
            # Recent performance (5 features)
            'avg_fp_last3': venue_stats['avg_fp'],
            'avg_fp_last5': venue_stats['avg_fp'],
            'avg_fp_last10': venue_stats['avg_fp'],
            'std_fp_last10': 0,
            'recent_form': venue_stats['avg_fp'],

            # Career (2 features)
            'career_avg_fp': venue_stats['avg_fp'],
            'career_matches': 0,

            # Batting (4 features)
            'avg_runs_last5': 20,  # Reasonable default
            'avg_runs_last10': 20,
            'strike_rate': 120,  # T20 average
            'boundary_rate': 0.3,

            # Bowling (2 features)
            'avg_wickets_last5': 0,
            'avg_wickets_last10': 0,

            # Fielding (1 feature)
            'avg_catches_last5': 0.2,

            # Contextual (6 features)
            'venue_avg_fp': venue_stats['avg_fp'],
            'venue_std_fp': venue_stats['std_fp'],
            'opponent_avg_fp': opponent_stats['avg_fp'],
            'opponent_std_fp': opponent_stats['std_fp'],
            'team_avg_fp': team_stats['avg_fp'],
            'team_std_fp': team_stats['std_fp'],

            # Temporal (3 features)
            'year': match_date.year,
            'month': match_date.month,
            'day_of_week': match_date.dayofweek
        })
    else:
        # Compute from historical data
        fp = player_hist['fantasy_points'].values
        runs = player_hist['runs'].values
        wickets = player_hist['wickets'].values
        catches = player_hist['catches'].values
        balls_faced = player_hist['balls_faced'].replace(0, np.nan).values
        fours = player_hist['fours'].values
        sixes = player_hist['sixes'].values

        # Recent performance
        feat['avg_fp_last3'] = np.mean(fp[-3:]) if n >= 3 else np.mean(fp)
        feat['avg_fp_last5'] = np.mean(fp[-5:]) if n >= 5 else np.mean(fp)
        feat['avg_fp_last10'] = np.mean(fp[-10:]) if n >= 10 else np.mean(fp)
        feat['std_fp_last10'] = np.std(fp[-10:]) if n >= 10 else 0

        # Recent form (exponentially weighted)
        if n >= 5:
            weights = np.exp(np.linspace(-1, 0, min(5, n)))
            weights /= weights.sum()
            feat['recent_form'] = np.average(fp[-5:], weights=weights[-len(fp[-5:]):])
        else:
            feat['recent_form'] = np.mean(fp)

        # Career stats
        feat['career_avg_fp'] = np.mean(fp)
        feat['career_matches'] = n

        # Batting stats
        feat['avg_runs_last5'] = np.mean(runs[-5:]) if n >= 5 else np.mean(runs)
        feat['avg_runs_last10'] = np.mean(runs[-10:]) if n >= 10 else np.mean(runs)

        # Strike rate
        recent_runs = runs[-5:] if n >= 5 else runs
        recent_balls = balls_faced[-5:] if n >= 5 else balls_faced
        valid_sr = recent_runs[~np.isnan(recent_balls)] / recent_balls[~np.isnan(recent_balls)] * 100
        feat['strike_rate'] = np.mean(valid_sr) if len(valid_sr) > 0 else 120

        # Boundary rate
        recent_fours = fours[-5:] if n >= 5 else fours
        recent_sixes = sixes[-5:] if n >= 5 else sixes
        recent_runs_for_br = runs[-5:] if n >= 5 else runs
        boundary_runs = recent_fours * 4 + recent_sixes * 6
        feat['boundary_rate'] = np.mean(boundary_runs / (recent_runs_for_br + 0.1))

        # Bowling stats
        feat['avg_wickets_last5'] = np.mean(wickets[-5:]) if n >= 5 else np.mean(wickets)
        feat['avg_wickets_last10'] = np.mean(wickets[-10:]) if n >= 10 else np.mean(wickets)

        # Fielding stats
        feat['avg_catches_last5'] = np.mean(catches[-5:]) if n >= 5 else np.mean(catches)

        # Contextual stats
        feat['venue_avg_fp'] = venue_stats['avg_fp']
        feat['venue_std_fp'] = venue_stats['std_fp']
        feat['opponent_avg_fp'] = opponent_stats['avg_fp']
        feat['opponent_std_fp'] = opponent_stats['std_fp']
        feat['team_avg_fp'] = team_stats['avg_fp']
        feat['team_std_fp'] = team_stats['std_fp']

        # Temporal features
        feat['year'] = match_date.year
        feat['month'] = match_date.month
        feat['day_of_week'] = match_date.dayofweek

    return feat

def compute_venue_stats(historical_data, venue):
    """Compute venue statistics from historical data"""
    if len(historical_data) == 0:
        return {'avg_fp': 30, 'std_fp': 25}

    venue_matches = historical_data[historical_data['venue'] == venue]

    if len(venue_matches) == 0:
        # Use global average
        return {
            'avg_fp': historical_data['fantasy_points'].mean(),
            'std_fp': historical_data['fantasy_points'].std()
        }

    return {
        'avg_fp': venue_matches['fantasy_points'].mean(),
        'std_fp': venue_matches['fantasy_points'].std() if len(venue_matches) > 1 else historical_data['fantasy_points'].std()
    }

def compute_opponent_stats(historical_data, opponent):
    """Compute opponent statistics from historical data"""
    if len(historical_data) == 0:
        return {'avg_fp': 30, 'std_fp': 25}

    opp_matches = historical_data[historical_data['opponent'] == opponent]

    if len(opp_matches) == 0:
        return {
            'avg_fp': historical_data['fantasy_points'].mean(),
            'std_fp': historical_data['fantasy_points'].std()
        }

    return {
        'avg_fp': opp_matches['fantasy_points'].mean(),
        'std_fp': opp_matches['fantasy_points'].std() if len(opp_matches) > 1 else historical_data['fantasy_points'].std()
    }

def compute_team_stats(historical_data, team):
    """Compute team statistics from historical data"""
    if len(historical_data) == 0:
        return {'avg_fp': 30, 'std_fp': 25}

    team_matches = historical_data[historical_data['team'] == team]

    if len(team_matches) == 0:
        return {
            'avg_fp': historical_data['fantasy_points'].mean(),
            'std_fp': historical_data['fantasy_points'].std()
        }

    return {
        'avg_fp': team_matches['fantasy_points'].mean(),
        'std_fp': team_matches['fantasy_points'].std() if len(team_matches) > 1 else historical_data['fantasy_points'].std()
    }

def get_opponent(players, team):
    """Get the opponent team name"""
    opponent_teams = [p['team'] for p in players if p['team'] != team]
    return opponent_teams[0] if opponent_teams else team

def encode_safe(encoder, value):
    """Safely encode categorical value"""
    try:
        return encoder.transform([str(value)])[0]
    except:
        return 0
