import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Image, Alert} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import { setResetAlarm } from '../../store/store';
import { useDispatch } from 'react-redux';

interface AlarmModalItemsProps {
    pillName: string;
    supplementSeq: number;
    imageUrl: string;
}

const AlarmModalItems: React.FC<AlarmModalItemsProps> = ({ pillName, supplementSeq, imageUrl}) => {
  const dispatch = useDispatch();
  const [openAlarmModal, setOpenAlarmModal] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      setToken(storedToken);
    };

    fetchToken();
  }, [])

  // 알람을 설정할 수 있는 모달을 연다
  const showAlarmModal = () => {
    setOpenAlarmModal(true);
  };

  // 알람 정보를 저장한다
  const setAlarm = async (alarmDate: Date, supplementSeq: number) => {
    const date = new Date(alarmDate);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    
    const time = `${hours}:${minutes}:${seconds}.00`;
    console.log(time);
    if (!alarmDate) {
      Alert.alert('알람 시간을 선택해 주세요.');
      return ;
    }

    // 백한테 보내자
    try {
      const response = await axios.post(`${API_URL}/api/v1/alarm`, 
      {
        supplementSeq: supplementSeq, 
        time: time,
        isTurnOn: true
      },
      {
        headers: {
          access: `${token}`,
        },
      });
      dispatch(setResetAlarm(true));
      Alert.alert(`알람이 ${alarmDate.toLocaleTimeString()}에 설정되었습니다`);
    } catch(error) {
      if (axios.isAxiosError(error)) {
      // 서버가 응답했는데 요청 실패
      console.error('Error Data:', error.response?.data);
      console.error('Error status', error.response?.status);
    } else {
      // 요청이 이루어지지 않았거나 오류 발생
      console.error('Error message:', (error as Error).message)
    }}
  };

  // 시간을 설정한다
  const onChange = (event: DateTimePickerEvent, selected: Date | undefined) => {
    if (event.type === 'set') {
      const currentDate = selected || date;
      setOpenAlarmModal(false)
      const changeUTCTime = new Date(currentDate);
      changeUTCTime.setHours(changeUTCTime.getHours()+9)
      setAlarm(changeUTCTime, supplementSeq)
    } else if (event.type === 'dismissed') {
      setOpenAlarmModal(false)
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <Image 
          source={{uri: imageUrl}} 
          style={styles.itemImage}
          />
        <Text>{pillName}</Text>
        <TouchableOpacity
          onPress={showAlarmModal}
        >
          <Text>알람 추가</Text>
        </TouchableOpacity>
        {openAlarmModal && (
          <DateTimePicker
            value={date}
            mode="time"
            display="clock"
            timeZoneName='Asia/Seoul'
            onChange={onChange}
          />
        )}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
  },
    itemImage: {
        width: 50,
        height: 50,
        marginRight: 15,
      },
});


export default AlarmModalItems;