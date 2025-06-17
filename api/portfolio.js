import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig.extra.apiUrl;

// --- XIRR Calculation Function ---
function xirr(cashflows, guess = 0.1) {
  const maxIter = 100;
  const tol = 1e-6;

  const daysBetween = (d1, d2) => (d2 - d1) / (1000 * 60 * 60 * 24);

  const xnpv = (rate, cashflows) => {
    const d0 = cashflows[0].date;
    return cashflows.reduce((sum, { amount, date }) => {
      return sum + amount / Math.pow(1 + rate, daysBetween(d0, date) / 365);
    }, 0);
  };

  const derivative = (rate, cashflows) => {
    const d0 = cashflows[0].date;
    return cashflows.reduce((sum, { amount, date }) => {
      const t = daysBetween(d0, date) / 365;
      return sum - (t * amount) / Math.pow(1 + rate, t + 1);
    }, 0);
  };

  let rate = guess;
  for (let i = 0; i < maxIter; i++) {
    const value = xnpv(rate, cashflows);
    const deriv = derivative(rate, cashflows);
    const newRate = rate - value / deriv;
    if (Math.abs(newRate - rate) < tol) return newRate;
    rate = newRate;
  }

  return null;
}


const fetchPortfolioData = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      throw new Error('User ID is missing. Please log in again.');
    }

    const response = await fetch(`${API_URL}/Portfolio/getFolioData.php`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Portfolio API Response:', result);

    if (!result.Success || !Array.isArray(result.statusData)) {
      return {
        purchase_amount: "0.00",
        current_value: "0.00",
        pl: "0.00",
        plPercent: "0.00",
        rawData: [],
        error: result.Message || "No data available"
      };
    }

    const totals = result.statusData.reduce((acc, row) => {
      acc.purchase_amount += parseFloat(row.purchase_amount) || 0;
      acc.current_value += parseFloat(row.current_value) || 0;
      return acc;
    }, { purchase_amount: 0, current_value: 0 });

    const pl = totals.current_value - totals.purchase_amount;
    const plPercent = totals.purchase_amount > 0 ? (pl * 100) / totals.purchase_amount : 0;

    

    const today = new Date();
const cashflows = [];

// Push investments as negative cash flows
result.statusData.forEach(row => {
  const amt = parseFloat(row.purchase_amount);
  const date = new Date(row.bought_date);
  if (!isNaN(amt) && amt > 0) {
    cashflows.push({ amount: -amt, date });
  }
});

// Push current value as positive cash flow (today)
if (totals.current_value > 0) {
  cashflows.push({ amount: totals.current_value, date: today });
}

let xirrValue = '—';
if (cashflows.length > 1) {
  const rate = xirr(cashflows);
  if (rate !== null && isFinite(rate)) {
    xirrValue = (rate * 100).toFixed(2); // Convert to %
  }
}



    return {
      purchase_amount: totals.purchase_amount.toFixed(2),
      current_value: totals.current_value.toFixed(2),
      pl: pl.toFixed(2),
      plPercent: plPercent.toFixed(2),
      rawData: result.statusData,
      xirr: xirrValue,
      success: true
    };

  } catch (error) {
    console.error('Portfolio Fetch Error:', error.message);
    return {
      purchase_amount: "0.00",
      current_value: "0.00",
      pl: "0.00",
      plPercent: "0.00",
      rawData: [],
      error: error.message
    };
  }
};

export default fetchPortfolioData;

