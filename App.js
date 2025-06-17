import React, { useState, useEffect } from "react";
import InvestmentScreen from './screens/Investment';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { fetchPortfolioData } from './api/portfolio';
import fetchPortfolioData from './api/portfolio';

import AboutUsScreen from './screens/AboutUsScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

import EquityScreen from './screens/EquityScreen';
import GoldScreen from './screens/GoldScreen';
import FOFScreen from './screens/FOFScreen';
import DebtScreen from './screens/DebtScreen';
import HybridScreen from './screens/HybridScreen';
import ArbitrageScreen from './screens/ArbitrageScreen';
import TaxSavingScreen from './screens/TaxSavingScreen';
import ETFScreen from './screens/ETFScreen';
import SIPRequestScreen from './screens/SIPRequestScreen'; // update path as needed

import  checkAuthToken  from './utils/authUtils';

import AccountScreen from './screens/Account';
import DiscoverScreen from './screens/Discover';
import { loginUser } from './api';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Platform } from 'react-native';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Animatable from "react-native-animatable";
//import ETFScreen from "./screens/ETFScreen";

const { width } = Dimensions.get("window");
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Animated Text Component
const AnimatedText = () => {
  const textLines = [
    "Goal-Based Approach",
    "Asset Allocation Focus",
    "Risk Profile and Research Based",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % textLines.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.animatedTextWrapper}>
      <Text style={styles.fixedText}>Investment Simplified</Text>
      <Animatable.Text
        key={currentIndex}
        animation="fadeIn"
        duration={800}
        style={styles.animatedText}
      >
        {textLines[currentIndex]}
      </Animatable.Text>
    </View>
  );
};

// Steps Section
const Steps = () => {
  return (
    <View style={styles.stepsContainer}>
      <Text style={styles.stepsTitle}>Start in 3 Easy Steps</Text>
      <View style={styles.step}>
        <Image source={require("./assets/step1.png")} style={styles.stepImage} />
        <Text style={styles.stepText}>Create login</Text>
      </View>
      <View style={styles.step}>
        <Image source={require("./assets/step2.png")} style={styles.stepImage} />
        <Text style={styles.stepText}>Mutual Fund KYC and Risk Profiling</Text>
      </View>
      <View style={styles.step}>
        <Image source={require("./assets/step3.png")} style={styles.stepImage} />
        <Text style={styles.stepText}>Start Investing</Text>
      </View>
    </View>
  );
};

