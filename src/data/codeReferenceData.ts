/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CodeReferenceItem } from '../types';

export const CODE_REFERENCE_LIBRARY: CodeReferenceItem[] = [
  {
    id: 'dax-1',
    title: 'YoY Revenue Growth & Running Total (DAX)',
    category: 'Power BI DAX',
    language: 'dax',
    description: 'Calculates year-over-year revenue growth percentage and cumulative annual revenue across 15 global cities.',
    code: `// Power BI DAX - Revenue YoY Growth %
Revenue_YoY_Growth = 
VAR CurrentYearRev = CALCULATE(SUM(Bookings[Total_Revenue]), 'Calendar'[Year] = MAX('Calendar'[Year]))
VAR PriorYearRev = CALCULATE(SUM(Bookings[Total_Revenue]), SAMEPERIODLASTYEAR('Calendar'[Date]))
RETURN
DIVIDE(CurrentYearRev - PriorYearRev, PriorYearRev, 0)

// Power BI DAX - Dynamic Occupancy Rate
Occupancy_Rate_Pct = 
DIVIDE(
    SUM(Listings_Daily[Booked_Days]),
    SUM(Listings_Daily[Available_Days]) + SUM(Listings_Daily[Booked_Days]),
    0
) * 100`,
  },
  {
    id: 'sql-1',
    title: 'Data Ingestion & Star Schema Warehouse ETL (SQL)',
    category: 'SQL ETL',
    language: 'sql',
    description: 'Cleanses raw Airbnb CSV listings and bookings into an optimized Star Schema (Fact_Bookings, Dim_Listings, Dim_City).',
    code: `-- SQL ETL - Create Clean Fact_Bookings Table with Winsorized Outliers
CREATE TABLE warehouse.fact_airbnb_bookings AS
SELECT 
    b.booking_id,
    b.listing_id,
    l.city_code,
    b.check_in_date,
    b.nights_booked,
    -- Handle Outliers: Cap nightly rates above 99th percentile ($1,850)
    CASE 
        WHEN b.nightly_price_usd > 1850 THEN 1850 
        ELSE b.nightly_price_usd 
    END AS cleaned_nightly_price_usd,
    b.nights_booked * b.nightly_price_usd AS gross_revenue_usd,
    COALESCE(b.cancellation_flag, 0) AS is_cancelled,
    b.review_rating
FROM staging_raw_bookings b
INNER JOIN dim_airbnb_listings l ON b.listing_id = l.listing_id
WHERE b.check_in_date >= '2023-01-01'
  AND b.listing_id IS NOT NULL;`,
  },
  {
    id: 'py-1',
    title: 'Prophet + XGBoost Revenue Forecasting Pipeline (Python)',
    category: 'Python ML (Prophet/XGBoost)',
    language: 'python',
    description: 'Deploys an ensemble time-series forecast combining Facebook Prophet additive seasonality with XGBoost gradient boosting.',
    code: `# Python - Prophet & XGBoost Hybrid Revenue Forecast
import pandas as pd
import numpy as np
from prophet import Prophet
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_percentage_error

# 1. Fit Prophet model for additive seasonality & trend
df_prophet = df[['check_in_date', 'daily_revenue']].rename(
    columns={'check_in_date': 'ds', 'daily_revenue': 'y'}
)
model_prophet = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=True,
    interval_width=0.95,
    changepoint_prior_scale=0.05
)
model_prophet.add_country_holidays(country_name='US')
model_prophet.fit(df_prophet)

# 2. Extract Prophet residuals & fit XGBoost on calendar features
forecast_prophet = model_prophet.predict(df_prophet[['ds']])
df['prophet_pred'] = forecast_prophet['yhat']
df['residual'] = df['daily_revenue'] - df['prophet_pred']

# XGBoost features: day_of_week, month, is_weekend, city_competition_idx
X = df[['day_of_week', 'month', 'is_weekend', 'competition_index']]
y_res = df['residual']
xgb_model = XGBRegressor(n_estimators=150, learning_rate=0.03, max_depth=5)
xgb_model.fit(X, y_res)

# 3. Final Hybrid Forecast = Prophet_Yhat + XGBoost_Residual_Prediction
print("Hybrid MAPE:", mean_absolute_percentage_error(df['daily_revenue'], df['prophet_pred'] + xgb_model.predict(X)))`,
  },
  {
    id: 'nlp-1',
    title: 'Customer Review NLP Sentiment & Topic Extraction (Python)',
    category: 'NLP Preprocessing',
    language: 'python',
    description: 'Classifies customer reviews into Positive/Neutral/Negative and extracts top complaint keywords using TF-IDF & VADER.',
    code: `# Python - Customer Review NLP & Complaint Extraction
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

sia = SentimentIntensityAnalyzer()

def classify_sentiment(text):
    score = sia.polarity_scores(str(text))['compound']
    if score >= 0.05: return 'positive'
    elif score <= -0.05: return 'negative'
    else: return 'neutral'

df_reviews['sentiment'] = df_reviews['review_comment'].apply(classify_sentiment)

# Extract top negative n-grams for Root Cause Analysis
neg_reviews = df_reviews[df_reviews['sentiment'] == 'negative']['review_comment']
tfidf = TfidfVectorizer(ngram_range=(2, 3), max_features=15, stop_words='english')
matrix = tfidf.fit_transform(neg_reviews)
top_complaints = pd.DataFrame(
    matrix.sum(axis=0).T, 
    index=tfidf.get_feature_names_out(), 
    columns=['tfidf_score']
).sort_values(by='tfidf_score', ascending=False)
print("Top Complaint N-Grams:\n", top_complaints.head(5))`,
  },
];
