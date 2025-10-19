"""
LLM-powered explanations using OpenAI API for predictions and calculations
"""
import os
from typing import Dict, List
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = None
try:
    api_key = os.getenv('OPENAI_API_KEY')
    if api_key:
        client = OpenAI(api_key=api_key)
except Exception as e:
    print(f"Warning: OpenAI initialization failed: {e}")

def call_openai(system_prompt: str, user_prompt: str, max_tokens: int = 600) -> str:
    """
    Call OpenAI API to generate explanation

    Args:
        system_prompt: System context
        user_prompt: User query
        max_tokens: Maximum tokens in response

    Returns:
        str: Generated explanation
    """
    if not client:
        return "OpenAI API not configured. Please set OPENAI_API_KEY in .env file."

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Using GPT-4 mini for cost efficiency
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=max_tokens,
            temperature=0.5  # Reduced for faster, more focused responses
        )

        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating explanation: {str(e)}"

def generate_credits_explanation(player_name: str, role: str, credits: float,
                                 mu_fp_10: float, std_fp_10: float,
                                 composite_score: float, percentile: float,
                                 num_matches: int) -> str:
    """
    Generate human-readable explanation of how credits were calculated using OpenAI
    """

    system_prompt = """You are an expert cricket analyst explaining Dream11 fantasy cricket credit calculations.
    Your explanations should be:
    1. Clear and educational
    2. Use step-by-step mathematical breakdowns
    3. Include the actual formulas with numbers substituted
    4. Explain the reasoning behind each step
    5. Format using markdown for readability
    6. Be concise but comprehensive"""

    if num_matches < 10:
        user_prompt = f"""Explain how credits were calculated for {player_name}, a {role} player who has only played {num_matches} match(es).

Since they have fewer than 10 matches, they're classified as a "newcomer" and receive special treatment:
- Final Credits: {credits:.2f}
- Role: {role}

Please explain:
1. Why the newcomer clamp is applied
2. What the newcomer clamp formula is (role median ± 0.5)
3. Why this conservative approach is fair
4. Format your response in markdown with clear sections"""

    else:
        user_prompt = f"""Explain the detailed credits calculation for {player_name}, a {role} player:

**Given Data:**
- Mean FP over last 10 matches (μ_FP_10): {mu_fp_10:.2f}
- Standard Deviation (σ_FP_10): {std_fp_10:.2f}
- Number of prior matches: {num_matches}

**Step 1: Composite Score Calculation**
Formula: Composite Score = 0.7 × μ_FP_10 + 0.3 × (μ_FP_10 - σ_FP_10)
Show the actual calculation with these numbers.

**Step 2: Percentile Calculation**
- Percentile within {role} role: {percentile:.1f}%
Explain what this percentile means.

**Step 3: Credits Band Mapping**
The bands are:
- Top 10%: 10.5 - 11.0 credits
- Next 20%: 9.0 - 10.0 credits
- Middle 40%: 7.0 - 8.5 credits
- Bottom 30%: 4.0 - 6.5 credits

Show which band {player_name} falls into at {percentile:.1f}% and calculate the exact credits using linear interpolation.

**Final Credits: {credits:.2f}**

Please provide a clear, step-by-step explanation with all calculations shown. Use markdown formatting with code blocks for formulas."""

    return call_openai(system_prompt, user_prompt, max_tokens=800)

def generate_prediction_explanation(player_name: str, predicted_fp: float,
                                   top_features: List[Dict], role: str) -> str:
    """
    Generate explanation for fantasy points prediction using OpenAI
    """

    system_prompt = """You are an expert cricket analyst explaining ML model predictions for Dream11 fantasy points.
    Your explanations should:
    1. Interpret feature importance in cricket context
    2. Explain what each feature means for fantasy performance
    3. Be insightful and actionable for users
    4. Use markdown formatting
    5. Keep it concise but informative"""

    features_text = "\n".join([
        f"- {interpret_feature_name(f.get('feature', 'Unknown'))}: {f.get('importance', 0):+.2f} points impact"
        for f in top_features[:5]
    ])

    user_prompt = f"""Explain why the ML model predicted {predicted_fp:.2f} fantasy points for {player_name}, a {role} player.

**Top Contributing Features (SHAP values):**
{features_text}

Please explain:
1. What these features mean in cricket context
2. Why each feature is important for fantasy points
3. How positive/negative impacts work
4. An overall assessment of {player_name}'s predicted performance
5. Any insights about their playing style based on the features

Use markdown formatting with clear sections. Be specific to cricket and Dream11 fantasy scoring."""

    return call_openai(system_prompt, user_prompt, max_tokens=600)

