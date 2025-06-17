import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, BackHandler
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = Constants.expoConfig.extra.apiUrl;

const HybridScreen = () => {
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

  const categoryOptions = ['Hybrid'];

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
        const categoryMap = {
          'Small Cap': 'small_cap',
          'Large Cap': 'large_cap',
          'Mid Cap': 'mid_cap',
          'Multi Cap': 'multi_cap',
          'Focussed': 'focussed',
          'Other Equities': 'other_equities',
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
            setFundRouter: 'Hybrid',
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
      <Text style={styles.title}>Invest Now - Hybrid Funds</Text>

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
                  <Picker.Item key={index} label={scheme.product_long_name} value={scheme.product_long_name} />
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
                  style={[styles.actionButton, styles.buyButton, !isAmountValid && styles.disabledButton]}
                  onPress={handleBuy}
                  disabled={!isAmountValid}
                >
                  <Text style={styles.buttonText}>Buy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.sipButton, !isAmountValid && styles.disabledButton]}
                  onPress={() => {
                    if (!selectedSchemeData) {
                      Alert.alert('Error', 'Please select a valid scheme before proceeding to SIP.');
                      return;
                    }
                    navigation.navigate('SIPRequest', {
                      fundHouse: fundHouseOptions.find(f => f.value === fundHouse)?.label || fundHouse,
                      schemeName: selectedSchemeData.product_long_name,
                      fromScreen: 'HybridScreen'
                    });
                  }}
                  disabled={!isAmountValid}
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
    marginVertical: 12,
    borderRadius: 6,
    fontSize: 16,
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#3CB371',
  },
  sipButton: {
    backgroundColor: '#4169E1',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HybridScreen;
