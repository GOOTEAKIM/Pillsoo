import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Header from '../../components/common/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { navigations } from '../../constants/navigations';

const images = [
  require('../../assets/profile/0.png'),
  require('../../assets/profile/1.png'),
  require('../../assets/profile/2.png'),
  require('../../assets/profile/3.png'),
  require('../../assets/profile/4.png'),
  require('../../assets/profile/5.png'),
  require('../../assets/profile/6.png'),
  require('../../assets/profile/7.png'),
  require('../../assets/profile/8.png'),
  require('../../assets/profile/9.png'),
];

export type MyPageParamList = {
  MyPage: undefined;
  MyPageReviewList: undefined;
  UserUpdate: undefined;
}

export type MyPageReviewScreenNavigationProp = StackNavigationProp<
  MyPageParamList,
  'MyPage'
>

export type Props = {
  navigation: MyPageReviewScreenNavigationProp;
}

const MyPageScreen:React.FC<Props> = ({navigation}) => {
  // 유저 정보 받기
  const myInfo = [
    {id:445674, name: '현우'}
  ];

  const imageNumber = myInfo[0].id % 10;

  const goLogout = () => {
    Alert.alert(
      '로그아웃',
      '로그아웃하시겠습니까?',
      [
        {
          text: '예',
        },
        {
          text: '아니요',
          style: 'cancel'
        }
      ]
    )
  }

  const goDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '모든 정보가 삭제됩니다.그래도 탈퇴하시겠습니까?',
      [
        {
          text: '예',
        },
        {
          text: '아니요',
          style: 'cancel'
        }
      ]
    )
  }

  return (
    <>
      <Header />
      <View style={styles.container}>
          <Image 
            // source={images[imageNumber]}
            source={require('../../assets/profile/메타츄.png')}
            style={styles.ProfileImage}
          />
          <View style={styles.profileNameBox}>
            <Text style={styles.profileName}>{myInfo[0].name}</Text>
          </View>
          <View style={styles.myPageMenuBox}>
            <TouchableOpacity
              style={styles.eachMenuBox}
              onPress={() => navigation.navigate('MyPageReviewList')}
            >
              <Text style={styles.eachMenuText}>내 리뷰 보러가기</Text>
              <Text>{'>'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.eachMenuBox}
              onPress={() => navigation.navigate('UserUpdate')}
            >
              <Text style={styles.eachMenuText}>회원정보 수정</Text>
              <Text>{'>'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.eachMenuBox}
              onPress={goLogout}
            >
              <Text style={styles.eachMenuText}>로그아웃</Text>
              <Text>{'>'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.eachMenuBox}
              onPress={goDeleteAccount}
            >
              <Text style={styles.eachMenuText}>회원탈퇴</Text>
              <Text>{'>'}</Text>
            </TouchableOpacity>
          </View>
          </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ProfileImage: {
    width: '40%',
    height: '40%',
    resizeMode: 'contain',
    marginTop: '15%',
    marginHorizontal: '30%',
  },
  profileName: {
    fontSize: 25,
    color: 'black',
  },
  profileNameBox: {
    marginTop: '-10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myPageMenuBox: {
    marginVertical: 60,
    // gap: 2,
  },
  eachMenuBox: {
    flexDirection: 'row',
    height: '16%',
    alignItems: 'center',
    borderTopColor: 'gray',
    borderBottomWidth: 1.2,
    borderBottomColor: '#F6F5F2',
    backgroundColor: '#D3EBCD',
    paddingHorizontal: 10,
    justifyContent: 'space-between',

  },
  eachMenuText: {
    color: 'black',
  }
});

export default MyPageScreen;
