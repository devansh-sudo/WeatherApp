import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { weatherReducer } from './reducers/weatherReducer';
import { weatherSaga } from './sagas/weatherSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(weatherSaga);

// Export selectors for accessing state
export const selectWeatherState = (state) => state.weather;
export const selectCurrentWeather = (state) => state.weather.currentWeather;
export const selectCities = (state) => state.weather.cities;
export const selectLoading = (state) => state.weather.loading;
export const selectError = (state) => state.weather.error;
export const selectForecastDays = (state) => state.weather.forecastDays;