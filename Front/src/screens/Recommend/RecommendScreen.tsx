import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const RecommendScreen = () => {
  return (
    <View style={styles.container}>
      <Text>RecommendScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecommendScreen;
