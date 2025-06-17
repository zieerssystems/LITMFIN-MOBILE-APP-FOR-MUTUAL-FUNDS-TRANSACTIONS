import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AboutUsScreen = ({ navigation }) => {
  const handleLinkPress = (url) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={['#007bff', '#00a1ff']}
        style={styles.headerGradient}
      >
        <Image 
          source={require("../assets/logo.png")} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.title}>About LitmFin</Text>
      </LinearGradient>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="history" size={24} color="#007bff" />
          <Text style={styles.sectionTitle}>Our Story</Text>
        </View>
        <Text style={styles.sectionText}>
          Litmfin.com has been built by professionals who have been active for more 
          than a decade in the Indian Investments and Banking sector. Our endeavor is 
          to offer no-frills investment and banking solutions to our customers that 
          will help them plan better for their future needs.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="lightbulb-outline" size={24} color="#007bff" />
          <Text style={styles.sectionTitle}>Our Approach</Text>
        </View>
        <Text style={styles.sectionText}>
          Our proprietary tools help us build better and smarter investment portfolios 
          for our customers, with constant support from our Relationship Managers 
          (both Virtual and Human) to help navigate the financial journey in the best 
          interest of our customers and their families.
        </Text>
      </View>

      <View style={[styles.card, styles.disclaimerCard]}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="warning" size={24} color="#ff6b6b" />
          <Text style={[styles.sectionTitle, { color: '#ff6b6b' }]}>Disclaimer</Text>
        </View>
        <Text style={styles.disclaimerText}>
          Mutual fund investments are subject to market risks. Please read the scheme 
          information and other related documents carefully before investing. Past 
          performance is not indicative of future returns.
        </Text>
      </View>

      
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 All rights reserved LITMFIN</Text>
        <Text style={styles.footerSubText}>Developed by Adpro Technologies</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  headerGradient: {
    padding: 25,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 180,
    height: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  disclaimerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
    backgroundColor: '#fff9f9',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#666',
  },
  linksCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginTop: 10,
  },
  linksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  linkButton: {
    backgroundColor: '#007bff',
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  footerSubText: {
    fontSize: 13,
    color: '#888',
  },
});

export default AboutUsScreen;