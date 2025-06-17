import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig.extra.apiUrl;

const fetchFullPortfolioData = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      console.log('User ID is missing. Please log in again.');
      return { statusData: [] };
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
      console.log(`Server error: ${response.status}`);
      return { statusData: [] };
    }

    const result = await response.json();
    
    if (!result.Success || !Array.isArray(result.statusData)) {
      console.log('Invalid response format:', result);
      return { statusData: [] };
    }

    // Return the data in the format your component expects
    return {
      statusData: result.statusData.filter(fund =>
        parseFloat(fund.purchase_amount) > 0 &&
        parseFloat(fund.units_allocated) > 0
      )
    };

  } catch (error) {
    console.error('Full Portfolio Fetch Error:', error.message);
    return { statusData: [] };
  }
};

export default fetchFullPortfolioData;
