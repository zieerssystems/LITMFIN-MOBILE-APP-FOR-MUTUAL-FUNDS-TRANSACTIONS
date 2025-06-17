import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import  fetchUserProfile  from '../api/profile';

const maskAccountNumber = (accountNo) => {
  if (!accountNo) return '-';
  const last4 = accountNo.slice(-4);
  return '•••• •••• •••• ' + last4;
};

const maskPanNumber = (pan) => {
  if (!pan || pan.length < 4) return '-';
  const visible = pan.slice(0, 4);
  return visible + '•••••';
};



const AccountScreen = () => {
  const [showProfileDetails, setShowProfileDetails] = useState(true);
  const [showInviteOptions, setShowInviteOptions] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const result = await fetchUserProfile();
      if (!result.error) {
        setProfile(result);
      } else {
        console.error(result.error);
      }
      setLoading(false);
    };

    loadProfile();
    
  }, []);

  const handleInviteFriends = async () => {
    try {
      await Share.share({
        message: `Join me on this awesome app! Download it here: https://yourapp.com/download`,
        title: 'Invite Friends',
      });
    } catch (error) {
      alert('Error sharing: ' + error.message);
    }
  };

  const openSocialMedia = (app) => {
    const shareMessage = `Join me on this app! Download: https://yourapp.com/download`;

    const urls = {
      whatsapp: `whatsapp://send?text=${encodeURIComponent(shareMessage)}`,
      facebook: `fb://sharer/sharer.php?u=${encodeURIComponent('https://yourapp.com/download')}`,
      telegram: `tg://msg_url?url=${encodeURIComponent('https://yourapp.com/download')}&text=${encodeURIComponent(shareMessage)}`,
      sms: `sms:?body=${encodeURIComponent(shareMessage)}`,
      email: `mailto:?subject=Join%20this%20app&body=${encodeURIComponent(shareMessage)}`,
    };

    Linking.openURL(urls[app]).catch(() => {
      Linking.openURL('https://yourapp.com/download');
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.profilePlaceholder}>
            <Ionicons name="person" size={30} color="white" />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.userName}>{profile?.UserFullName || 'Name'}</Text>
            
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowProfileDetails(!showProfileDetails)}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="person-outline" size={20} color="#007bff" />
            </View>
            <Text style={styles.menuText}>Profile</Text>
            <Ionicons
              name={showProfileDetails ? 'chevron-down' : 'chevron-forward'}
              size={18}
              color="#999"
            />
          </TouchableOpacity>

          {showProfileDetails && (
            <View style={styles.profileDetailsContainer}>
              
              

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>DOB</Text>
                <Text style={styles.detailValue}>{profile?.dob || '-'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bank Account</Text>
                <Text style={styles.detailValue}>{maskAccountNumber(profile?.UserBankAccountNo)}</Text>

              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>PAN</Text>
                <Text style={styles.detailValue}>{maskPanNumber(profile?.UserPanNo)}</Text>

              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>State</Text>
                <Text style={styles.detailValue}>{profile?.UserState || '-'}</Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowInviteOptions(!showInviteOptions)}
          >
            <View style={styles.menuIcon}>
              <Ionicons name="person-add-outline" size={20} color="#007bff" />
            </View>
            <Text style={styles.menuText}>Invite Friends</Text>
            <Ionicons
              name={showInviteOptions ? 'chevron-down' : 'chevron-forward'}
              size={18}
              color="#999"
            />
          </TouchableOpacity>

          {showInviteOptions && (
            <View style={styles.inviteOptionsContainer}>
              <TouchableOpacity
                style={styles.inviteButton}
                onPress={handleInviteFriends}
              >
                <Text style={styles.inviteButtonText}>Share App Link</Text>
                <Ionicons
                  name="share-social"
                  size={18}
                  color="white"
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Share via Social Media</Text>

              <View style={styles.socialIconsContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openSocialMedia('whatsapp')}
                >
                  <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                  <Text style={styles.socialButtonText}>WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openSocialMedia('facebook')}
                >
                  <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openSocialMedia('telegram')}
                >
                  <Ionicons name="paper-plane" size={24} color="#0088cc" />
                  <Text style={styles.socialButtonText}>Telegram</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.socialIconsContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openSocialMedia('sms')}
                >
                  <Ionicons name="chatbubble" size={24} color="#34B7F1" />
                  <Text style={styles.socialButtonText}>SMS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => openSocialMedia('email')}
                >
                  <Ionicons name="mail" size={24} color="#D44638" />
                  <Text style={styles.socialButtonText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    marginTop: 5,
  },
  profilePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileText: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  userId: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  menuIcon: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 55,
  },
  profileDetailsContainer: {
    padding: 15,
    paddingLeft: 55,
    backgroundColor: '#f9f9f9',
  },
  detailRow: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  inviteOptionsContainer: {
    padding: 15,
    paddingLeft: 55,
    backgroundColor: '#f9f9f9',
  },
  inviteButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  inviteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  sectionTitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
    fontSize: 16,
    fontWeight: '600',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  socialButton: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
  },
  socialButtonText: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
  },
});

export default AccountScreen;
