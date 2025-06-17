import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image
} from 'react-native';
import fetchFullPortfolioData from '../api/fetchFullPortfolio';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';


const formatCurrency = (value) => 
  `₹${Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

const InvestmentScreen = ({ navigation }) => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    pnl: 0,
    invested: 0,
    current: 0,
    percentage: '0.00'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchFullPortfolioData();
        const statusData = data?.statusData || [];

        if (statusData.length > 0) {
          setPortfolioData(statusData);

          let totalInvested = 0;
          let totalCurrent = 0;

          statusData.forEach((item) => {
            totalInvested += Number(item.purchase_amount || 0);
            totalCurrent += Number(item.current_value || 0);
          });

          const pnl = totalCurrent - totalInvested;
          const percentage = ((totalCurrent - totalInvested) / totalInvested * 100).toFixed(2);

          setSummary({
            pnl,
            invested: totalInvested,
            current: totalCurrent,
            percentage
          });
        } else {
          setError('No investments found');
        }
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError('Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const renderFundCard = (portfolio, index) => {
    const invested = Number(portfolio.purchase_amount || 0);
    const current = Number(portfolio.current_value || 0);
    const pnl = current - invested;
    const percentage = ((current - invested) / invested * 100).toFixed(2);
    const isProfit = pnl >= 0;

    return (
      <View key={index} style={styles.fundCard}>
        <View style={styles.fundHeader}>
          <View style={styles.fundIcon}>
            <MaterialIcons 
              name={isProfit ? 'trending-up' : 'trending-down'} 
              size={24} 
              color={isProfit ? '#4CAF50' : '#F44336'} 
            />
          </View>
          <View>
           <Text style={styles.fundName} numberOfLines={1} ellipsizeMode="tail">
  {portfolio.product_long_name || 'No Fund Name'}
</Text>
<Text style={styles.fundType} numberOfLines={1} ellipsizeMode="tail">
  {portfolio.LONG_NAME || 'No Fund Type'}
</Text>

          </View>
        </View>

        <View style={styles.performanceGrid}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Invested</Text>
            <Text style={styles.performanceValue}>{formatCurrency(invested)}</Text>
          </View>

          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Current</Text>
            <Text style={styles.performanceValue}>{formatCurrency(current)}</Text>
          </View>

          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>P&L</Text>
            <Text style={[styles.performanceValue, { color: isProfit ? '#4CAF50' : '#F44336' }]}>
              {formatCurrency(pnl)}
            </Text>
          </View>

          <View style={styles.performanceItem}>
            <Text style={styles.performanceLabel}>Return</Text>
            <Text style={[styles.performanceValue, { color: isProfit ? '#4CAF50' : '#F44336' }]}>
              {percentage}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#F44336" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            loadData();
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (portfolioData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="attach-money" size={48} color="#9E9E9E" />
        <Text style={styles.emptyText}>No investments found</Text>
        <TouchableOpacity 
          style={styles.addInvestmentButton}
          onPress={() => navigation.navigate('Discover')}
        >
          <Text style={styles.addInvestmentButtonText}>Start Investing</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOverallProfit = summary.pnl >= 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6C63FF', '#8A7DFF']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Your Portfolio</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Invested</Text>
            <Text style={styles.summaryValue}>{formatCurrency(summary.invested)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Current</Text>
            <Text style={styles.summaryValue}>{formatCurrency(summary.current)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Overall P&L</Text>
            <Text style={[styles.summaryValue, { color: isOverallProfit ? '#4CAF50' : '#F44336' }]}>
              {formatCurrency(summary.pnl)} ({summary.percentage}%)
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Your Investments</Text>
        
        {portfolioData.map((portfolio, index) => renderFundCard(portfolio, index))}

        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    padding: 24,
    paddingTop: 50,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  summaryItem: {
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginLeft: 8,
  },
  fundCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  fundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fundIcon: {
    backgroundColor: '#F0F2FF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
 fundName: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
  flexShrink: 1,
  flexWrap: 'wrap',
  maxWidth: 250, // prevent overflow
},
fundType: {
  fontSize: 14,
  color: '#666',
  flexShrink: 1,
  flexWrap: 'wrap',
  maxWidth: 250,
},


  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  performanceItem: {
  width: '48%',
  minWidth: 120, // optional
  marginBottom: 12,
},

  performanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F5F7FB',
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F5F7FB',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  addInvestmentButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addInvestmentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InvestmentScreen;