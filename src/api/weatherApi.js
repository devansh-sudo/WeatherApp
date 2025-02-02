import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const API_KEY = '5d99c1a1f2a3497bba3183924250102';
const BASE_URL = 'https://api.weatherapi.com/v1';

// Helper function to create API URL
const createUrl = (endpoint, params) => {
  const queryParams = new URLSearchParams({
    key: API_KEY,
    ...params
  }).toString();
  return `${BASE_URL}${endpoint}?${queryParams}`;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }
  return response.json();
};

export const WeatherAPI = {
 

  searchCities: async (query) => {
    try {
      if (!query || query.length < 2) return [];

      // Check network connection first
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        const cachedCities = await AsyncStorage.getItem(`cities_${query}`);
        if (cachedCities) {
          console.log('Returning cached city search results');
          return JSON.parse(cachedCities);
        }
        throw new Error('No internet connection');
      }

      const url = createUrl('/search.json', { q: query });
      console.log('Searching cities URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Search response:', data);

      // Cache the results
      await AsyncStorage.setItem(`cities_${query}`, JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error('Search cities error:', error.message);
      throw error;
    }
  },


  getCurrentWeather: async (city) => {
    try {
      if (!city) throw new Error('City is required');

      // Check network status
      const isConnected = (await NetInfo.fetch()).isConnected;
      if (!isConnected) {
        const cachedWeather = await AsyncStorage.getItem(`weather_${city}`);
        if (cachedWeather) {
          console.log('Returning cached weather data due to offline mode');
          return JSON.parse(cachedWeather);
        }
        throw new Error('No internet connection and no cached data available');
      }

      const url = createUrl('/current.json', { q: city });
      console.log('Getting current weather URL:', url);

      const response = await fetch(url);
      const data = await handleResponse(response);

      // Cache weather data
      await AsyncStorage.setItem(`weather_${city}`, JSON.stringify(data));

      console.log('Current weather response:', data);
      return data;
    } catch (error) {
      console.error('Get current weather error:', error.message);
      throw error;
    }
  },

  getForecast: async (city, days = 3) => {
    try {
      if (!city) throw new Error('City is required');
      if (days < 1 || days > 14) throw new Error('Days should be between 1 and 14');

      // Check network status
      const isConnected = (await NetInfo.fetch()).isConnected;
      if (!isConnected) {
        const cachedForecast = await AsyncStorage.getItem(`forecast_${city}_${days}`);
        if (cachedForecast) {
          console.log('Returning cached forecast data due to offline mode');
          return JSON.parse(cachedForecast);
        }
        throw new Error('No internet connection and no cached forecast data available');
      }

      const url = createUrl('/forecast.json', {
        q: city,
        days: days,
        aqi: 'no'
      });
      console.log('Getting forecast URL:', url);

      const response = await fetch(url);
      const data = await handleResponse(response);

      // Cache forecast data
      await AsyncStorage.setItem(`forecast_${city}_${days}`, JSON.stringify(data));

      console.log('Forecast response:', data);
      return data;
    } catch (error) {
      console.error('Get forecast error:', error.message);
      throw error;
    }
  }
};

export default WeatherAPI;