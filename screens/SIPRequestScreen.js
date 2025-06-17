import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  BackHandler,
  ActivityIndicator,
  Linking
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig.extra.apiUrl;
const getFutureDate = (yearsToAdd) => {
  const today = new Date();
  today.setFullYear(today.getFullYear() + yearsToAdd);
  return today.toISOString().split('T')[0];
};


const SIPRequestScreen = ({ route }) => {
  const navigation = useNavigation();
  const {
    fundHouse,        // AMC_CODE (e.g. "B")
    schemeName,       // Scheme code (e.g. "341QD")
    displayFundHouse = fundHouse,    // Fallback to code if display name not provided
    displaySchemeName = schemeName,  // Fallback to code if display name not provided
    fromScreen
  } = route.params;

  const [sipDay, setSipDay] = useState('1');
  const [sipDuration, setSipDuration] = useState('1');
  const [initialAmount, setInitialAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!initialAmount || !monthlyAmount) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (isNaN(initialAmount) || isNaN(monthlyAmount)) {
      Alert.alert('Invalid Amount', 'Please enter valid numeric values.');
      return;
    }

    setIsLoading(true);

    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        Alert.alert('Error', 'User not logged in');
        setIsLoading(false);
        return;
      }

      const payload = {
  user_id,
  buyingAmount: initialAmount,
  buyingfundId: fundHouse,
  buyingSchemeProductCode: schemeName,
  sipDay: sipDay.replace(/\D/g, ''),
  sipyear: sipDuration.replace(/\D/g, ''),
  sipAmt: monthlyAmount,
  fromDate: getFutureDate(0), // optional helper for today's or future date
  toDate: getFutureDate(parseInt(sipDuration)) // optional helper for calculated toDate
};


      console.log('Sending payload:', payload);

      const response = await fetch(`${API_BASE_URL}/buySell/Sip/sipExceptionBuy.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Buy API response:', result);

      Alert.alert(
        result.Success ? 'SIP Request Successful' : 'SIP Request Failed',
        result.returnMessage || JSON.stringify(result),
        [
          {
            text: 'OK',
            onPress: () => {
              if (result.Success && result.PaymentLink) {
                Linking.openURL(result.PaymentLink);
              }
              if (result.Success) {
                navigation.goBack();
              }
            }
          }
        ]
      );

    } catch (error) {
      console.error('Error submitting SIP request:', error);
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (fromScreen) {
        navigation.navigate(fromScreen);
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [fromScreen, navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Put SIP Request</Text>

      <View style={styles.formBox}>
        <Text style={styles.label}>Fund House Name</Text>
        <Text style={styles.value}>{displayFundHouse}</Text>

        <Text style={styles.label}>Scheme Name</Text>
        <Text style={styles.value}>{displaySchemeName}</Text>

        <Text style={styles.label}>Day of SIP</Text>
        <Picker selectedValue={sipDay} onValueChange={setSipDay} style={styles.picker}>
          {['1', '5', '10', '15', '20','25'].map((day) => (
            <Picker.Item label={`Every ${day}`} value={day} key={day} />
          ))}
        </Picker>

        <Text style={styles.label}>Duration of SIP</Text>
        <Picker selectedValue={sipDuration} onValueChange={setSipDuration} style={styles.picker}>
          {['1','2' ,'3','4', '5','6','7','8','9' ,'10','11','12','13','14','15'].map((dur) => (
            <Picker.Item label={`${dur} Year${dur !== '1' ? 's' : ''}`} value={dur} key={dur} />
          ))}
        </Picker>

        <Text style={styles.label}>Initial Amount (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Initial Amount"
          keyboardType="numeric"
          value={initialAmount}
          onChangeText={setInitialAmount}
        />

        <Text style={styles.label}>Monthly SIP Amount (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Monthly SIP Amount"
          keyboardType="numeric"
          value={monthlyAmount}
          onChangeText={setMonthlyAmount}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Request SIP</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f0f6ff', flexGrow: 1 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#001f7f',
    marginBottom: 20
  },
  formBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 2
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
    fontSize: 16
  },
  value: {
    marginBottom: 15,
    fontSize: 16,
    color: '#111',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5
  },
  picker: {
    backgroundColor: '#e6f0ff',
    borderRadius: 5,
    marginBottom: 15
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default SIPRequestScreen;
