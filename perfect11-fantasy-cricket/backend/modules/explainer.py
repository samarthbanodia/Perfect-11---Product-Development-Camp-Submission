"""
Compute SHAP/attribution values for explainability
"""
import numpy as np

def compute_attributions(optimal_xi, player_features, model, feature_cols):
    """
    Compute SHAP values for selected players

    Returns:
        dict: {player_id: {feature: importance}}
    """
    try:
        import shap
        # Create SHAP explainer
        explainer = shap.TreeExplainer(model)

        attributions = {}

        for player in optimal_xi['selected_players']:
            player_id = player['player_id']

            # Get this player's features
            player_row = player_features[player_features['player_id'] == player_id]
            X = player_row[feature_cols].fillna(0)

            # Compute SHAP values
            shap_values = explainer.shap_values(X)

            # Get top 5 features
            feature_importance = []
            for i, feature in enumerate(feature_cols):
                feature_importance.append({
                    'feature': feature,
                    'importance': float(shap_values[0][i])
                })

            # Sort by absolute importance
            feature_importance.sort(key=lambda x: abs(x['importance']), reverse=True)

            attributions[player_id] = {
                'top_features': feature_importance[:5],
                'all_features': feature_importance
            }

        return attributions

    except Exception as e:
        print(f"Warning: Could not compute SHAP values: {e}")
        # Return empty attributions
        return {p['player_id']: {'top_features': [], 'all_features': []}
                for p in optimal_xi['selected_players']}
