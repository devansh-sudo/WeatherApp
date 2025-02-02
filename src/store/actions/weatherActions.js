import { createAction } from '@reduxjs/toolkit';

export const fetchWeatherRequest = createAction('FETCH_WEATHER_REQUEST');
export const fetchWeatherSuccess = createAction('FETCH_WEATHER_SUCCESS');
export const fetchWeatherFailure = createAction('FETCH_WEATHER_FAILURE');

export const searchCitiesRequest = createAction('SEARCH_CITIES_REQUEST');
export const searchCitiesSuccess = createAction('SEARCH_CITIES_SUCCESS');
export const searchCitiesFailure = createAction('SEARCH_CITIES_FAILURE');

export const updateForecastDays = createAction('UPDATE_FORECAST_DAYS');
export const setCachedWeather = createAction('SET_CACHED_WEATHER');
export const fetchCachedWeather = createAction('FETCH_CACHED_WEATHER');