// Home Screen
function HomeScreen() {
  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={require("./assets/banner.jpg")} style={styles.image} />
          <View style={styles.imageOverlay} />
          <View style={styles.overlay}>
            <AnimatedText />
          </View>
        </View>
        <Steps />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 All rights reserved LITMFIN.</Text>
      </View>
    </ScrollView>
  );
}

  function LoginScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Store user data in AsyncStorage
    const storeUserData = async (userData) => {
      try {
        // Store the user data (e.g., userID and userEmail) in AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        console.log("User data saved successfully.");
      } catch (error) {
        console.error("Error storing user data:", error);
      }
    };


    const handleLogin = async () => {
    // Prevent multiple clicks while loading
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (!username || !password) {
        Alert.alert('Error', 'Please enter both username and password');
        setIsLoading(false);
        return;
      }

      const response = await loginUser(username, password);
      console.log("Login Response:", response);

      if (response.Success) {
        const userId = response.userId;
        const userEmail = response.userEmail;

        if (userId) {
          // Use Promise.all to wait for all AsyncStorage operations
          await Promise.all([
            AsyncStorage.setItem('userId', userId.toString()),
            AsyncStorage.setItem('userEmail', userEmail)
          ]);
          
          console.log('User ID saved:', userId);
          
          // Ensure navigation happens after all async operations complete
          navigation.navigate("MainApp", {
    screen: "Dashboard",
    params: { userId: userId, username: userEmail || username },
  });
        } else {
          Alert.alert('Login Failed', 'User ID is missing.');
        }
      } else {
        Alert.alert("Login Failed", response.Message || "Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert("Error", error.message || "Network request failed");
    } finally {
      setIsLoading(false);
    }
  };
 // In LoginScreen.js, replace the handleForgotPassword function:
const handleForgotPassword = () => {
  navigation.navigate('ForgotPassword');
};

  return (
    <View style={styles.loginContainer}>
      <Image source={require("./assets/logo.png")} style={styles.loginLogo} />
      <Text style={styles.loginTitle}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
  


// User Home Screen (Dashboard)11
function UserHomeScreen({ route, navigation }) {
  const { username } = route.params || {};
  const [folio, setFolio] = useState({
    invested: '0.00',
    current: '0.00',
    pl: '0.00',
    plPercent: '0.00',
    xirr: '—',
    rawData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = await checkAuthToken();
        console.log("User data from checkAuthToken:", userData);
        if (!userData) {
          navigation.navigate('Login');
          return;
        }

        const data = await fetchPortfolioData();
        console.log('API Response:', JSON.stringify(data, null, 2));
        
        if (data.error) {
          setError(data.error);
        } else {
          setFolio({
            invested: data.purchase_amount || '0.00',
            current: data.current_value || '0.00',
            pl: data.pl || '0.00',
            plPercent: data.plPercent || '0.00',
            xirr: data.xirr || '—',
            rawData: data.rawData || []
          });
        }
      } catch (error) {
        console.error('Error loading portfolio data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigation]);

  if (loading) {
    return (
      <View style={[styles.homeContainer, styles.centered]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.homeContainer, styles.centered]}>
        <Text style={styles.errorText}>Error loading data</Text>
        <Text style={styles.subErrorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.replace('Dashboard')}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.homeContainer}>
      <View style={{ paddingTop: 30 }}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hi! </Text>
          <Text style={[styles.welcomeText, styles.boldText]}>{username || "User"}</Text>
        </View>
        <Text style={styles.subText}>Welcome to LitmFin</Text>

        <View style={styles.infoBox}>
          <Text style={styles.sectionTitle}>Your Investments</Text>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>P&L</Text>
              <Text style={[styles.profit, folio.pl.startsWith('-') ? styles.loss : styles.gain]}>
                ₹ {folio.pl}
              </Text>
              <Text style={[styles.percentage, folio.pl.startsWith('-') ? styles.loss : styles.gain]}>
                {folio.pl.startsWith('-') ? '' : '+'}{folio.plPercent}%
              </Text>
            </View>
            <View>
              <Text style={styles.label}>XIRR</Text>
              <TouchableOpacity>
                <Text style={styles.viewText}>
                  {folio.xirr !== '—' ? `${folio.xirr}%` : '—'}
                </Text>

              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Invested</Text>
              <Text style={styles.invested}>₹ {folio.invested}</Text>
            </View>
            <View>
              <Text style={styles.label}>Current</Text>
              <Text style={styles.current}>₹ {folio.current}</Text>
            </View>
          </View>
        </View>

        {folio.rawData.length > 0 ? (
          <TouchableOpacity 
            style={styles.portfolioLink} 
            onPress={() => navigation.navigate('Investments', { portfolioData: folio.rawData })}
          >
            <Text style={styles.portfolioLinkText}>
              View full portfolio ({folio.rawData.length} investments) →
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.emptyPortfolioText}>
            You don't have any investments yet
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

/* const DiscoverScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenTitle}>Discover</Text>
  </View>
); */



// Bottom Tab Navigator
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Dashboard") iconName = "home";
          else if (route.name === "Investments") iconName = "stats-chart";
          else if (route.name === "Discover") iconName = "compass";
          else if (route.name === "Account") iconName = "person";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ color }) => (
          <Text style={{ color, fontSize: 12 }}>{route.name}</Text>
        ),
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen 
  name="Dashboard" 
  component={UserHomeScreen}
  options={{ title: 'Dashboard' }}
/>
      <Tab.Screen 
        name="Investments" 
        component={InvestmentScreen}
      />
      
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      
      
      
      <Tab.Screen 
  name="Account" 
  component={AccountScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="person" size={size} color={color} />
    )
  }}
/>

      {/* <Tab.Screen 
  name="Investments" 
  component={InvestmentScreen} 
  options={{ 
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="stats-chart" size={size} color={color} />
    ) 
  }}
/> */}
    </Tab.Navigator>
  );
}
// Custom Header with Logo & Hamburger Menu
function CustomHeader({ navigation }) {
  return (
    <View style={styles.header}>
      <Image source={require("./assets/logo.png")} style={styles.logo} />
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.hamburger}>
        <Ionicons name="menu" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerPosition="right"
        drawerType="slide"
        screenOptions={{
          drawerStyle: { width: 250 },
          header: (props) => <CustomHeader navigation={props.navigation} />,
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen 
          name="About Us" 
          component={AboutUsScreen}
          options={{
            title: 'About Us',
            headerShown: true
          }}
        />
        <Drawer.Screen 
  name="ForgotPassword" 
  component={ForgotPasswordScreen}
  options={{
    drawerItemStyle: { display: 'none' },
    title: 'Reset Password',
    headerShown: true
  }}
/>
        <Drawer.Screen name="Login" component={LoginScreen} />
        
        <Drawer.Screen 
          name="MainApp" 
          component={BottomTabs} 
          options={{ 
            drawerItemStyle: { display: 'none' },
            headerShown: false
          }} 
        />
        <Drawer.Screen 
          name="EquityScreen" 
          component={EquityScreen}
          options={{
            drawerItemStyle: { display: 'none' }, // Hide from drawer
            title: 'Equity Investments' // Optional: Set a title
          }}
        />
        <Drawer.Screen 
  name="SIPRequest" 
  component={SIPRequestScreen}
  options={{
    drawerItemStyle: { display: 'none' },
    title: 'SIP Request'
  }}
/>

        <Drawer.Screen 
          name="GoldScreen" 
          component={GoldScreen}
          options={{
            drawerItemStyle: { display: 'none' }, // Hide from drawer
            title: 'Gold Investments' // Optional: Set a title
          }}
        />
        <Drawer.Screen 
          name="FOFScreen" 
          component={FOFScreen}
          options={{
            drawerItemStyle: { display: 'none' }, // Hide from drawer
            title: 'FOF Investments' // Optional: Set a title
          }}
        />
        <Drawer.Screen 
          name="DebtScreen" 
          component={DebtScreen}
          options={{
            drawerItemStyle: { display: 'none' }, // Hide from drawer
            title: 'Debt Investments' // Optional: Set a title
          }}
        />
        <Drawer.Screen 
          name="HybridScreen" 
          component={HybridScreen}
          options={{
            drawerItemStyle: { display: 'none' }, // Hide from drawer
            title: 'Hybrid Investments' // Optional: Set a title
          }}
        />
        <Drawer.Screen 
          name="ArbitrageScreen" 
          component={ArbitrageScreen}
          options={{
            drawerItemStyle: { display: 'none' }, // Hide from drawer
            title: 'Arbitrary Investments' // Optional: Set a title
          }}
        />
        <Drawer.Screen 
          name="TaxSavingScreen" 
          component={TaxSavingScreen}
          options={{
            drawerItemStyle: { display: 'none' }, // Hide from drawer
            title: 'Tax Saving Investments' // Optional: Set a title
          }}
        />
        <Drawer.Screen 
          name="ETFScreen" 
          component={ETFScreen}
          options={{
            drawerItemStyle: { display: 'none' }, // Hide from drawer
            title: 'ETF Investments' // Optional: Set a title
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );

  
}

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
    height: 90,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,     
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  hamburger: {
    padding: 10,
  },
  imageContainer: {
    width: width,
    height: 300, 
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -width * 0.35 }],
    alignItems: "center",
    width: "70%",
  },
  animatedTextWrapper: {
    alignItems: "center",
  },
  fixedText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  animatedText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  loginLogo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "center",
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  welcomeText: {
    fontSize: 22,
    color: '#000',
  },
  boldText: {
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  stepsContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  stepsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  step: {
    alignItems: "center",
    marginBottom: 20,
  },
  stepImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 50, 
  },
  stepText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  footer: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  infoBox: {
    marginTop: 20,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    width: "97%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginLeft: 0,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "gray",
  },
  profit: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  percentage: {
    fontSize: 14,
    color: "green",
  },
  invested: {
    fontSize: 16,
    fontWeight: "bold",
  },
  homeContainer: {
    flex: 2,
    padding: 18,
    backgroundColor: "#f5f5f5",
  },
  current: {
    fontSize: 16,
    fontWeight: "bold",
  },
  viewText: {
    color: "#007BFF",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 12,
  },
  portfolioLink: {
    marginTop: 15,
    alignSelf: 'center',
    padding: 10,
  },
  portfolioLinkText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  portfolioItem: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});