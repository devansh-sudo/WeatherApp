import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const SplashScreen = ({ onAnimationComplete }) => {
  const logoScale = new Animated.Value(0);
  const logoOpacity = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // First show the logo
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 10,
          friction: 2,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Then show the text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Timer to move to the main app
    const timer = setTimeout(onAnimationComplete, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#4facfe', '#00f2fe']}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" />
      
      <View style={styles.content}>
        {/* Animated Weather Icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
            style={styles.iconBackground}
          >
            <Icon name="partly-sunny" size={80} color="#fff" />
          </LinearGradient>
        </Animated.View>

        {/* Animated Text */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
            },
          ]}
        >
          <Text style={styles.title}>Weather App</Text>
          <Text style={styles.subtitle}>Your Daily Weather Companion</Text>
        </Animated.View>
      </View>

      {/* Bottom Text */}
      <Animated.Text
        style={[
          styles.bottomText,
          {
            opacity: textOpacity,
          },
        ]}
      >
        Powered by WeatherAPI
      </Animated.Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  iconBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 4.65,
    // elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
  },
  bottomText: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
});

export default SplashScreen;