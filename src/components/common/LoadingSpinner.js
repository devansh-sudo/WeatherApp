import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'large', color = '#0066cc' }) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

// LoadingSpinner.propTypes = {
//   size: PropTypes.oneOf(['small', 'large']),
//   color: PropTypes.string,
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingSpinner;