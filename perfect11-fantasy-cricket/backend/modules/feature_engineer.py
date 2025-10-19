"""
Create features for ML model prediction
"""
import pandas as pd
import numpy as np

def create_features_for_inference(players, match_date, venue, historical_data,
                                  roles_by_season, roles_global, label_encoders):
    """Create feature matrix for all players"""
    features_list = []

    for player in players:
        player_id = player['player_id']
        team = player['team']
        role = player.get('role', 'BAT')

        # Get opponent
        opponent = [p['team'] for p in players if p['team'] != team][0] if len(set(p['team'] for p in players)) > 1 else team

        # Historical matches
        if len(historical_data) == 0:
            hist = pd.DataFrame()
        else:
            hist = historical_data[
                (historical_data['player_id'] == player_id) &
                (historical_data['match_date'] < match_date)
            ].sort_values('match_date')

        feat = extract_features_for_player(player_id, hist, venue, opponent, role)

        # Encode categoricals
        feat['team_encoded'] = encode_safe(label_encoders['team'], team)
        feat['opponent_encoded'] = encode_safe(label_encoders['opponent'], opponent)
        feat['venue_encoded'] = encode_safe(label_encoders['venue'], venue)
        feat['role_encoded'] = encode_safe(label_encoders['role'], role)

        feat['player_id'] = player_id
        features_list.append(feat)

    return pd.DataFrame(features_list)

def extract_features_for_player(player_id, hist, venue, opponent, role):
    """Extract features from historical data"""
    feat = {}

    feat['num_matches'] = len(hist)

    if len(hist) == 0:
        # New player defaults
        feat.update({
            'avg_fp': 0, 'std_fp': 0, 'max_fp': 0, 'min_fp': 0,
            'avg_fp_last10': 0, 'std_fp_last10': 0,
            'recent_form_3': 0, 'recent_form_5': 0,
            'avg_runs': 0, 'avg_wickets': 0, 'avg_catches': 0,
            'venue_matches': 0, 'venue_avg_fp': 0,
            'opp_matches': 0, 'opp_avg_fp': 0
        })
    else:
        # Overall stats
        feat['avg_fp'] = hist['fantasy_points'].mean()
        feat['std_fp'] = hist['fantasy_points'].std() if len(hist) > 1 else 0
        feat['max_fp'] = hist['fantasy_points'].max()
        feat['min_fp'] = hist['fantasy_points'].min()
        feat['avg_runs'] = hist['runs'].mean()
        feat['avg_wickets'] = hist['wickets'].mean()
        feat['avg_catches'] = hist['catches'].mean()

        # Last N matches
        last_10 = hist.tail(10)
        feat['avg_fp_last10'] = last_10['fantasy_points'].mean()
        feat['std_fp_last10'] = last_10['fantasy_points'].std() if len(last_10) > 1 else 0

        feat['recent_form_3'] = hist.tail(3)['fantasy_points'].mean() if len(hist) >= 3 else feat['avg_fp']
        feat['recent_form_5'] = hist.tail(5)['fantasy_points'].mean() if len(hist) >= 5 else feat['avg_fp']

        # Venue history
        venue_hist = hist[hist['venue'] == venue]
        feat['venue_matches'] = len(venue_hist)
        feat['venue_avg_fp'] = venue_hist['fantasy_points'].mean() if len(venue_hist) > 0 else feat['avg_fp']

        # Opponent history
        opp_hist = hist[hist['opponent'] == opponent]
        feat['opp_matches'] = len(opp_hist)
        feat['opp_avg_fp'] = opp_hist['fantasy_points'].mean() if len(opp_hist) > 0 else feat['avg_fp']

    return feat

def encode_safe(encoder, value):
    """Safely encode categorical value"""
    try:
        return encoder.transform([str(value)])[0]
    except:
        return 0
