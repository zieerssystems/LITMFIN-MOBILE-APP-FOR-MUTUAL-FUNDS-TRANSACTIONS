import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DiscoverScreen = ({ navigation }) => {
  const categoryScreens = {
    Equity: 'EquityScreen',
    Gold: 'GoldScreen',
    FOF: 'FOFScreen',
    Debt: 'DebtScreen',
    Hybrid: 'HybridScreen',
    Arbitrage: 'ArbitrageScreen',
    'Tax Saving': 'TaxSavingScreen',
    ETF: 'ETFScreen',
  };

  const investmentCategories = [
    { id: 1, name: "Equity", icon: "trending-up", color: "#00C853" },
    { id: 2, name: "Gold", icon: "medal", color: "#FFD600" },
    { id: 3, name: "FOF", icon: "layers", color: "#2196F3" },
    { id: 4, name: "Debt", icon: "wallet", color: "#9C27B0" },
    { id: 5, name: "Hybrid", icon: "git-merge", color: "#FF6D00" },
    { id: 6, name: "Arbitrage", icon: "swap-horizontal", color: "#546E7A" },
    { id: 7, name: "Tax Saving", icon: "receipt", color: "#D81B60" },
    { id: 8, name: "ETF", icon: "bar-chart", color: "#3F51B5" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>💼 Explore Investment Options</Text>

      <View style={styles.grid}>
        {investmentCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.card}
            onPress={() => {
              const screenName = categoryScreens[category.name];
              if (screenName) navigation.navigate(screenName);
            }}
          >
            <View style={[styles.iconCircle, { backgroundColor: category.color }]}>
              <Ionicons name={category.icon} size={26} color="#fff" />
            </View>
            <Text style={styles.cardText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1A237E',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: width * 0.44,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default DiscoverScreen;
