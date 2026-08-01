# 🏠 Airbnb Revenue & Business Intelligence Dashboard

![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue)
![Power BI](https://img.shields.io/badge/BI-Power%20BI-yellow)
![Python](https://img.shields.io/badge/Data%20Analysis-Python-green)
![License](https://img.shields.io/badge/License-Apache%202.0-orange)

## 📌 Project Overview

Airbnb hosts and property managers often struggle to understand what factors influence revenue growth, occupancy rate, pricing decisions, and guest satisfaction.

This project builds an end-to-end **Business Intelligence and Analytics solution** to analyze Airbnb listing performance using data analytics, visualization, machine learning techniques, and an interactive dashboard.

The solution combines:

* Business KPI reporting
* Revenue and occupancy analysis
* Pricing strategy simulation
* Host performance evaluation
* Guest review sentiment analysis
* Revenue forecasting
* Interactive React-based dashboard

The goal is to transform raw Airbnb listing and review data into actionable business insights that can help hosts make better pricing and operational decisions.

---

# 🎯 Business Problem

Airbnb hosts need answers to questions like:

* Which cities generate the highest revenue?
* How does pricing impact occupancy?
* What factors improve guest ratings?
* Which hosts perform better?
* What are the most common guest complaints?
* How can future revenue trends be predicted?

This project provides a data-driven approach to answer these questions.

---

# 📊 Dataset

Dataset Source:

Maven Analytics Data Playground – Airbnb Listings & Reviews Dataset

The dataset contains real-world Airbnb listing and review information including:

* Property details
* Location information
* Pricing information
* Availability
* Host information
* Guest reviews
* Ratings
* Geographic coordinates

Dataset Link:
https://mavenanalytics.io/data-playground/airbnb-listings-reviews

---

# 🚀 Key Features

| Module              | Description                                      |
| ------------------- | ------------------------------------------------ |
| Executive Dashboard | Revenue, ADR, occupancy and performance KPIs     |
| Revenue Analysis    | City-wise revenue comparison and trends          |
| Forecasting Model   | Time-series based revenue prediction             |
| Pricing Simulator   | Analyze price vs occupancy relationship          |
| Host Scorecard      | Evaluate host performance using multiple metrics |
| Sentiment Analysis  | Identify guest satisfaction and complaints       |
| Geospatial Analysis | Location-based revenue and occupancy insights    |
| Investment Matrix   | Compare market opportunities across cities       |

---

# 🏗️ Project Architecture

```
Raw Airbnb Data
        |
        ↓
Data Cleaning & Transformation
(Python Pandas)
        |
        ↓
SQL Star Schema Design
        |
        ↓
Analytics Layer
(Forecasting + NLP Sentiment)
        |
        ↓
Dashboard Layer
(Power BI + React + TypeScript)
```

---

# 🗂️ Data Model (Star Schema)

```
             Dim_City
                |
                |
Dim_Listings --- Fact_Bookings --- Dim_Date
                |
                |
             Dim_Host
```

### Fact Table

**Fact_Bookings**

Contains:

* Booking information
* Revenue
* Nightly price
* Occupancy status
* Review score
* Sentiment score

### Dimension Tables

* Listing Details
* City Information
* Host Information
* Date Dimension

---

# 📈 Business KPIs

The dashboard tracks:

* Total Revenue
* Average Daily Rate (ADR)
* Occupancy Rate
* RevPAR
* Average Review Score
* Host Performance Score
* Cancellation Rate
* Revenue Growth Trend

---

# 🧮 Data Analysis & Modeling

## Revenue Forecasting

Implemented time-series forecasting to identify future revenue trends using:

* Trend analysis
* Seasonal patterns
* Forecast evaluation metrics

---

## Pricing Sensitivity Analysis

Analyzes how pricing changes can impact occupancy:

```
Occupancy Change =
Price Elasticity × Price Change × Base Occupancy
```

---

## Guest Review Sentiment Analysis

Applied NLP techniques:

* VADER sentiment scoring
* TF-IDF keyword extraction

Identified common complaint categories:

* Check-in experience
* Cleanliness issues
* Communication problems

---

# 🔍 Key Insights

### 📌 Pricing Strategy

* Demand increases during weekends and peak seasons.
* Dynamic pricing can improve revenue compared to fixed pricing.

### 📌 Host Performance

* Faster host response time is associated with better guest ratings.
* High-performing hosts maintain stronger customer satisfaction.

### 📌 Customer Experience

* Negative reviews are mainly driven by recurring service issues.
* Improving operational quality can increase ratings and retention.

---

# 🖥️ Live Dashboard

🚀 Deployment:

https://6a6e09a9c7d3d1d1c639d37d--fantastic-kangaroo-845a83.netlify.app/

---

# 🛠️ Tech Stack

## Data Analytics

* Python
* Pandas
* NumPy
* Matplotlib
* NLP Techniques

## Business Intelligence

* Power BI
* DAX Measures
* Data Modeling

## Frontend Dashboard

* React.js
* TypeScript
* Vite
* Tailwind CSS

## Database

* SQL
* Star Schema Modeling

---

# 📂 Project Structure

```
airbnb-revenue-bi-dashboard/

│
├── src/
│   ├── components/
│   ├── data/
│   ├── utils/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
├── dataset/
├── README.md
├── package.json
└── LICENSE
```

---

# ⚙️ Installation & Setup

Clone repository:

```bash
git clone <repository-url>
```

Navigate into project:

```bash
cd airbnb-revenue-bi-dashboard
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

---

# 💡 What I Learned

Through this project, I gained practical experience in:

* Building an end-to-end analytics pipeline
* Designing BI-friendly data models
* Creating business dashboards
* Writing analytical DAX measures
* Applying NLP on customer reviews
* Understanding revenue optimization strategies
* Communicating insights through data visualization

---

# 🔮 Future Improvements

* Real-time Airbnb API integration
* Advanced ML-based occupancy prediction
* Automated pricing recommendation engine
* Customer churn prediction
* Cloud deployment with real-time database

---

# 📜 License

This project is licensed under the Apache License 2.0.
