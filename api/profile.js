import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.apiUrl;

const fetchUserProfile = async () => {
  try {
    // Step 1: Retrieve userId from AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      throw new Error("User ID is missing. Please log in again.");
    }

    // Step 2: Make API request
    const response = await fetch(`${API_URL}/userDetails/getuserdetails.php`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    // Step 3: Check HTTP response status
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Step 4: Parse JSON response
    const result = await response.json();
    console.log("User Profile API Response:", result);

    // Step 5: Validate and return user data
    if (result.Success && result.userData) {
      return {
        ...result.userData,
        success: true
      };
    } else {
      return {
        error: result.Message || "Failed to load user profile",
        success: false
      };
    }

  } catch (error) {
    console.error("User Profile Fetch Error:", error.message);
    return {
      error: error.message,
      success: false
    };
  }
};

export default fetchUserProfile;
