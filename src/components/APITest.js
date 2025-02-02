// src/components/ApiTest.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import WeatherAPI from '../api/weatherApi';

const ApiTest = () => {
  const [testStatus, setTestStatus] = useState({
    current: 'Pending',
    forecast: 'Pending',
    search: 'Pending'
  });

  useEffect(() => {
    const runTests = async () => {
      // Test Current Weather
      try {
        const weatherData = await WeatherAPI.getCurrentWeather('London');
        console.log('Current weather test:', weatherData);
        setTestStatus(prev => ({
          ...prev,
          current: 'Success'
        }));
      } catch (error) {
        console.error('Current weather test failed:', error);
        setTestStatus(prev => ({
          ...prev,
          current: `Failed: ${error.message}`
        }));
      }

      // Test Forecast
      try {
        const forecastData = await WeatherAPI.getForecast('London', 3);
        console.log('Forecast test:', forecastData);
        setTestStatus(prev => ({
          ...prev,
          forecast: 'Success'
        }));
      } catch (error) {
        console.error('Forecast test failed:', error);
        setTestStatus(prev => ({
          ...prev,
          forecast: `Failed: ${error.message}`
        }));
      }

      // Test Search
      try {
        const searchData = await WeatherAPI.searchCities('Lond');
        console.log('Search test:', searchData);
        setTestStatus(prev => ({
          ...prev,
          search: 'Success'
        }));
      } catch (error) {
        console.error('Search test failed:', error);
        setTestStatus(prev => ({
          ...prev,
          search: `Failed: ${error.message}`
        }));
      }
    };

    runTests();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weather API Tests</Text>
      
      <View style={styles.testItem}>
        <Text style={styles.testLabel}>Current Weather:</Text>
        <Text style={[
          styles.testStatus,
          { color: testStatus.current === 'Success' ? '#4CAF50' : '#f44336' }
        ]}>
          {testStatus.current}
        </Text>
      </View>

      <View style={styles.testItem}>
        <Text style={styles.testLabel}>Forecast:</Text>
        <Text style={[
          styles.testStatus,
          { color: testStatus.forecast === 'Success' ? '#4CAF50' : '#f44336' }
        ]}>
          {testStatus.forecast}
        </Text>
      </View>

      <View style={styles.testItem}>
        <Text style={styles.testLabel}>Search:</Text>
        <Text style={[
          styles.testStatus,
          { color: testStatus.search === 'Success' ? '#4CAF50' : '#f44336' }
        ]}>
          {testStatus.search}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  testItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  testLabel: {
    fontSize: 16,
    color: '#333',
  },
  testStatus: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ApiTest;