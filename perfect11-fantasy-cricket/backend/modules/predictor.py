"""
ML model inference
"""
import numpy as np

def predict_fantasy_points(player_features, model, feature_cols):
    """
    Predict fantasy points for all players

    Returns:
        dict: {player_id: predicted_fp}
    """
    # Ensure correct column order
    X = player_features[feature_cols].fillna(0)

    # Predict
    predictions = model.predict(X)

    # Map back to player_ids
    prediction_map = {}
    for idx, player_id in enumerate(player_features['player_id']):
        prediction_map[player_id] = float(predictions[idx])

    return prediction_map
