/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appNameAndroid} from './app-android.json';
import {name as appNameIos} from './app-ios.json';

const appName = Platform.OS === "ios" ? appNameIos : appNameAndroid;

AppRegistry.registerComponent(appName, () => App);
