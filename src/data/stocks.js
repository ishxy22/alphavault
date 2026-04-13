export const DEFAULT_STOCKS = [
  { id: 1, name: "Reliance Industries", ticker: "RELIANCE", price: 2850, expectedReturn: 14.5, riskScore: 4, sector: "Energy", marketCap: "Large" },
  { id: 2, name: "Infosys", ticker: "INFY", price: 1620, expectedReturn: 18.2, riskScore: 3, sector: "Technology", marketCap: "Large" },
  { id: 3, name: "HDFC Bank", ticker: "HDFCBANK", price: 1540, expectedReturn: 12.8, riskScore: 3, sector: "Banking", marketCap: "Large" },
  { id: 4, name: "TCS", ticker: "TCS", price: 3950, expectedReturn: 16.4, riskScore: 3, sector: "Technology", marketCap: "Large" },
  { id: 5, name: "Wipro", ticker: "WIPRO", price: 480, expectedReturn: 15.1, riskScore: 4, sector: "Technology", marketCap: "Large" },
  { id: 6, name: "Asian Paints", ticker: "ASIANPAINT", price: 2940, expectedReturn: 13.6, riskScore: 3, sector: "Consumer", marketCap: "Large" },
  { id: 7, name: "Bajaj Finance", ticker: "BAJFINANCE", price: 7200, expectedReturn: 22.5, riskScore: 6, sector: "Finance", marketCap: "Large" },
  { id: 8, name: "Tata Motors", ticker: "TATAMOTORS", price: 920, expectedReturn: 25.0, riskScore: 7, sector: "Auto", marketCap: "Large" },
  { id: 9, name: "Sun Pharma", ticker: "SUNPHARMA", price: 1350, expectedReturn: 17.3, riskScore: 5, sector: "Pharma", marketCap: "Large" },
  { id: 10, name: "Zomato", ticker: "ZOMATO", price: 185, expectedReturn: 35.0, riskScore: 8, sector: "Technology", marketCap: "Mid" },
  { id: 11, name: "Paytm", ticker: "PAYTM", price: 450, expectedReturn: 40.0, riskScore: 9, sector: "Finance", marketCap: "Mid" },
  { id: 12, name: "Adani Green", ticker: "ADANIGREEN", price: 1680, expectedReturn: 28.0, riskScore: 8, sector: "Energy", marketCap: "Large" },
  { id: 13, name: "IRFC", ticker: "IRFC", price: 185, expectedReturn: 11.2, riskScore: 2, sector: "Finance", marketCap: "Large" },
  { id: 14, name: "Coal India", ticker: "COALINDIA", price: 440, expectedReturn: 10.5, riskScore: 2, sector: "Energy", marketCap: "Large" },
  { id: 15, name: "Dixon Technologies", ticker: "DIXON", price: 9800, expectedReturn: 32.0, riskScore: 7, sector: "Technology", marketCap: "Mid" },
  { id: 16, name: "Delhivery", ticker: "DELHIVERY", price: 390, expectedReturn: 29.0, riskScore: 8, sector: "Logistics", marketCap: "Mid" },
  { id: 17, name: "ITC", ticker: "ITC", price: 460, expectedReturn: 12.0, riskScore: 2, sector: "Consumer", marketCap: "Large" },
  { id: 18, name: "Maruti Suzuki", ticker: "MARUTI", price: 11200, expectedReturn: 14.8, riskScore: 4, sector: "Auto", marketCap: "Large" },
];

export const SECTORS = ["Technology", "Banking", "Finance", "Energy", "Consumer", "Pharma", "Auto", "Logistics", "Healthcare", "FMCG", "Real Estate", "Other"];
export const MARKET_CAPS = ["Large", "Mid", "Small"];

export const RISK_LABELS = {
  1: "Ultra Safe",
  2: "Very Low",
  3: "Low",
  4: "Moderate",
  5: "Medium",
  6: "Medium-High",
  7: "High",
  8: "Very High",
  9: "Aggressive",
  10: "Speculative"
};

export const RISK_QUIZ = [
  {
    id: 1,
    question: "What is your primary investment goal?",
    options: [
      { text: "Capital preservation — keep money safe", score: 1 },
      { text: "Steady income — regular returns needed", score: 3 },
      { text: "Balanced growth — moderate returns are fine", score: 5 },
      { text: "Aggressive growth — maximum returns desired", score: 8 },
    ]
  },
  {
    id: 2,
    question: "What will you do if your portfolio drops by 20%??",
    options: [
      { text: "I will sell everything — can't handle losses", score: 1 },
      { text: "I will sell some, keep some", score: 3 },
      { text: "I will wait — the market will recover.", score: 6 },
      { text: "I will buy more — golden opportunity!", score: 9 },
    ]
  },
  {
    id: 3,
    question: "How long do you plan to invest?",
    options: [
      { text: "Less than 6 months", score: 1 },
      { text: "1–2 years", score: 3 },
      { text: "3–5 years", score: 6 },
      { text: "5+ years", score: 9 },
    ]
  },
  {
    id: 4,
    question: "How much of your monthly income can you invest?",
    options: [
      { text: "Less than 5%", score: 2 },
      { text: "5–15%", score: 4 },
      { text: "15–30%", score: 7 },
      { text: "More than 30%", score: 9 },
    ]
  },
  {
    id: 5,
    question: "How much of your monthly income can you invest?",
    options: [
      { text: "Beginner — I am just learning", score: 1 },
      { text: "Basic — I know a little", score: 3 },
      { text: "Intermediate — I follow it actively", score: 6 },
      { text: "Advanced — experienced investor", score: 9 },
    ]
  }
];
