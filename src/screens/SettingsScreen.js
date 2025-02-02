import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateForecastDays, fetchWeatherRequest } from '../store/actions/weatherActions';
import { selectForecastDays, selectCurrentWeather } from '../store';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const FORECAST_OPTIONS = [1, 2, 3 ];

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const currentDays = useSelector(selectForecastDays);
  const currentWeather = useSelector(selectCurrentWeather);

  const handleDaysChange = useCallback((days) => {
    if (currentDays !== days) {
      dispatch(updateForecastDays(days));
      // Refetch weather data for the current location with new forecast days
      if (currentWeather?.location?.name) {
        dispatch(fetchWeatherRequest(currentWeather.location.name));
      }
    }
  }, [dispatch, currentDays, currentWeather]);

  const renderDayOption = (days) => {
    const isSelected = currentDays === days;
    return (
      <TouchableOpacity
        key={days}
        onPress={() => handleDaysChange(days)}
        activeOpacity={0.7}
        style={styles.optionWrapper}
      >
        <LinearGradient
          colors={isSelected ? ['#4a90e2', '#357abd'] : ['#ffffff', '#ccceee']}
          style={[styles.optionButton, isSelected && styles.selectedOption]}
        >
          <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
            {days}
          </Text>
          <Text style={[styles.optionSubtext, isSelected && styles.selectedOptionText]}>
            Days
          </Text>
          {isSelected && (
            <View style={styles.checkmark}>
              <Icon name="checkmark-circle" size={20} color="#fff" />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="calendar-outline" size={24} color="#4a90e2" />
          <Text style={styles.sectionTitle}>Forecast Days</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Choose how many days of forecast you want to see
        </Text>
        
        <View style={styles.optionsContainer}>
          {FORECAST_OPTIONS.map(renderDayOption)}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="information-circle-outline" size={24} color="#4a90e2" />
          <Text style={styles.sectionTitle}>About</Text>
        </View>
        <View style={styles.aboutContent}>
          <View style={styles.versionContainer}>
            <Text style={styles.versionLabel}>Version</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>1.0.0</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.aboutText}>
            Data provided by WeatherAPI.com
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 8,
    //   },
    //   android: {
    //     elevation: 3,
    //   },
    // }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#1a1a1a',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  optionWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  optionButton: {
    padding: Platform.OS === 'android' ? 12 : 2,

    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  selectedOption: {
    borderWidth: 0,
  },
  optionText: {
    fontSize: 32,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  optionSubtext: {
    fontSize: 14,
    color: '#666',
  },
  selectedOptionText: {
    color: '#fff',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  aboutContent: {
    paddingTop: 8,
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  versionLabel: {
    fontSize: 14,
    color: '#666',
  },
  versionBadge: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  versionText: {
    color: '#fff',
    fontSize: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default SettingsScreen;