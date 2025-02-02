// src/components/common/SearchBar.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { searchCitiesRequest, fetchWeatherRequest } from '../../store/actions/weatherActions';
import { selectCities, selectLoading } from '../../store';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [animation] = useState(new Animated.Value(0));
  const dispatch = useDispatch();
  const cities = useSelector(selectCities);
  const isLoading = useSelector(selectLoading);

  // Debounce search to prevent too many API calls
  const debounceSearch = useCallback((query) => {
    // Only search if there's no selected city and query is long enough
    if (!selectedCity && query.length > 2) {
      dispatch(searchCitiesRequest(query));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [dispatch, selectedCity]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debounceSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, debounceSearch]);

  // Handle animations
  useEffect(() => {
    Animated.timing(animation, {
      toValue: showSuggestions ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showSuggestions, animation]);

  const handleCitySelect = (city) => {
    // Set the selected city and update search query
    setSelectedCity(city);
    setSearchQuery(city.name);
    
    // Hide suggestions
    setShowSuggestions(false);
    
    // Dispatch weather fetch
    dispatch(fetchWeatherRequest(city.name));
    
    // Dismiss keyboard
    Keyboard.dismiss();
  };

  const clearSearch = () => {
    // Reset everything
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedCity(null);
    Keyboard.dismiss();
  };

  const handleSearchChange = (text) => {
    // If no city is selected, allow searching
    if (!selectedCity) {
      setSearchQuery(text);
    }
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleCitySelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.suggestionContent}>
        <View>
          <Text style={styles.cityName}>{item.name}</Text>
          <Text style={styles.regionName}>{item.region}, {item.country}</Text>
        </View>
        <Text style={styles.coordinates}>
          {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a city"
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholderTextColor="#666"
          returnKeyType="search"
          onFocus={() => {
            // Show suggestions only if no city is selected and query is long enough
            if (!selectedCity && searchQuery.length > 2) {
              setShowSuggestions(true);
            }
          }}
        />
        {isLoading ? (
          <ActivityIndicator style={styles.icon} color="#0066cc" />
        ) : (selectedCity || searchQuery.length > 0) ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Suggestions Container */}
      {!selectedCity && (
        <Animated.View
          style={[
            styles.suggestionsContainer,
            {
              opacity: animation,
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {showSuggestions && (
            <FlatList
              data={cities}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item.id.toString()}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>
                  {searchQuery.length > 2
                    ? 'No cities found'
                    : 'Type to search for a city'}
                </Text>
              )}
            />
          )}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingRight: 40,
    borderRadius: 25,
    fontSize: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    height: 50,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    zIndex: 10,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  regionName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  coordinates: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: '500',
  },
  emptyText: {
    padding: 16,
    textAlign: 'center',
    color: '#666',
  },
  icon: {
    position: 'absolute',
    right: 15,
  },
});

export default SearchBar;