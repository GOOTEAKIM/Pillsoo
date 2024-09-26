/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message Handled in the background!', remoteMessage);
});

function HeadlessCheck({isHeadless}) {
    if (isHeadless) {
        return null;
    }

    return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