def generate_team_selection_explanation(selected_xi: List[Dict], budget_info: Dict) -> str:
    """
    Generate explanation for the team selection using OpenAI
    """

    system_prompt = """You are an expert Dream11 team strategist explaining optimal team selection.
    Your explanations should:
    1. Explain the optimization strategy
    2. Justify constraint satisfaction
    3. Provide tactical insights
    4. Use markdown formatting"""

    role_counts = budget_info.get('role_counts', {})
    team_counts = budget_info.get('team_distribution', {})
    credits_used = budget_info.get('total_credits_used', 0)
    total_fp = sum(p.get('predicted_fp', 0) for p in selected_xi)

    team_composition = "\n".join([
        f"{i+1}. {p.get('player_name', 'Unknown')} ({p.get('role', 'BAT')}) - {p.get('predicted_fp', 0):.2f} FP, {p.get('credits', 0):.2f} credits"
        for i, p in enumerate(selected_xi)
    ])

    user_prompt = f"""Explain the team selection strategy for this Dream11 XI:

**Team Composition:**
{team_composition}

**Budget & Constraints:**
- Credits Used: {credits_used:.2f} / 100
- Total Predicted FP: {total_fp:.2f}
- WK: {role_counts.get('WK', 0)} (required: 1-4)
- BAT: {role_counts.get('BAT', 0)} (required: 3-6)
- AR: {role_counts.get('AR', 0)} (required: 1-4)
- BOWL: {role_counts.get('BOWL', 0)} (required: 3-6)
- Team Split: {list(team_counts.values())} (max 7 from one team)

Please explain:
1. How the linear programming optimization works
2. Why this specific combination is optimal
3. The balance between high-value players and budget constraints
4. Tactical insights about role distribution
5. Tie-breaking criteria if there were alternatives

Use markdown formatting. Be strategic and insightful."""

    return call_openai(system_prompt, user_prompt, max_tokens=700)

def generate_match_context_explanation(match_info: Dict, venue: str) -> str:
    """
    Generate explanation for match context using OpenAI
    """

    system_prompt = """You are an expert cricket analyst providing match context and venue analysis.
    Your explanations should:
    1. Provide venue insights
    2. Discuss team dynamics
    3. Explain how context affects predictions
    4. Use markdown formatting"""

    user_prompt = f"""Provide match context analysis for this IPL match:

**Match Details:**
- Teams: {match_info.get('team1', 'Team 1')} vs {match_info.get('team2', 'Team 2')}
- Venue: {venue}
- Date: {match_info.get('match_date', 'TBD')}

Please explain:
1. Historical characteristics of {venue} (batting/bowling friendly)
2. How venue conditions typically affect fantasy scoring
3. Team dynamics and head-to-head considerations
4. What factors the ML model considers for this specific matchup
5. Key players to watch based on venue and opponent

Use markdown formatting. Be specific to IPL cricket context."""

    return call_openai(system_prompt, user_prompt, max_tokens=600)

def interpret_feature_name(feature: str) -> str:
    """Convert technical feature names to readable format"""

    feature_map = {
        'avg_fp': 'Average Fantasy Points',
        'std_fp': 'Performance Consistency',
        'recent_form_3': 'Last 3 Matches Form',
        'recent_form_5': 'Last 5 Matches Form',
        'avg_fp_last10': 'Recent Performance (Last 10)',
        'venue_avg_fp': 'Performance at this Venue',
        'opp_avg_fp': 'Performance vs Opponent',
        'avg_runs': 'Average Runs Scored',
        'avg_wickets': 'Average Wickets Taken',
        'avg_catches': 'Average Catches',
        'num_matches': 'Experience (Matches Played)',
        'team_encoded': 'Team Factor',
        'opponent_encoded': 'Opponent Strength',
        'venue_encoded': 'Venue Factor',
        'role_encoded': 'Role Specialization'
    }

    return feature_map.get(feature, feature.replace('_', ' ').title())
