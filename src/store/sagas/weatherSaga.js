import { call, put, takeLatest } from 'redux-saga/effects';
import WeatherAPI from '../../api/weatherApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as actions from '../actions/weatherActions';

function* fetchWeatherSaga(action) {
  try {
    const isConnected = (yield call(NetInfo.fetch)).isConnected;

    if (!isConnected) {
      // If offline, load cached data
      const cachedWeather = yield call(AsyncStorage.getItem, `weather_${action.payload}`);
      if (cachedWeather) {
        yield put(actions.setCachedWeather(JSON.parse(cachedWeather)));
        return;
      } else {
        throw new Error('No internet and no cached data available.');
      }
    }

    // If online, fetch data from API
    const response = yield call(WeatherAPI.getForecast, action.payload);
    
    // Cache the new data
    yield call(AsyncStorage.setItem, `weather_${action.payload}`, JSON.stringify(response));

    yield put(actions.fetchWeatherSuccess(response));
  } catch (error) {
    yield put(actions.fetchWeatherFailure(error.message));
  }
}
export function* searchCitiesSaga(action) {
  try {
    const cities = yield call(WeatherAPI.searchCities, action.payload);
    yield put(actions.searchCitiesSuccess(cities));
  } catch (error) {
    yield put(actions.searchCitiesFailure(error.message));
    console.error('Search saga error:', error);
  }
}


export function* weatherSaga() {
  yield takeLatest(actions.fetchWeatherRequest.type, fetchWeatherSaga);
  yield takeLatest(actions.searchCitiesRequest.type, searchCitiesSaga); 

}