"""
Constraints solver to select optimal XI using Linear Programming
"""
from pulp import *
import pandas as pd

def select_optimal_xi(player_data, team1, team2, score_key='predicted_fp'):
    """
    Select optimal XI using linear programming

    Constraints:
    - Total credits <= 100
    - WK: 1-4, BAT: 3-6, AR: 1-4, BOWL: 3-6
    - Max 7 from one team
    - Both teams represented

    Returns:
        dict with selected_players, total_credits, total_predicted_fp, etc.
    """

    # Create LP problem
    prob = LpProblem("Dream11_Team_Selection", LpMaximize)

    # Decision variables
    player_vars = {}
    for i, player in enumerate(player_data):
        player_vars[player['player_id']] = LpVariable(f"player_{i}", cat='Binary')

    # Objective: Maximize predicted FP
    prob += lpSum([player_vars[p['player_id']] * p[score_key] for p in player_data])

    # Constraint 1: Exactly 11 players
    prob += lpSum([player_vars[p['player_id']] for p in player_data]) == 11

    # Constraint 2: Budget <= 100
    prob += lpSum([player_vars[p['player_id']] * p['credits'] for p in player_data]) <= 100

    # Constraint 3: Role constraints
    role_constraints = {'WK': (1, 4), 'BAT': (3, 6), 'AR': (1, 4), 'BOWL': (3, 6)}
    for role, (min_count, max_count) in role_constraints.items():
        role_players = [p for p in player_data if p['role'] == role]
        if len(role_players) > 0:
            prob += lpSum([player_vars[p['player_id']] for p in role_players]) >= min_count
            prob += lpSum([player_vars[p['player_id']] for p in role_players]) <= max_count

    # Constraint 4: Max 7 from one team
    team1_players = [p for p in player_data if p['team'] == team1]
    team2_players = [p for p in player_data if p['team'] == team2]

    if len(team1_players) > 0:
        prob += lpSum([player_vars[p['player_id']] for p in team1_players]) <= 7
    if len(team2_players) > 0:
        prob += lpSum([player_vars[p['player_id']] for p in team2_players]) <= 7

    # Constraint 5: Both teams represented (at least 1 from each)
    if len(team1_players) > 0:
        prob += lpSum([player_vars[p['player_id']] for p in team1_players]) >= 1
    if len(team2_players) > 0:
        prob += lpSum([player_vars[p['player_id']] for p in team2_players]) >= 1

    # Solve
    prob.solve(PULP_CBC_CMD(msg=0))

    # Extract solution
    selected_players = []
    for player in player_data:
        if player_vars[player['player_id']].varValue == 1:
            selected_players.append(player)

    # Sort by predicted FP
    selected_players.sort(key=lambda x: x[score_key], reverse=True)

    # Calculate totals
    total_credits = sum(p['credits'] for p in selected_players)
    total_predicted_fp = sum(p[score_key] for p in selected_players)

    # Role counts
    role_counts = {}
    for role in ['WK', 'BAT', 'AR', 'BOWL']:
        role_counts[role] = sum(1 for p in selected_players if p['role'] == role)

    # Team counts
    team_counts = {
        team1: sum(1 for p in selected_players if p['team'] == team1),
        team2: sum(1 for p in selected_players if p['team'] == team2)
    }

    feasible = LpStatus[prob.status] == 'Optimal'

    return {
        'selected_players': selected_players,
        'total_credits': total_credits,
        'total_predicted_fp': total_predicted_fp,
        'role_counts': role_counts,
        'team_counts': team_counts,
        'feasible': feasible,
        'status': LpStatus[prob.status]
    }
