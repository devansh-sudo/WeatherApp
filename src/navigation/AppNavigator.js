import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Platform, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ForecastDetailScreen from '../screens/ForecastDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SplashScreen from './SplashScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom header button component
const HeaderButton = ({ icon, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.headerButton}
    activeOpacity={0.7}
  >
    <View style={styles.headerButtonContainer}>
      <Icon name={icon} size={24} color="#000" />
    </View>
  </TouchableOpacity>
);

// Navigation Stacks
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: '#FFF',
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="WeatherHome"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Weather',
          headerShown:false,
        })}
      />
      <Stack.Screen
        name="ForecastDetail"
        component={ForecastDetailScreen}
        options={({ route, navigation }) => ({
          title: `${route.params?.cityName || ''} Forecast`,
          headerShown:false,
        })}
      />
    </Stack.Navigator>
  );
};

// Tab navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = route.name === 'Home'
            ? focused ? 'home' : 'home-outline'
            : focused ? 'settings' : 'settings-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4a90e2',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarStyle: styles.tabBar,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: '#FFF',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <HeaderButton
              icon="chevron-back"
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isSplashComplete ? (
          <Stack.Screen name="Splash">
            {props => (
              <SplashScreen
                {...props}
                onAnimationComplete={() => setIsSplashComplete(true)}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    color: '#000',
    fontSize: 18,
  },
  headerButton: {
    marginHorizontal: 8,
  },
  headerButtonContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
  },
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: Platform.OS === 'ios' ? 84 : 60,
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
});

export default AppNavigator;