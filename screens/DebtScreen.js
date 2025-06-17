import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, BackHandler
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = Constants.expoConfig.extra.apiUrl;

const DebtScreen = () => {
  const navigation = useNavigation();

  const [fundHouse, setFundHouse] = useState('');
  const [fundCategory, setFundCategory] = useState('');
  const [schemeName, setSchemeName] = useState('');
  const [amount, setAmount] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [fundHouseOptions, setFundHouseOptions] = useState([]);
  const [schemeOptions, setSchemeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schemesLoading, setSchemesLoading] = useState(false);

  // Updated debt categories
  const categoryOptions = ['Other Debt', 'Bond', 'Credit Risk', 'STP', 'GILT', 'Cash Liquid'];

  useEffect(() => {
    const fetchFundHouses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/buySell/getAllFundHouseNames.php`);
        const result = await response.json();
        if (result.Success && Array.isArray(result.FundHouse)) {
          const houseOptions = result.FundHouse.map(item => ({
            label: item.LONG_NAME,
            value: item.AMC_CODE,
          }));
          setFundHouseOptions(houseOptions);
        } else {
          Alert.alert('Error', 'Failed to load fund house names.');
        }
      } catch (error) {
        console.error('Error fetching fund house names:', error);
        Alert.alert('Error', 'An error occurred while fetching fund house names.');
      } finally {
        setLoading(false);
      }
    };

    fetchFundHouses();
  }, []);

  useEffect(() => {
    const fetchSchemes = async (house, category) => {
      if (!house || !category) {
        setSchemeOptions([]);
        return;
      }

      setSchemesLoading(true);
      try {
        // Updated mapping for debt categories
        const categoryMap = {
          'Other Debt': 'other_debt',
          'Bond': 'bond',
          'Credit Risk': 'credit_risk',
          'STP': 'stp',
          'GILT': 'gilt',
          'Cash Liquid': 'cash_liquid',
        };

        const backendCategory = categoryMap[category] || category.toLowerCase();

        const response = await fetch(`${API_BASE_URL}/buySell/getAllFundHouseSchemeNames.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            setFundHouse1: house,
            setFundCategory: backendCategory,
            setFundRouter: 'Debt',
          }),
        });

        const responseText = await response.text();
        const result = JSON.parse(responseText);

        if (result.Success && Array.isArray(result.SchemeName)) {
          setSchemeOptions(result.SchemeName);
        } else {
          setSchemeOptions([]);
          Alert.alert('Info', result.Message || 'No schemes available for the selected criteria');
        }
      } catch (error) {
        console.error('Error fetching scheme names:', error);
        Alert.alert('Error', 'Failed to fetch scheme names');
        setSchemeOptions([]);
      } finally {
        setSchemesLoading(false);
      }
    };

    fetchSchemes(fundHouse, fundCategory);
  }, [fundHouse, fundCategory]);

  const selectedSchemeData = schemeOptions.find(s => s.product_long_name === schemeName);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('MainApp', { screen: 'Discover' });
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const isAmountValid = () => {
    return amount && !isNaN(amount) && parseFloat(amount) > 0;
  };

  const handleBuy = async () => {
    if (!isAmountValid()) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to proceed.');
      return;
    }

    if (!selectedSchemeData?.product_code || !fundHouse) {
      Alert.alert('Error', 'Missing scheme or fund house information.');
      return;
    }

    try {
      const storedUserId = await AsyncStorage.getItem('user_id');

      if (!storedUserId) {
        Alert.alert('Login Required', 'User ID not found. Please log in again.');
        return;
      }

      const payload = {
        user_id: storedUserId,
        buyingAmount: amount,
        buyingfundId: fundHouse,
        buyingSchemeProductCode: selectedSchemeData.product_code,
      };

      console.log('Payload to be sent:', payload);

      const response = await fetch(`${API_BASE_URL}/buySell/mutual_fundBuy.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Buy API response:', result);

      if (result.Success) {
        Alert.alert(
          'Redirecting to Payment',
          result.returnMessage || 'Click OK to continue.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (result.PaymentLink) {
                  Linking.openURL(result.PaymentLink);
                } else {
                  Alert.alert('Error', 'Payment link not found.');
                }
              },
            },
          ]
        );
        setAmount('');
        setShowResult(false);
      } else {
        Alert.alert('Transaction Failed', result.returnMessage ?? result.Message ?? 'Unable to complete purchase.');
      }
    } catch (error) {
      console.error('Error during buy operation:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invest Now - Debt Funds</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2E8B57" />
      ) : (
        <>
          <View style={styles.dropdownWrapper}>
            <Text style={styles.label}>Fund House</Text>
            <Picker
              selectedValue={fundHouse}
              onValueChange={(value) => {
                setFundHouse(value);
                setShowResult(false);
                setSchemeName('');
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Fund House" value="" />
              {fundHouseOptions.map((option, index) => (
                <Picker.Item key={index} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>

          <View style={styles.dropdownWrapper}>
            <Text style={styles.label}>Fund Category</Text>
            <Picker
              selectedValue={fundCategory}
              onValueChange={(value) => {
                setFundCategory(value);
                setShowResult(false);
                setSchemeName('');
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value="" />
              {categoryOptions.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker>
          </View>

          <View style={styles.dropdownWrapper}>
            <Text style={styles.label}>Scheme Name</Text>
            {schemesLoading ? (
              <ActivityIndicator size="small" color="#888" />
            ) : (
              <Picker
                selectedValue={schemeName}
                onValueChange={(value) => {
                  setSchemeName(value);
                  setShowResult(false);
                }}
                style={styles.picker}
                enabled={schemeOptions.length > 0}
              >
                <Picker.Item label="Select Scheme" value="" />
                {schemeOptions.map((scheme, index) => (
                  <Picker.Item
                    key={index}
                    label={scheme.product_long_name}
                    value={scheme.product_long_name}
                  />
                ))}
              </Picker>
            )}
          </View>

          <TouchableOpacity
            style={[styles.proceedButton, !(fundHouse && fundCategory && schemeName) && { backgroundColor: '#ccc' }]}
            onPress={() => {
              if (fundHouse && fundCategory && schemeName) {
                setShowResult(true);
              } else {
                Alert.alert('Incomplete Selection', 'Please select Fund House, Category, and Scheme Name before proceeding.');
              }
            }}
            disabled={!(fundHouse && fundCategory && schemeName)}
          >
            <Text style={styles.proceedText}>Proceed</Text>
          </TouchableOpacity>

          {showResult && selectedSchemeData && (
            <View style={styles.card}>
              <Text style={styles.infoText}>Scheme Name: {selectedSchemeData.product_long_name}</Text>
              <Text style={styles.infoText}>Category: {fundCategory}</Text>

              <TextInput
                placeholder="Enter Amount"
                style={styles.amountInput}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.buyButton, !isAmountValid() && { backgroundColor: '#ccc' }]}
                  onPress={handleBuy}
                  disabled={!isAmountValid()}
                >
                  <Text style={styles.buttonText}>Buy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: isAmountValid() ? '#4169E1' : '#ccc' }
                  ]}
                  onPress={() => {
                    if (!selectedSchemeData || !isAmountValid()) return;
                    navigation.navigate('SIPRequest', {
                      fundHouse: fundHouseOptions.find(f => f.value === fundHouse)?.label || fundHouse,
                      schemeName: selectedSchemeData.product_long_name,
                      fromScreen: 'DebtScreen'
                    });
                  }}
                  disabled={!isAmountValid()}
                >
                  <Text style={styles.buttonText}>SIP</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5FFFA',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdownWrapper: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
    color: '#333',
  },
  picker: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E8B57',
  },
  proceedButton: {
    backgroundColor: '#2E8B57',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  proceedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    padding: 16,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
    borderColor: '#2E8B57',
    borderWidth: 1,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#2E8B57',
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#2E8B57',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DebtScreen;
