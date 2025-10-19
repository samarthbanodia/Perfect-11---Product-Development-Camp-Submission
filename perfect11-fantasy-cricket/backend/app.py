"""
Dream11 IPL Team Selection - Flask Backend
Main API application
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import pickle
import pandas as pd
from modules.json_parser import parse_match_json
from modules.credits_calculator import calculate_credits_for_all
from modules.feature_engineer_v2 import create_features_for_inference_v2 as create_features_for_inference
from modules.predictor import predict_fantasy_points
from modules.constraints_solver import select_optimal_xi
from modules.explainer import compute_attributions
from modules.fantasy_points import calculate_actual_fantasy_points
from modules.llm_explainer import (
    generate_credits_explanation,
    generate_prediction_explanation,
    generate_team_selection_explanation,
    generate_match_context_explanation
)
from modules.evaluation import compute_dream_xi, compute_ae_team_total, generate_eval_summary_row
import csv
from io import StringIO

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

print("="*70)
print("Dream11 Backend - Starting...")
print("="*70)

# Load model and data on startup
def load_model_package():
    try:
        with open('model_artifacts/ProductUI_Model.pkl', 'rb') as f:
            return pickle.load(f)
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def load_historical_data():
    """Load historical data - creates dummy data if file doesn't exist"""
    try:
        return pd.read_csv('data/player_match_base.csv', parse_dates=['match_date'])
    except FileNotFoundError:
        print("[WARNING] player_match_base.csv not found - creating dummy data")
        # Create minimal dummy data for testing
        return pd.DataFrame({
            'player_id': [],
            'match_date': [],
            'fantasy_points': [],
            'runs': [],
            'wickets': [],
            'catches': [],
            'venue': [],
            'opponent': []
        })

def load_roles():
    """Load role mappings - creates dummy data if files don't exist"""
    try:
        roles_by_season = pd.read_csv('data/player_roles_by_season.csv')
    except FileNotFoundError:
        print("[WARNING] player_roles_by_season.csv not found - creating dummy data")
        roles_by_season = pd.DataFrame({'player_id': [], 'season': [], 'role': []})

    try:
        roles_global = pd.read_csv('data/player_roles_global.csv')
    except FileNotFoundError:
        print("[WARNING] player_roles_global.csv not found - creating dummy data")
        roles_global = pd.DataFrame({'player_id': [], 'role': []})

    return roles_by_season, roles_global

print("Loading model and historical data...")
model_package = load_model_package()
historical_data = load_historical_data()
roles_by_season, roles_global = load_roles()

if model_package:
    print(f"[OK] Model loaded: {model_package['model_name']}")
    print(f"[OK] Historical data: {len(historical_data)} records")
    print(f"[OK] Roles by season: {len(roles_by_season)} records")
    print(f"[OK] Roles global: {len(roles_global)} records")
else:
    print("[ERROR] Model not loaded!")

print("="*70)
print("[OK] Backend ready!")
print("="*70)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Dream11 Backend is running!",
        "model_loaded": model_package is not None,
        "data_records": len(historical_data)
    })

