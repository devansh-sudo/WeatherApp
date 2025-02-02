
import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

const WeatherCard = ({ forecast, onPress }) => {
  const date = new Date(forecast.date);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.day}>{dayName}</Text>
      <Image
        source={{ uri: `https:${forecast.day.condition.icon}` }}
        style={styles.icon}
      />
      <Text style={styles.temp}>
        {Math.round(forecast.day.maxtemp_c)}°/{Math.round(forecast.day.mintemp_c)}°
      </Text>
      <Text style={styles.condition}>{forecast.day.condition.text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 3,
  },
  day: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  icon: {
    width: 48,
    height: 48,
    marginVertical: 8,
  },
  temp: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  condition: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default WeatherCard;