import React from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Vector Icons

const { width } = Dimensions.get('window');

const ForecastDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { forecast, cityName } = route.params;
  const insets = useSafeAreaInsets();
  const date = new Date(forecast.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getWeatherTheme = () => {
    const condition = forecast.day.condition.text.toLowerCase();
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;

    return {
      gradient: getWeatherGradient(condition),
      statusBarStyle: isNight ? 'light-content' : 'dark-content',
      statusBarColor: getWeatherGradient(condition)[0], // Top gradient color
      textColor: isNight ? '#fff' : '#000',
    };
  };

  const getWeatherGradient = (condition) => {
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return ['#4286f4', '#373B44']; // Rainy theme
    }

    if (condition.includes('cloud')) {
      return ['#757F9A', '#D7DDE8']; // Cloudy theme
    }
    if (condition.includes('clear') || condition.includes('sunny')) {
      return ['#D39D38', '#DBD5A4']; // Sunny theme
    }

    if (condition.includes('snow')) {
      return ['#649173', '#DBD5A4']; // Snowy theme
    }

    if (condition.includes('thunder') || condition.includes('storm')) {
      return ['#373B44', '#4286f4']; // Stormy theme
    }

    if (condition.includes('mist') || condition.includes('fog')) {
      return ['#606c88', '#3f4c6b']; // Misty theme
    }

    // Default sunny day theme
    return ['#4DA0B0', '#D39D38'];
  };

  const weatherTheme = getWeatherTheme();

  const renderHourlyForecast = () => {
    return forecast.hour.map((hour, index) => {
      const hourTime = new Date(hour.time).getHours();
      const isCurrentHour = new Date().getHours() === hourTime;

      return (
        <LinearGradient
          key={index}
          colors={isCurrentHour ? ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)'] : ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
          style={[styles.hourlyItem]}
        >
          <Text style={styles.hourText}>
            {hourTime === 0 ? '12 AM' : hourTime === 12 ? '12 PM' : hourTime > 12 ? `${hourTime - 12} PM` : `${hourTime} AM`}
          </Text>
          <Image
            source={{ uri: `https:${hour.condition.icon}` }}
            style={styles.hourlyIcon}
          />
          <Text style={styles.hourlyTemp}>{Math.round(hour.temp_c)}°</Text>
          <Text style={styles.hourlyCondition} numberOfLines={1}>
            {hour.condition.text}
          </Text>
        </LinearGradient>
      );
    });
  };

  const renderDetailItem = (label, value, icon) => (
    <LinearGradient
      colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
      style={styles.detailItem}
    >
      <View style={styles.detailHeader}>
        <Text style={styles.detailIcon}>{icon}</Text>
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </LinearGradient>
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <StatusBar 
        barStyle={weatherTheme.statusBarStyle} 
        backgroundColor={weatherTheme.statusBarColor}
        translucent={false}
      />
      <LinearGradient colors={weatherTheme.gradient} style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity 
          style={[styles.backButton, { marginTop: insets.top }]} 
          onPress={handleGoBack}
        >
          <Icon 
            name="arrow-back" 
            size={24} 
            color={weatherTheme.textColor} 
          />
        </TouchableOpacity>

        <ScrollView 
          style={[styles.scrollView, { paddingTop: insets.top }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.header}>
            <Text style={styles.city}>{cityName}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>

          <View style={styles.mainInfo}>
            <Image
              source={{ uri: `https:${forecast.day.condition.icon}` }}
              style={styles.mainIcon}
            />
            <View style={styles.tempContainer}>
              <Text style={styles.highTemp}>{Math.round(forecast.day.maxtemp_c)}°</Text>
              <Text style={styles.lowTemp}>{Math.round(forecast.day.mintemp_c)}°</Text>
              <Text style={styles.condition}>{forecast.day.condition.text}</Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            {renderDetailItem('Rain Chance', `${forecast.day.daily_chance_of_rain}%`, '🌧️')}
            {renderDetailItem('UV Index', forecast.day.uv, '☀️')}
            {renderDetailItem('Sunrise', forecast.astro.sunrise, '🌅')}
            {renderDetailItem('Sunset', forecast.astro.sunset, '🌇')}
            {renderDetailItem('Wind', `${Math.round(forecast.day.maxwind_kph)} km/h`, '💨')}
            {renderDetailItem('Humidity', `${forecast.day.avghumidity}%`, '💧')}
          </View>

          <View style={styles.hourlyContainer}>
            <Text style={styles.sectionTitle}>Hourly Forecast</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hourlyContent}
              decelerationRate="fast"
              snapToInterval={width * 0.25}
            >
              {renderHourlyForecast()}
            </ScrollView>
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40, 
  },
  city: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  date: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mainIcon: {
    width: 90,
    height: 90,
  },
  tempContainer: {
    marginLeft: 20,
    alignItems: 'flex-start',
  },
  highTemp: {
    fontSize: 48,
    fontWeight: '200',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  lowTemp: {
    fontSize: 32,
    color: 'rgba(255,255,255,0.9)',
    marginTop: -5,
  },
  condition: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
        padding: Platform.OS === 'android' ? 12 : 20,
    
    justifyContent: 'space-between',
  },
  detailItem: {
    width: width * 0.44,
   padding: Platform.OS === 'android' ? 12 : 6,
   height:80,
    borderRadius: 20,
    marginBottom: 12,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: Platform.OS === 'android' ? 0 : 4,
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  hourlyContainer: {
    marginTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 20,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  hourlyContent: {
    paddingHorizontal: 12,
  },
  hourlyItem: {
    alignItems: 'center',
    width: width * 0.25,
    marginHorizontal: 4,
    padding: Platform.OS === 'android' ? 12 : 2,
    height:150,
    borderRadius: 20,
  },
  hourText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    marginTop:Platform.OS === 'android' ? 0 : 6,
  },
  hourlyIcon: {
    width: 40,
    height: 40,
    marginVertical: 8,
  },
  hourlyTemp: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginVertical: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  hourlyCondition: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
});

export default ForecastDetailScreen;