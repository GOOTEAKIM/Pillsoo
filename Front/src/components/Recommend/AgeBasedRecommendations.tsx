import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import RecommendItem from '../../components/Recommend/RecommendItem';
import {useSelector} from 'react-redux';

type RecommendPill = {
  id: number;
  imageUrl: string;
  pillName: string;
  isRandom: boolean;
};

interface Props {
  age: number | null;
  recommendPills: RecommendPill[] | null;
  isLoading: boolean;
}

const AgeBasedRecommendations = (props: Props) => {
  const nickname = useSelector(
    (state: {nickname: string | null}) => state.nickname,
  );
  const [recommendKeyword, setRecommendKeyword] = useState<string | null>(null);

  const {age, recommendPills, isLoading} = props;
  // const age2 = Math.floor(age / 10) * 10;
  const isRandom = recommendPills?.[0]?.isRandom;

  useEffect(() => {
    if (isRandom === false) {
      setRecommendKeyword(
        `${nickname}님과 비슷한 나이대의 유저들이 \n관심있는 영양제 추천`,
      );
    } else {
      setRecommendKeyword(`${nickname}님에게 맞는 영양제 추천`);
    }
  }, [isRandom, nickname]);

  return (
    <View style={styles.recommendBox}>
      <Text style={styles.recommendText}>{recommendKeyword}</Text>
      <View style={isLoading ? styles.loadingBar : styles.itemsContainer}>
        {isLoading ? (
          <>
            <ActivityIndicator size="large" color="#00FF00" />
            <Text>영양제 추천 받는 중...</Text>
          </>
        ) : (
          recommendPills.map(recommendPill => (
            <RecommendItem
              key={recommendPill.id}
              id={recommendPill.id}
              imageUrl={recommendPill.imageUrl}
              pillName={recommendPill.pillName}
            />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recommendBox: {
    marginTop: 25,
  },
  recommendText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  loadingBar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 67,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default AgeBasedRecommendations;