@app.route('/predict', methods=['POST'])
def predict_team():
    """
    Main endpoint: Accept JSON, return Recommended XI with all details
    """
    try:
        # 1. Parse uploaded JSON
        if 'file' in request.files:
            file = request.files['file']
            match_data = json.load(file)
        else:
            match_data = request.get_json()

        if not match_data:
            return jsonify({"error": "No match data provided"}), 400

        # 2. Parse match JSON
        match_info = parse_match_json(match_data)
        print(f"\n[PREDICT] Processing match: {match_info['match_id']}")
        print(f"  Teams: {match_info['team1']} vs {match_info['team2']}")
        print(f"  Venue: {match_info['venue']}")
        print(f"  Players: {len(match_info['players'])}")

        # 3. Calculate credits for all players
        player_credits = calculate_credits_for_all(
            match_info['players'],
            match_info['match_date'],
            historical_data,
            roles_by_season,
            roles_global
        )
        print(f"  Credits calculated for {len(player_credits)} players")

        # 4. Create features for prediction
        player_features = create_features_for_inference(
            match_info['players'],
            match_info['match_date'],
            match_info['venue'],
            historical_data,
            roles_by_season,
            roles_global,
            model_package['label_encoders']
        )
        print(f"  Features created: {len(player_features)} players x {len(model_package['feature_cols'])} features")

        # 5. Predict fantasy points
        predictions = predict_fantasy_points(
            player_features,
            model_package['model'],
            model_package['feature_cols']
        )
        print(f"  Predictions generated for {len(predictions)} players")

        # 6. Merge predictions with player info and credits
        player_data = []
        for player in match_info['players']:
            player_data.append({
                'player_id': player['player_id'],
                'player_name': player['player_name'],
                'team': player['team'],
                'role': player.get('role', 'BAT'),
                'predicted_fp': predictions.get(player['player_id'], 0),
                'credits': player_credits.get(player['player_id'], 7.5)
            })

        # 7. Run constraints solver
        optimal_xi = select_optimal_xi(
            player_data,
            match_info['team1'],
            match_info['team2']
        )
        print(f"  Optimal XI selected: {len(optimal_xi['selected_players'])} players")
        print(f"  Total credits: {optimal_xi['total_credits']:.2f}/100")
        print(f"  Predicted FP: {optimal_xi['total_predicted_fp']:.2f}")

        # 8. Compute SHAP attributions
        attributions = compute_attributions(
            optimal_xi,
            player_features,
            model_package['model'],
            model_package['feature_cols']
        )

        # 9. Format response
        response = {
            "match_info": {
                "match_id": match_info.get('match_id', 'unknown'),
                "match_date": match_info['match_date'].strftime('%Y-%m-%d'),
                "team1": match_info['team1'],
                "team2": match_info['team2'],
                "venue": match_info['venue']
            },
            "recommended_xi": [
                {
                    "rank": idx + 1,
                    "player_id": p['player_id'],
                    "player_name": p['player_name'],
                    "team": p['team'],
                    "role": p['role'],
                    "predicted_fp": round(p['predicted_fp'], 2),
                    "credits": p['credits'],
                    "attribution": attributions.get(p['player_id'], {})
                }
                for idx, p in enumerate(optimal_xi['selected_players'])
            ],
            "budget_info": {
                "total_credits_used": round(optimal_xi['total_credits'], 2),
                "total_credits_available": 100,
                "credits_remaining": round(100 - optimal_xi['total_credits'], 2),
                "role_distribution": optimal_xi['role_counts'],
                "team_distribution": optimal_xi['team_counts'],
                "constraints_satisfied": optimal_xi['feasible']
            },
            "predictions_summary": {
                "total_predicted_fp": round(optimal_xi['total_predicted_fp'], 2),
                "average_predicted_fp": round(optimal_xi['total_predicted_fp'] / 11, 2)
            }
        }

        print(f"[SUCCESS] Prediction complete\n")
        return jsonify(response), 200

    except Exception as e:
        import traceback
        error_msg = str(e)
        stack_trace = traceback.format_exc()
        print(f"[ERROR] {error_msg}")
        print(stack_trace)
        return jsonify({"error": error_msg, "details": stack_trace}), 500

@app.route('/explain', methods=['POST'])
def get_explanations():
    """Get detailed LLM-powered explanations for predictions"""
    try:
        data = request.get_json()
        player_id = data.get('player_id')
        explanation_type = data.get('type', 'credits')  # 'credits', 'prediction', 'team', 'match'

        if explanation_type == 'credits':
            explanation = generate_credits_explanation(
                player_name=data.get('player_name', 'Player'),
                role=data.get('role', 'BAT'),
                credits=data.get('credits', 0),
                mu_fp_10=data.get('mu_fp_10', 0),
                std_fp_10=data.get('std_fp_10', 0),
                composite_score=data.get('composite_score', 0),
                percentile=data.get('percentile', 50),
                num_matches=data.get('num_matches', 0)
            )
        elif explanation_type == 'prediction':
            explanation = generate_prediction_explanation(
                player_name=data.get('player_name', 'Player'),
                predicted_fp=data.get('predicted_fp', 0),
                top_features=data.get('top_features', []),
                role=data.get('role', 'BAT')
            )
        elif explanation_type == 'team':
            explanation = generate_team_selection_explanation(
                selected_xi=data.get('selected_xi', []),
                budget_info=data.get('budget_info', {})
            )
        elif explanation_type == 'match':
            explanation = generate_match_context_explanation(
                match_info=data.get('match_info', {}),
                venue=data.get('venue', 'Unknown Venue')
            )
        else:
            return jsonify({"error": "Invalid explanation type"}), 400

        return jsonify({"explanation": explanation}), 200

    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

