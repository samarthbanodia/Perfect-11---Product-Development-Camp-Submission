"""
Evaluation module to compute Dream XI and metrics
"""
import pandas as pd
from modules.fantasy_points import calculate_actual_fantasy_points
from modules.constraints_solver import select_optimal_xi

def compute_dream_xi(match_data, players, actual_fp_dict):
    """
    Compute the Dream XI (best possible 11 based on actual performance)

    Args:
        match_data: Match JSON data
        players: List of player dicts with roles and credits
        actual_fp_dict: Dict of {player_id: actual_fantasy_points}

    Returns:
        dict with dream_xi info
    """
    # Build player data with actual FP
    player_data = []
    for player in players:
        player_data.append({
            'player_id': player['player_id'],
            'player_name': player['player_name'],
            'team': player['team'],
            'role': player.get('role', 'BAT'),
            'predicted_fp': actual_fp_dict.get(player['player_id'], 0),  # Use actual as "predicted"
            'credits': player.get('credits', 7.5)
        })

    # Run solver with actual FP to get Dream XI
    team1 = match_data['info']['teams'][0]
    team2 = match_data['info']['teams'][1]

    dream_xi_result = select_optimal_xi(
        player_data,
        team1,
        team2,
        score_key='predicted_fp'  # Using actual FP here
    )

    return dream_xi_result

def compute_ae_team_total(predicted_xi_players, dream_xi_players):
    """
    Compute absolute error between predicted and dream XI total fantasy points

    Args:
        predicted_xi_players: List of players in predicted XI with their predicted_fp
        dream_xi_players: List of players in dream XI with their actual FP

    Returns:
        float: absolute error
    """
    predicted_total = sum(p['predicted_fp'] for p in predicted_xi_players)
    dream_total = sum(p['predicted_fp'] for p in dream_xi_players)

    ae_total_team = abs(dream_total - predicted_total)
    return ae_total_team

def generate_eval_summary_row(match_info, predicted_xi, dream_xi, ae_team_total):
    """
    Generate a single row for eval_summary.csv

    Returns:
        dict with columns as per PDF specification
    """
    return {
        'match_id': match_info.get('match_id', 'unknown'),
        'match_date': match_info['match_date'].strftime('%Y-%m-%d') if hasattr(match_info['match_date'], 'strftime') else match_info['match_date'],
        'team1': match_info['team1'],
        'team2': match_info['team2'],
        'predicted_xi': ','.join([p['player_name'] for p in sorted(predicted_xi, key=lambda x: x['predicted_fp'], reverse=True)]),
        'dream_xi': ','.join([p['player_name'] for p in sorted(dream_xi, key=lambda x: x['predicted_fp'], reverse=True)]),
        'predicted_points_per_player': ','.join([f"{p['predicted_fp']:.2f}" for p in sorted(predicted_xi, key=lambda x: x['predicted_fp'], reverse=True)]),
        'ae_team_total': round(ae_team_total, 2)
    }
