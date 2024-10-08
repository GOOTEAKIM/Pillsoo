import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PillData} from '../../screens/Detail/DetailScreen';

export type DetailInfoProps = {
  pillData: PillData;
};

const DetailInfo: React.FC<DetailInfoProps> = ({pillData}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>💊효능</Text>
        <Text style={styles.contentText}>{pillData.functionality}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>💊주의할 점</Text>
        <Text style={styles.contentText}>{pillData.doseGuide}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>💊유통기한</Text>
        <Text style={styles.contentText}>{pillData.expirationDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 3,
    gap: 30,
  },
  contentContainer: {
    width: '90%',
    height: '25%',
  },
  contentText: {
    color: 'black',
  },
});

export default DetailInfo;
