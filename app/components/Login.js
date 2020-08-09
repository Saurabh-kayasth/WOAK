import React, { Component } from "react";
import {
  AppRegistry,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage,
  Image,
  StatusBar,
  TextInput,
  StyleSheet, // CSS-like styles
  Text, // Renders text
  View // Container component
} from "react-native";

import Spinner from "react-native-loading-spinner-overlay";
import firebase from "react-native-firebase";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false,
      errorMessage: null
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
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#16a085",
      elevation: null
    },
    header: null
  };

  async onLoginPress() {
    this.setState({ errorMessage: null, loading: true });
    const { email, password } = this.state;
    console.log(email);
    console.log(password);
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.setState({
          errorMessage,
          loading: false
        });
      });
    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("password", password);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          loading: false
        });
      }

    });

    this.props.navigation.navigate("Home");
  }

  renderErrorMessage = () => {
    if (this.state.errorMessage)
      return <Text style={styles.error}>{this.state.errorMessage}</Text>;
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#2b2b39" />
        <View behavior="padding" style={styles.container}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={{ uri: "https://firebasestorage.googleapis.com/v0/b/book-store-56297.appspot.com/o/logo%2Ficon.png?alt=media&token=c7f92169-f597-408e-af31-774eda3ee0b1" }} />
            {/* <Text style={styles.subtext}>Humdum</Text> */}
          </View>
          <KeyboardAvoidingView style={styles.keyboard}>
            <TextInput
              style={styles.input}
              // style={{borderWidth : 1,borderColor : "white",borderRadius : 10,marginBottom : 5,paddingLeft : 6,backgroundColor:"#575772",color : "white"}}
              placeholder="Username"
              placeholderTextColor="rgba(255,255,255,0.7)"
              returnKeyType="next"
              onSubmitEditing={() => this.passwordInput.focus()}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />
            <TextInput
              style={styles.input}
              // style={{borderWidth : 1,borderColor : "white",borderRadius : 10,marginBottom : 10,paddingLeft : 6,backgroundColor:"#575772",color : "white"}}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.7)"
              returnKeyType="go"
              secureTextEntry
              ref={input => (this.passwordInput = input)}
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.onLoginPress.bind(this)}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
        <View style={{flexDirection:"column",width:"100%",padding:20,paddingTop:0,justifyContent:"space-between"}}>
          <TouchableOpacity style={styles.button}>
            <Text
              style={styles.buttonText}
              onPress={() => this.props.navigation.navigate("Register")}
              title="Sign up"
            >
              Sign up
          </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text
              style={styles.buttonText}
              onPress={() => this.props.navigation.navigate("ForgetPassword")}
              title="Forget Password"
            >
              Forget Password
          </Text>
          </TouchableOpacity>
        </View>
        {this.renderErrorMessage()}
        <Spinner visible={this.state.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b2b39"
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 190,
    height: 190
  },
  subtext: {
    color: "#ffffff",
    marginTop: 10,
    width: 160,
    textAlign: "center",
    opacity: 0.8
  },
  keyboard: {
    margin: 20,
    // padding: 20,
    alignSelf: "stretch"
  },
  input: {
    height: 40,
    width: 350,
    marginBottom: 10,
    backgroundColor: "#2b2b39",
    color: "#fff",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#7f7f88",
    borderRadius: 10
  },
  buttonContainer: {
    height: 50,
    backgroundColor: "#292939",
    alignSelf: "stretch",
    marginTop: 10,
    justifyContent: "center",
    paddingVertical: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#7f7f88",
    borderRadius: 10,
    elevation: 7
  },
  buttonText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700"
  },
  button: {
    backgroundColor: "#22222d",
    paddingVertical: 15,
    width:"100%",
    borderRadius : 15,
    borderColor : "#7f7f88",
    borderWidth:0.5,
    alignSelf:"center",
    marginBottom:10,
    elevation:20
  },
  error: {
    margin: 8,
    marginBottom: 0,
    color: "red",
    textAlign: "center"
  }
});

AppRegistry.registerComponent("Login", () => Login);
