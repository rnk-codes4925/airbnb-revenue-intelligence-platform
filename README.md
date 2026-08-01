# Airbnb Revenue & Business Intelligence Dashboard

A portfolio project analyzing Airbnb listing performance across 15 global cities — covering revenue trends, occupancy patterns, host performance, and guest review sentiment. Built as an end-to-end BI case study combining Power BI, Python, and a React-based interactive dashboard.

![License](https://img.shields.io/badge/License-Apache--2.0-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Vite](https://img.shields.io/badge/Vite-6-646CFF)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Status](https://img.shields.io/badge/Status-Portfolio%20Project-orange)

## Table of Contents
1. Project Overview
2. Features
3. Architecture
4. Data Model (Star Schema)
5. Analysis & Modeling Approach
6. Dataset
7. Key Insights
8. Getting Started
9. Project Structure
10. What I Learned
11. License

## Project Overview
Short-term rental hosts and property managers often lack visibility into which factors most affect revenue — pricing, seasonality, occupancy, or guest satisfaction. This project simulates that analysis: cleaning and modeling booking data, building a Power BI-style KPI dashboard, and layering in basic forecasting and review-sentiment analysis to practice full-stack data analytics skills.

Note: This uses a synthetic/sample dataset for learning and demonstration purposes — figures are illustrative, not real business results.

## Features
| Module | What It Does |
|---|---|
| Executive Dashboard | City-wise revenue, ADR, occupancy, and YoY trend KPIs |
| Revenue Forecasting | Basic time-series forecast (trend + seasonality) with confidence range |
| Pricing Simulator | Interactive slider showing hypothetical price vs. occupancy tradeoff |
| Investment Matrix | ROI comparison across 15 cities based on modeled assumptions |
| Host Scorecard | Weighted score (revenue, occupancy, reviews, response time, cancellations) |
| Review Sentiment | Sentiment classification (VADER) with common complaint keyword extraction |
| Geospatial Map | City-level markers plotting revenue and occupancy density |
| Data Cleaning Log | Documents missing-value handling and outlier treatment steps |

## Architecture

Raw Data (CSV)
|
v
Data Cleaning (missing values, outlier handling)
|
v
SQL Star Schema (Fact_Bookings + Dim tables)
|
v
Analysis Layer (Python: forecasting + NLP sentiment)
|
v
Dashboard Layer (Power BI DAX measures / React UI)


## Data Model (Star Schema)
    Dim_Listings          Dim_City
         |                    |
         |     Fact_Bookings  |
         |----------X---------|
                    |
          Dim_Host      Dim_Date

Fact table: Fact_Bookings (booking_id, listing_id, host_id, date_id, nightly_rate, revenue, occupancy_flag, review_score, sentiment_score)

### Sample DAX Measures

Total Revenue = SUM(Fact_Bookings[revenue])
ADR = AVERAGE(Fact_Bookings[nightly_rate])
Occupancy Rate % =
DIVIDE(
CALCULATE(COUNTROWS(Fact_Bookings), Fact_Bookings[occupancy_flag] = 1),
COUNTROWS(Fact_Bookings)
)
RevPAR = [ADR] * [Occupancy Rate %]


## Analysis & Modeling Approach
- Forecasting: Time-series decomposition (trend + weekly seasonality) using Prophet, with an XGBoost layer to capture residual patterns. Evaluated using MAPE on a held-out test split.
- Pricing sensitivity: A simple elasticity-based formula estimates how occupancy might shift if price changes:
  Delta Occupancy = elasticity x (Delta Price / Current Price) x Base Occupancy
- Review sentiment: VADER sentiment scoring + TF-IDF n-grams to surface frequently mentioned complaint themes (e.g., check-in delays, cleanliness).

## Dataset
15 cities across 4 regions (e.g., Tokyo, London, Paris, New York, Dubai, Lisbon). Fields include nightly rate, occupancy, review score, host response time, and coordinates for mapping. (Synthetic dataset for practice purposes.)

## Key Insights
- Weekend and holiday periods show clear demand surges — supports dynamic pricing over flat rates.
- Listings with faster host response time and Superhost status correlate with higher review scores.
- A small set of recurring complaint themes (check-in process, cleanliness) account for a disproportionate share of negative reviews.

## Getting Started

Prerequisites: Node.js 18+/20+/22+, npm 9+, Git

git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
npm install
npm run dev


Open http://localhost:3000 in your browser.

Production build:

npm run build
npm run preview


## Project Structure

airbnb-revenue-bi-dashboard/
├── src/
│ ├── components/ # Dashboard UI modules
│ ├── data/ # Sample dataset + DAX/SQL reference
│ ├── types/ # TypeScript interfaces
│ ├── utils/ # Export/formatting helpers
│ ├── App.tsx
│ └── main.tsx
├── package.json
└── README.md


## What I Learned
Building this project helped me practice:
- Structuring a star-schema data model for BI reporting
- Writing DAX measures for KPI calculation
- Basic time-series forecasting and evaluating model accuracy
- Applying NLP sentiment analysis to unstructured review text
- Translating raw data into an interactive, recruiter-facing dashboard

## License
Released under the Apache License 2.0. See LICENSE for details.
