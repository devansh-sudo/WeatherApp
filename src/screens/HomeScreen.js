import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { fetchWeatherRequest } from '../store/actions/weatherActions';
import { selectCurrentWeather, selectLoading, selectError, selectForecastDays } from '../store';
import SearchBar from '../components/common/SearchBar';
import CurrentWeather from '../components/weather/CurrentWeather';
import ForecastList from '../components/weather/ForecastList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const getWeatherTheme = (condition) => {
  const themes = {
    clear: { gradient: ['#4DA0B0', '#D7DDE8'], textColor: '#fff', statusBarStyle: 'light-content', statusBarColor: '#4DA0B0' },
    sunny: { gradient: ['#D39D38', '#ffcc80'], textColor: '#fff', statusBarStyle: 'light-content', statusBarColor: '#D39D38' },
    rain: { gradient: ['#373B44', '#4286f4'], textColor: '#fff', statusBarStyle: 'light-content', statusBarColor: '#373B44' },
    cloudy: { gradient: ['#757F9A', '#D7DDE8'], textColor: '#333', statusBarStyle: 'dark-content', statusBarColor: '#757F9A' },
    default: { gradient: ['#2C3E50', '#3498DB'], textColor: '#fff', statusBarStyle: 'light-content', statusBarColor: '#2C3E50' },
  };

  const conditionLower = condition?.toLowerCase() || '';
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return themes.sunny;
  if (conditionLower.includes('rain')) return themes.rain;
  if (conditionLower.includes('cloud')) return themes.cloudy;
  return themes.default;
};

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentWeather = useSelector(selectCurrentWeather);
  const currentForecastDays = useSelector(selectForecastDays);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [offlineData, setOfflineData] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkConnectionAndFetch = async () => {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        setIsOffline(true);
        Alert.alert('No Internet', 'You are offline. Showing last fetched data.');
        
        // Retrieve cached weather data
        const cachedWeather = await AsyncStorage.getItem('weather_Gurgaon');
        if (cachedWeather) {
          setOfflineData(JSON.parse(cachedWeather));
        }
      } else {
        setIsOffline(false);
        dispatch(fetchWeatherRequest('Gurgaon'));
      }
    };

    checkConnectionAndFetch();
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const onRefresh = async () => {
    setRefreshing(true);
    const netInfo = await NetInfo.fetch();

    if (netInfo.isConnected) {
      setIsOffline(false);
      if (currentWeather?.location?.name) {
        dispatch(fetchWeatherRequest(currentWeather.location.name));
      }
    } else {
      setIsOffline(true);
      Alert.alert('No Internet', 'You are offline. Using cached data.');

      const cachedWeather = await AsyncStorage.getItem(`weather_${currentWeather?.location?.name}`);
      if (cachedWeather) {
        setOfflineData(JSON.parse(cachedWeather));
      }
    }
    setRefreshing(false);
  };

  const handleForecastPress = (forecast) => {
    navigation.navigate('ForecastDetail', {
      forecast,
      cityName: currentWeather?.location?.name
    });
  };

  if (loading && !currentWeather && !offlineData) {
    return <LoadingSpinner />;
  }

  const weatherData = currentWeather || offlineData;
  const theme = getWeatherTheme(weatherData?.current?.condition?.text);

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.2, 1, 0.8],
    extrapolate: 'clamp',
  });

  return (
    < >
      <StatusBar 
        barStyle={theme.statusBarStyle}
        backgroundColor={ theme.statusBarColor}
        translucent={true}
      />
      
      <LinearGradient colors={theme.gradient} style={styles.container}>
        <Animated.ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={theme.textColor}
            />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.searchContainer}>
            <SearchBar customStyle={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 20,
            }} />
          </View>
          
          {weatherData && (
            <>
              <Animated.View style={[
                styles.weatherContainer,
                { transform: [{ scale: headerScale }] }
              ]}>
                <CurrentWeather
                  current={weatherData.current}
                  location={weatherData.location}
                  theme={theme}
                />
              </Animated.View>
              
              {weatherData.forecast && (
                <View style={styles.forecastContainer}>
                  <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                    {currentForecastDays}-Day Forecast
                  </Text>
                  <ForecastList
                    forecast={weatherData.forecast.forecastday}
                    onForecastPress={handleForecastPress}
                    theme={theme}
                  />
                </View>
              )}
              
              <View style={styles.lastUpdated}>
                <Text style={[styles.lastUpdatedText, { color: theme.secondaryTextColor }]}>
                  Last updated: {new Date(weatherData.current.last_updated).toLocaleTimeString()}
                </Text>
              </View>
            </>
          )}
        </Animated.ScrollView>
      </LinearGradient>

      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  searchContainer: { padding: 2, marginTop: Platform.OS === 'android' ? 40 : 50 },
  weatherContainer: { padding: 2, alignItems: 'center' },
  forecastContainer: { marginTop: 20, padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  lastUpdated: { padding: 16, alignItems: 'center', marginBottom: 20 },
  lastUpdatedText: { fontSize: 12 },
  offlineBanner: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
  },
  offlineText: { color: 'white', fontWeight: 'bold' },
});

export default HomeScreen;