# Cricket Fantasy Point Prediction

This project aims to predict cricket fantasy points using various machine learning models, with a focus on time-aware data splitting and sophisticated feature engineering.

---

## 1. Exploratory Data Analysis (EDA)

The initial EDA provided a comprehensive understanding of the dataset through:

* *Fundamental Statistics:* Calculation of mean, standard deviation, min, max, median, and *coefficient of variation* for all key features.
* *Distribution and Temporal Analysis:* Visualization of feature distributions and examination of data trends on a *per-year basis*.
* *Feature Correlation:* Identification and visualization of relationships between features.
* *Role-Based Analysis:* Investigation of fantasy points (FP) and average FP per player *role* (e.g., Wicketkeeper-Batter - WB, All-rounder - AR, Batter - BAT).

---

## 2. Feature Engineering

Based on insights from EDA and reference to a research paper on cricket fantasy point prediction, *27 engineered features* were devised for model training. Key categories of features include:

* *Recent Performance:* Average and standard deviation of fantasy points over the last 3, 5, and 10 matches.
* *Career Statistics:* Career average FP and total matches played.
* *Contextual Metrics:* Venue, opponent, and team average/standard deviation of FP.
* *Specific Skills:* Average runs, strike rate, boundary rate, and average wickets over recent matches.
* *Categorical/Temporal:* Player role, team, opponent, venue, year, and month.

---

## 3. Modeling and Results

An initial attempt with *Linear Regression* performed poorly ($\text{MAE} > 30$). Following established research, five more robust models were trained and tested:

1.  Extra Trees (Regularized)
2.  Random Forest (Regularized)
3.  Gradient Boosting (Tuned)
4.  Ridge Regression
5.  Lasso Regression

### 🚨 Critical Implementation Detail: Time Series Constraint
A crucial step was the strict implementation of a *time-aware data splitting strategy* to prevent data leakage. This ensured that for any given match being tested, the model was *only trained on data strictly preceding the match date*.

### Model Performance

After training and comparison, the *Extra Trees (Regularized)* model provided the best overall performance. The performance metrics on the training and test sets are as follows:

| Model                       | Train $\text{MAE}$ | Test $\text{MAE}$ | Train $R^2$ | Test $R^2$ |
| :-------------------------- | :----------------- | :---------------- | :---------- | :--------- |
| *Extra Trees (Regularized)* | 21.18              | *25.29* | 25.29       | *0.035* |
| Random Forest (Regularized) | 22.00              | 25.29             | 25.29       | 0.035      |
| Gradient Boosting (Tuned)   | 21.55              | 25.44             | 25.44       | 0.017      |
| Ridge Regression            | 24.24              | 25.33             | 25.33       | 0.033      |
| Lasso Regression            | 24.26              | 25.22             | 25.22       | 0.033      |

Note: The test $R^2$ values are relatively low, suggesting the models capture only a small fraction of the total variance in fantasy points, which is common in high-variance prediction tasks like sports.
