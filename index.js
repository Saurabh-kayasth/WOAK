/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import './global';
import './app/config/router';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
