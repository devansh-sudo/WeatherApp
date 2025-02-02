import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions/weatherActions';

const initialState = {
  currentWeather: null,
  cities: [],
  loading: false,
  error: null,
  forecastDays: 3,
};

export const weatherReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(actions.fetchWeatherRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(actions.fetchWeatherSuccess, (state, action) => {
      state.loading = false;
      state.currentWeather = action.payload;
    })
    .addCase(actions.fetchWeatherFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(actions.searchCitiesSuccess, (state, action) => {
      state.cities = action.payload;
    })
    .addCase(actions.updateForecastDays, (state, action) => {
      state.forecastDays = action.payload;
    })
    .addCase(actions.setCachedWeather, (state, action) => {
      // Update Redux state with cached data
      state.loading = false;
      state.currentWeather = action.payload;
      state.error = null;
    })
});
