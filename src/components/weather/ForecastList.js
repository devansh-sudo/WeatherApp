import React, { useEffect, useRef } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { selectForecastDays } from '../../store';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.35;

const ForecastCard = ({ day, theme, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [index]);

  const date = new Date(day.date);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const dayMonth = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  const getWeatherIcon = (icon) => {
    return { uri: `https:${icon}` };
  };

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <LinearGradient
          colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Text style={[styles.dayName, { color: theme.textColor }]}>{dayName}</Text>
          <Text style={[styles.date, { color: theme.secondaryTextColor }]}>{dayMonth}</Text>
          
          <Image
            source={getWeatherIcon(day.day.condition.icon)}
            style={styles.weatherIcon}
          />
          
          <View style={styles.temperatureContainer}>
            <Text style={[styles.maxTemp, { color: theme.textColor }]}>
              {Math.round(day.day.maxtemp_c)}°
            </Text>
            <Text style={[styles.minTemp, { color: theme.secondaryTextColor }]}>
              {Math.round(day.day.mintemp_c)}°
            </Text>
          </View>

          <Text style={[styles.condition, { color: theme.secondaryTextColor }]} numberOfLines={2}>
            {day.day.condition.text}
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailIcon, { color: theme.textColor }]}>💧</Text>
              <Text style={[styles.detailText, { color: theme.secondaryTextColor }]}>
                {day.day.daily_chance_of_rain}%
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={[styles.detailIcon, { color: theme.textColor }]}>💨</Text>
              <Text style={[styles.detailText, { color: theme.secondaryTextColor }]}>
                {Math.round(day.day.maxwind_kph)} km/h
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ForecastList = ({ forecast, onForecastPress, theme }) => {
  const scrollViewRef = useRef(null);
  const currentForecastDays = useSelector(selectForecastDays);

  // Slice the forecast based on selected days
  const displayedForecast = forecast.slice(0, currentForecastDays);

  // Reset scroll position when forecast days change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
    }
  }, [currentForecastDays]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 12}
        snapToAlignment="center"
      >
        {displayedForecast.map((day, index) => (
          <ForecastCard
            key={day.date}
            day={day}
            theme={theme}
            onPress={() => onForecastPress(day)}
            index={index}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  card: {
    width: CARD_WIDTH, 
    padding: Platform.OS === 'android' ? 12 : 2,
    borderRadius: 20,
    marginHorizontal: 6,
    alignItems: 'center',
    // justifyContent: 'space-between',
    height: 280,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: Platform.OS === 'android' ? 0 : 10,
  },
  date: {
    fontSize: 14,
    marginTop: 2,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginVertical: 8,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  maxTemp: {
    fontSize: 24,
    fontWeight: '600',
  },
  minTemp: {
    fontSize: 18,
    marginLeft: 8,
  },
  condition: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
    height: 40,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
  },
});

export default ForecastList;