import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const CurrentWeather = ({ current, location, theme }) => {
  const getWeatherIcon = (icon) => {
    return { uri: `https:${icon}` };
  };

  const renderDetailCard = (label, value, unit, icon) => (
    <LinearGradient
      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.detailCard}
    >
      <Text style={[styles.detailLabel, { color: theme.secondaryTextColor }]}>
        {label}
      </Text>
      <View style={styles.detailValueContainer}>
        {icon && <Text style={styles.detailIcon}>{icon}</Text>}
        <Text style={[styles.detailValue, { color: theme.textColor }]}>
          {value}
          <Text style={styles.detailUnit}>{unit}</Text>
        </Text>
      </View>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      {/* Location Info */}
      <View style={styles.locationContainer}>
        <Text style={[styles.location, { color: theme.textColor }]}>
          {location.name}
        </Text>
        <Text style={[styles.region, { color: theme.secondaryTextColor }]}>
          {location.region}, {location.country}
        </Text>
      </View>

      {/* Current Weather */}
      <View style={styles.weatherInfo}>
        <Image
          source={getWeatherIcon(current.condition.icon)}
          style={styles.weatherIcon}
        />
        <View style={styles.temperatureContainer}>
          <Text style={[styles.temperature, { color: theme.textColor }]}>
            {Math.round(current.temp_c)}°
          </Text>
          <Text style={[styles.condition, { color: theme.secondaryTextColor }]}>
            {current.condition.text}
          </Text>
        </View>
      </View>

      {/* Weather Details */}
      <View style={styles.detailsContainer}>
        {renderDetailCard('Feels Like', Math.round(current.feelslike_c), '°', '🌡️')}
        {renderDetailCard('Humidity', current.humidity, '%', '💧')}
        {renderDetailCard('Wind', Math.round(current.wind_kph), 'km/h', '🌪️')}
      </View>
      
      {/* Additional Weather Info */}
      <View style={styles.additionalInfo}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoText, { color: theme.secondaryTextColor }]}>
            UV Index: {current.uv}
          </Text>
          <Text style={[styles.infoText, { color: theme.secondaryTextColor }]}>
            Pressure: {current.pressure_mb} mb
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoText, { color: theme.secondaryTextColor }]}>
            Visibility: {current.vis_km} km
          </Text>
          <Text style={[styles.infoText, { color: theme.secondaryTextColor }]}>
            Precipitation: {current.precip_mm} mm
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  locationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 32,
    fontWeight: '600',
  },
  region: {
    fontSize: 16,
    marginTop: 4,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  weatherIcon: {
    width: 60,
    height: 60,
  },
  temperatureContainer: {
    marginLeft: 20,
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 72,
    fontWeight: '200',
  },
  condition: {
    fontSize: 24,
    marginTop: -5,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  detailCard: {
    padding: 8,
    borderRadius: 15,
    height: Platform.OS==='android' ?80 :100,
    width: Platform.OS==='android' ?'30%' :'33%',
    // width: width * 0.28,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  detailUnit: {
    fontSize: 14,
    opacity: 0.8,
  },
  additionalInfo: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default CurrentWeather