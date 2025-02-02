import { CommonActions } from '@react-navigation/native';

export const resetToHome = (navigation) => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    })
  );
};

export const navigateToForecastDetail = (navigation, forecast, cityName) => {
  navigation.navigate('ForecastDetail', { forecast, cityName });
};