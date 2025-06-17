// utils/checkAuthToken.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const checkAuthToken = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const userEmail = await AsyncStorage.getItem('userEmail');

    if (userId && userEmail) {
      return { userId, userEmail };
    }

    return null;
  } catch (error) {
    console.error("Error checking auth token:", error);
    return null;
  }
};

export default checkAuthToken;
