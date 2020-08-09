import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  TextInput,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";

import firebase from "react-native-firebase";

export default class Boiler extends Component {
  state = {
    name: ""
  };
  render() {
    return (
      <View style={styles.containerl}>
        <StatusBar barStyle="light-content" backgroundColor="#191922" />
        
        <TouchableOpacity>
          <Text
            style={styles.buttonStyle}
            onPress={() => this.props.navigation.navigate("Friendlist")}
          >
            Friend List
          </Text>
        </TouchableOpacity>
        <TouchableHighlight
          style={styles.button}
          onPress={() => {
            if(!firebase.apps.length)
    {
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
            firebase
              .auth()
              .signOut()
              .then(
                () => {
                  firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                      firebase.auth().signOut();
                    }
                  });
                },
                function(error) {
                  // An error happened.
                }
              );
            this.props.navigation.navigate("Login");
          }}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  title: {
    marginLeft: 20,
    marginTop: 20,
    fontSize: 20
  },
  button: {
    height: 50,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignSelf: "stretch",
    marginTop: 10,
    justifyContent: "center",
    paddingVertical: 15,
    marginBottom: 10,
    borderWidth : 1,
    borderColor : "white",
    borderRadius : 10,
    margin:10
  },
  buttonText: {
    fontSize: 18,
    alignSelf: "center",
    textAlign: "center",
    color: "#fff",
    fontWeight: "700"
  },
  nameInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    margin: 20
  },
  buttonStyle: {
    marginLeft: 20,
    margin: 20,
    fontSize: 18,
    color: "black",
  },
  containerl: {
    flex: 1,
  }
});

AppRegistry.registerComponent("Boiler", () => Boiler);
