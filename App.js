/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  StyleSheet,
  PermissionsAndroid
} from "react-native";
import './global';
import Login from "./app/components/Login";
import Boiler from "./app/components/Boiler";
import Friendlist from "./app/components/Friendlist";
import Chat from "./app/components/Chat";
import GloChat from "./app/components/GloChat";
import ForgetPassword from "./app/components/ForgetPassword";
import Register from "./app/components/Register";
import Utils from "./app/components/GetUser";
//=======================
import MainScreenNavigator from "./app/config/router";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import firebase from "react-native-firebase";
// import "@firebase/messaging";
class Home extends Component {
  constructor() {
    super();
    this.state = {
      page: "connection",
      loading: true,
      authenticated: false
    };
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAyN3_c-pFM5_qFK0uhDFyKYXu7HxlNQd4",
        authDomain: "woak-cda27.firebaseapp.com",
        databaseURL: "https://woak-cda27.firebaseio.com",
        projectId: "woak-cda27",
        storageBucket: "woak-cda27.appspot.com",
        messagingSenderId: "77118073892",
        appId: "1:77118073892:web:0da189fd8153ccebb23cb1",
        measurementId: "G-GNSPSGZHWY"
      });
    }
    this.statusRef = this.getRef().child("status");
  }

  getRef() {
    return firebase.database().ref();
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#ffb600",
      elevation: null
    },
    header: null
  };

  componentDidMount = async () => {
    //================LOCATION PERMISSION========================
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Device Location",
          message: "Allow to access your device location",
          buttonNeutral: "Ask me later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      )
    } catch (err) {
      console.log(err);
    }
    //==========================================================

    //==================IS AUTHENTICATED========================
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ loading: false, authenticated: true });
      } else {
        this.setState({ loading: false, authenticated: false });
      }
    });
    //==========================================================
    Utils.getUserDetails();

    //==================== DELETE OLD STATUS ===================
    var ref = this.getRef().child("status");
    var now = Date.now();
    var cutoff = now - 12 * 60 * 60 * 1000;
    var old = ref.orderByChild('timestamp').endAt(cutoff).limitToLast(1);
    var listener = old.on('child_added', function (snapshot) {
      snapshot.ref.remove();
    });
    //==========================================================

    //============ SEND ALERT NOTIFICATION =====================
    firebase.messaging().subscribeToTopic("alerts")
      .then(function(response){
        console.log('Successfully subscribed to topic:=============================', response);
      })
      .catch(function(error) {
        console.log('Error subscribing to topic:======================================', error);
      });

      firebase.messaging().requestPermission().then(()=>{
        console.log("hello==");
      })
  }

  render() {
    console.disableYellowBox = true;
    if (this.state.loading) return null; // Render loading/splash screen etc
    if (!this.state.authenticated) {
      return <Login navigation={this.props.navigation} />;
    }
    // return <Boiler navigation={this.props.navigation} />;
    return <MainScreenNavigator />
    // return <Login navigation={this.props.navigation} />;
  }
}

const App = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      title: "Home",
      headerTintColor: "white",
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      title: "Login",
      headerTintColor: "white"
    }
  },
  Register: {
    screen: Register,
    navigationOptions: {
      header: null
    },
    // header:null
  },
  ForgetPassword: {
    screen: ForgetPassword,
    navigationOptions: {
      headerTransparent: true,
      headerTintColor: "#fff",
      headerStyle: {
        position: "absolute",
        backgroundColor: "transparent",
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0
      },
    },
  },
  Boiler: {
    screen: Boiler,
    navigationOptions: {
      title: "Home",
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: "#2b2b39"
      },
      headerTitleStyle: {
        color: "white"
      }
    },
  },
  GloChat: {
    screen: GloChat,
    navigationOptions: {
      title: "Group Chat",
      headerTintColor: "white"
    },

  },
  Friendlist: {
    screen: Friendlist,
    navigationOptions: {
      title: "Friend List",
      headerTintColor: "white"
    },
  },
  Chat: {
    screen: Chat,
    defaultNavigationOptions: {
      title: "Chat",
      headerTintColor: "white",
      headerStyle: {
        position: "absolute",
        backgroundColor: "transparent",
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0
      },
      headerTitleStyle: {
        color: "white"
      }
    }
  },
  // OtherTeamDetails : {
  //   screen: OtherTeamDetails,
  //   // navigationOptions : HeaderStyle
  // },
});

const App2 = createAppContainer(App);
export default App2;
const styles = StyleSheet.create({});