@app.route('/export_eval_csv', methods=['POST'])
def export_eval_csv():
    """Generate and download eval_summary.csv"""
    try:
        data = request.get_json()
        results = data.get('results', [])  # List of match results

        if not results:
            return jsonify({"error": "No results provided"}), 400

        # Create CSV in memory
        output = StringIO()
        fieldnames = ['match_id', 'match_date', 'team1', 'team2', 'predicted_xi',
                     'dream_xi', 'predicted_points_per_player', 'ae_team_total']
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()

        for result in results:
            writer.writerow(result)

        csv_content = output.getvalue()
        output.close()

        from flask import make_response
        response = make_response(csv_content)
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = 'attachment; filename=eval_summary.csv'

        return response

    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    """Handle multiple match JSONs for batch processing"""
    try:
        files = request.files.getlist('files')
        if not files:
            match_jsons = request.get_json()
            if not isinstance(match_jsons, list):
                return jsonify({"error": "Expected list of match JSONs"}), 400
        else:
            match_jsons = []
            for file in files:
                match_data = json.load(file)
                match_jsons.append(match_data)

        results = []

        for match_data in match_jsons:
            try:
                # Process each match (simplified version)
                match_info = parse_match_json(match_data)

                player_credits = calculate_credits_for_all(
                    match_info['players'],
                    match_info['match_date'],
                    historical_data,
                    roles_by_season,
                    roles_global
                )

                player_features = create_features_for_inference(
                    match_info['players'],
                    match_info['match_date'],
                    match_info['venue'],
                    historical_data,
                    roles_by_season,
                    roles_global,
                    model_package['label_encoders']
                )

                predictions = predict_fantasy_points(
                    player_features,
                    model_package['model'],
                    model_package['feature_cols']
                )

                player_data = []
                for player in match_info['players']:
                    player_data.append({
                        'player_id': player['player_id'],
                        'player_name': player['player_name'],
                        'team': player['team'],
                        'role': player.get('role', 'BAT'),
                        'predicted_fp': predictions.get(player['player_id'], 0),
                        'credits': player_credits.get(player['player_id'], 7.5)
                    })

                optimal_xi = select_optimal_xi(
                    player_data,
                    match_info['team1'],
                    match_info['team2']
                )

                # Calculate Dream XI and ae_team_total
                from modules.evaluation import compute_dream_xi, compute_ae_team_total

                # Get actual fantasy points from match data if available
                actual_fp_dict = {}
                if 'innings' in match_data:
                    from modules.fantasy_points import calculate_actual_fantasy_points
                    actual_fp_dict = calculate_actual_fantasy_points(match_data, match_info['players'])

                dream_xi_result = None
                ae_team_total = 0

                if actual_fp_dict:
                    try:
                        dream_xi_result = compute_dream_xi(match_data, match_info['players'], actual_fp_dict)
                        if dream_xi_result and dream_xi_result.get('selected_players'):
                            ae_team_total = compute_ae_team_total(
                                optimal_xi['selected_players'],
                                dream_xi_result['selected_players']
                            )
                    except:
                        pass  # If Dream XI calculation fails, just skip it

                results.append({
                    "match_id": match_info.get('match_id', 'unknown'),
                    "match_date": match_info['match_date'].strftime('%Y-%m-%d'),
                    "team1": match_info['team1'],
                    "team2": match_info['team2'],
                    "predicted_xi": [p['player_name'] for p in optimal_xi['selected_players']],
                    "dream_xi": [p['player_name'] for p in dream_xi_result['selected_players']] if dream_xi_result else [],
                    "total_predicted_fp": round(optimal_xi['total_predicted_fp'], 2),
                    "total_credits": round(optimal_xi['total_credits'], 2),
                    "ae_team_total": round(ae_team_total, 2),
                    "status": "success"
                })

            except Exception as e:
                results.append({
                    "match_id": "error",
                    "error": str(e),
                    "status": "failed"
                })

        return jsonify({"results": results, "total_processed": len(results)}), 200

    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

@app.route('/export', methods=['POST'])
def export_results():
    """Export results to JSON"""
    try:
        data = request.get_json()
        format_type = data.get('format', 'json')

        if format_type == 'json':
            return jsonify(data), 200
        else:
            return jsonify({"error": "Only JSON export supported currently"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
