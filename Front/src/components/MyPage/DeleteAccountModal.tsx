import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '@env';
import {setOpenDeleteAccountMOdal} from '../../store/store';

// interface DeleteAccountModalProps {

// }

function DeleteAccountModal() {
  const [lastModal, setLastModal] = useState<boolean>(false);
  const dispatch = useDispatch();

  const goDeleteAccount = async () => {
    const storedToken = await AsyncStorage.getItem('jwt_token');

    try {
      const response = await axios.delete(`${API_URL}/api/v1/quit`, {
        headers: {
          access: `${storedToken}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const golastModal = () => {
    setLastModal(true);
  };

  const goCloselastModal = () => {
    setLastModal(false);
    dispatch(setOpenDeleteAccountMOdal(false));
  };

  const loastModalContainer = (
    <Modal style={styles.modalContainer} transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalContentContainer}>
          <Image
            source={require('../../assets/danbi.jpg')}
            style={styles.danbiImage}></Image>
          <TouchableOpacity
            onPress={() => dispatch(setOpenDeleteAccountMOdal(false))}>
            <View>
              <Text style={styles.message2}>넌 못 가 바보야</Text>
            </View>
            <View style={styles.messageContainer}>
              <TouchableOpacity onPress={goCloselastModal}>
                <View style={styles.message1Container}>
                  <Text style={styles.message1}>닫기</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <Modal style={styles.modalContainer} transparent={true}>
      <View style={styles.container}>
        <View style={styles.modalContentContainer}>
          <Image
            source={require('../../assets/deleteaccount.png')}
            style={styles.logoutImage}></Image>
          <TouchableOpacity
            onPress={() => dispatch(setOpenDeleteAccountMOdal(false))}>
            <View>
              <Text style={styles.message2}>모든 정보가 사라집니다.</Text>
              <Text style={styles.message2}>그래도</Text>
              <Text style={styles.message2}>탈퇴하시겠습니까?</Text>
            </View>
            <View style={styles.messageContainer}>
              <TouchableOpacity onPress={golastModal}>
                <View style={styles.message1Container}>
                  <Text style={styles.message1}>예</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={goCloselastModal}>
                <View style={styles.message3Container}>
                  <Text style={styles.message2}>아니요</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {lastModal && loastModalContainer}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '30%',
    height: '40%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentContainer: {
    width: 300,
    padding: 45,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutImage: {
    width: 75,
    height: 75,
    bottom: 15,
    resizeMode: 'contain',
  },
  danbiImage: {
    width: 80,
    height: 70,
    bottom: 15,
    resizeMode: 'contain',
  },
  messageContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message1Container: {
    borderRadius: 5,
    backgroundColor: '#00FF00',
    width: 65,
    height: 35,
  },
  message1: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 15,
    marginVertical: 2,
  },
  message2: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  message3Container: {
    borderRadius: 5,
    width: 85,
    height: 35,
    bottom: -3,
  },
});

export default DeleteAccountModal;
