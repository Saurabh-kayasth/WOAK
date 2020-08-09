import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  ImageBackground
} from "react-native";
import { Card } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/Ionicons";
export default class ForgetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      errorMessage: null,
      password: "",
      loading: false
    };
  }
  static navigationOptions = {
    headerTransparent: true,
    headerTintColor: "#fff"
  };

  onForgetPress() {
    this.setState({ errorMessage: null, loading: true });
    const { email } = this.state;
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
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        this.setState({ loading: false });
        alert("The email has been sent to reset password.");
        this.props.navigation.navigate("Login");
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.setState({
          errorMessage,
          loading: false
        });
      });
  }

  renderErrorMessage = () => {
    if (this.state.errorMessage)
      return <Text style={styles.error}>{this.state.errorMessage}</Text>;
  };

  render() {
    return (
      <View style={[styles.container,{backgroundColor:global.appBgColor}]}>
        <StatusBar barStyle="light-content" backgroundColor={global.appHeaderBgColor} />
        <View style={[styles.header, { backgroundColor: global.appHeaderBgColor}]}>
          <Text style={styles.headerText}>
             Change Password
                </Text>
        </View>
        <Card
        containerStyle = {[styles.cardStyle,{backgroundColor : global.appOptionsBgColor}]}
        >
          <Text style={{color : global.isDarkMode ? "#8c8c93":"#ff9cad",marginBottom:20}}>The mail will be sent to below given Email-Id.</Text>
          <Text style={{color : "gray",fontSize : 20,marginBottom : 7}}>Email Id</Text>
          <TextInput
            placeholder="Email Id"
            placeholderTextColor="gray"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.input,{backgroundColor : global.appComponentBgColor,borderColor: global.isDarkMode ? "#40404c":"#e5e5e5"}]}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          <TouchableOpacity
            style={[styles.buttonContainer,{backgroundColor : "#77c995",borderColor: global.isDarkMode ? "#40404c":"#77c995" }]}
            onPress={this.onForgetPress.bind(this)}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </Card>

        {this.renderErrorMessage()}
        <Spinner visible={this.state.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    // backgroundColor:global.appBgColor
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 200,
    height: 200
  },
  cardStyle : {
    borderRadius : 10,
    marginTop:200,
    elevation:5,
    height : 300,
    justifyContent:"center",
    borderWidth : 0.3
  },
  input: {
    height: 40,
    marginBottom: 10,
    backgroundColor: "#ff5b77",
    color: "#fff",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ff9cad",
    borderRadius: 10
  },
  buttonContainer: {
    backgroundColor: "#ff5b77",
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#ff9cad",
    borderRadius: 10,
    elevation : 5
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700"
  },
  header: {
    zIndex: -1,
    height: 60,
    width: "100%",
    paddingLeft: 55,
    justifyContent: "center",
    elevation: 10,
  },
  headerText: {
    fontSize: 25,
    color: "#fff"
  }
});
