# Weather App

A modern React Native weather application that provides real-time weather information and forecasts using the WeatherAPI.
 
## Features

- Real-time weather information
- 3-day weather forecast
- City search with auto-suggestions
- Dynamic backgrounds based on weather conditions
- Pull-to-refresh functionality
- Detailed weather information including:
  - Temperature
  - Weather conditions
  - Humidity
  - Wind speed
  - Feels like temperature
- Modern UI with glassmorphism design
- Error handling and loading states

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/devansh-sudo/WeatherApp.git
cd WeatherApp
```

2. Install dependencies:
```bash
npm install
```

3. Add your WeatherAPI key:
Create a `.env` file in the root directory and add your API key:
```
APIKEY=your_api_key_here
```

4. Install pods (iOS only):
```bash
cd ios && pod install && cd ..
```

## Running the App

### For Android:
```bash
npm run android
# or
yarn android
```

### For iOS:
```bash
npm run ios
# or
yarn ios
```

## Project Structure

```
src/
├── api/
│   └── weatherApi.js
├── components/
│   ├── common/
│   │   ├── LoadingSpinner.js
│   │   └── SearchBar.js
│   └── weather/
│       ├── CurrentWeather.js
│       ├── ForecastList.js
│       └── WeatherCard.js
├── screens/
│   ├── HomeScreen.js
│   └── ForecastDetailScreen.js
│   └── SettingsScreen.js
├── store/
│   ├── actions/
│   │   └── weatherActions.js
│   ├── reducers/
│   │   └── weatherReducer.js
│   └── sagas/
│       └── weatherSaga.js
└── utils/
    └── weatherUtils.js
```

## Dependencies

- react-native: 0.72.x
- @react-navigation/native: ^6.x.x
- @react-navigation/stack: ^6.x.x
- redux: ^4.x.x
- react-redux: ^8.x.x
- redux-saga: ^1.x.x
- axios: ^1.x.x
- react-native-vector-icons: ^10.x.x

## API Reference

This app uses the WeatherAPI. You'll need to sign up for an API key at [WeatherAPI](https://www.weatherapi.com/).

## Environment Setup

Required environment variables:
```
APIKEY=your_api_key_here
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

Common issues and solutions:

1. Build fails:
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run android
```

2. Metro bundler issues:
```bash
# Clear metro cache
npm start -- --reset-cache
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Weather data provided by [WeatherAPI](https://www.weatherapi.com/)
- Background images from [Unsplash](https://unsplash.com/)
- Icons from [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)

## Contact

Your Name - devanshdixit97@gmail.com
Project Link: https://github.com/devansh-sudo/WeatherApp.git
