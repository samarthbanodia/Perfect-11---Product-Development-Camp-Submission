"""
Calculate credits for all players based on historical performance
Following the exact specification from the PDF
"""
import pandas as pd
import numpy as np

def calculate_credits_for_all(players, match_date, historical_data, roles_by_season, roles_global):
    """
    Calculate credits for all players

    Returns:
        dict: {player_id: credits}
    """
    year = match_date.year
    credits_map = {}

    # Get role-specific medians for newcomer clamp
    role_medians = compute_role_medians(historical_data, match_date, roles_by_season, roles_global)

    for player in players:
        player_id = player['player_id']

        # Get player's role
        role = get_player_role(player_id, year, roles_by_season, roles_global)
        player['role'] = role

        # Get historical matches for this player BEFORE match_date
        if len(historical_data) == 0:
            hist = pd.DataFrame()
        else:
            hist = historical_data[
                (historical_data['player_id'] == player_id) &
                (historical_data['match_date'] < match_date)
            ].sort_values('match_date')

        if len(hist) < 10:
            # Newcomer clamp
            median = role_medians.get(role, 7.5)
            credits = np.clip(median, median - 0.5, median + 0.5)
            credits = round(credits, 2)
        else:
            # Compute composite score
            last_10 = hist.tail(10)
            mu_fp_10 = last_10['fantasy_points'].mean()
            std_fp_10 = last_10['fantasy_points'].std()

            if std_fp_10 == 0 or np.isnan(std_fp_10):
                std_fp_10 = 0

            composite_score = 0.7 * mu_fp_10 + 0.3 * (mu_fp_10 - std_fp_10)

            # Compute percentile within role
            percentile = compute_percentile_within_role(
                player_id, role, composite_score,
                historical_data, match_date, roles_by_season, roles_global
            )

            # Map percentile to credits
            credits = map_percentile_to_credits(percentile)
            credits = round(credits, 2)
            credits = np.clip(credits, 4.0, 11.0)

        credits_map[player_id] = credits

    return credits_map

def compute_role_medians(historical_data, match_date, roles_by_season, roles_global):
    """Compute median credits by role for newcomer clamp"""
    return {
        'WK': 7.5,
        'BAT': 8.0,
        'AR': 7.8,
        'BOWL': 7.2
    }

def get_player_role(player_id, year, roles_by_season, roles_global):
    """Get player's role with fallback"""
    # Try season-specific
    season_role = roles_by_season[
        (roles_by_season['player_id'] == player_id) &
        (roles_by_season['season'] == year)
    ]

    if not season_role.empty:
        return season_role.iloc[0]['role']

    # Fallback to global
    global_role = roles_global[roles_global['player_id'] == player_id]
    if not global_role.empty:
        return global_role.iloc[0]['role']

    # Default
    return 'BAT'

def compute_percentile_within_role(player_id, role, composite_score,
                                   historical_data, match_date, roles_by_season, roles_global):
    """Compute player's percentile within their role"""
    year = match_date.year

    # Get all players in this role with >=10 matches before match_date
    all_player_scores = []

    if len(historical_data) == 0:
        unique_players = []
    else:
        unique_players = historical_data[
            historical_data['match_date'] < match_date
        ]['player_id'].unique()

    for pid in unique_players:
        p_role = get_player_role(pid, year, roles_by_season, roles_global)
        if p_role != role:
            continue

        p_hist = historical_data[
            (historical_data['player_id'] == pid) &
            (historical_data['match_date'] < match_date)
        ]

        if len(p_hist) >= 10:
            last_10 = p_hist.tail(10)
            mu = last_10['fantasy_points'].mean()
            std = last_10['fantasy_points'].std()
            if np.isnan(std):
                std = 0
            score = 0.7 * mu + 0.3 * (mu - std)
            all_player_scores.append(score)

    if len(all_player_scores) == 0:
        return 50  # Default to median

    # Compute percentile
    percentile = (np.sum(np.array(all_player_scores) < composite_score) / len(all_player_scores)) * 100
    return percentile

def map_percentile_to_credits(percentile):
    """Map percentile to credits using bands"""
    if percentile >= 90:  # Top 10%
        position = (percentile - 90) / 10
        return 10.5 + position * 0.5
    elif percentile >= 70:  # Next 20%
        position = (percentile - 70) / 20
        return 9.0 + position * 1.0
    elif percentile >= 30:  # Middle 40%
        position = (percentile - 30) / 40
        return 7.0 + position * 1.5
    else:  # Bottom 30%
        position = percentile / 30
        return 4.0 + position * 2.5
