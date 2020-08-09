import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  AsyncStorage
} from "react-native";

import firebase from "react-native-firebase";
import ImagePicker from 'react-native-image-picker';
import Spinner from "react-native-loading-spinner-overlay";
import Icon from 'react-native-vector-icons/Ionicons';
import MainScreenNavigator from "../config/router";
var Token;

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      contact: "",
      address: "",
      password: "",
      password_confirmation: "",
      errorMessage: null,
      loading: false,
      displaySource: "https://firebasestorage.googleapis.com/v0/b/woak-cda27.appspot.com/o/avatar%2Favatar_1.png?alt=media&token=40f461d9-9296-4aed-a51d-4f17c597bab8",
      user_uid: "",
      user_profile: "",
      avatar_icon1: "https://firebasestorage.googleapis.com/v0/b/woak-cda27.appspot.com/o/avatar%2Favatar_3.png?alt=media&token=128fcda4-1ead-4538-9694-b317d2924abe",
      avatar_icon2: "https://firebasestorage.googleapis.com/v0/b/woak-cda27.appspot.com/o/avatar%2Favatar_2.png?alt=media&token=23fe8037-6a00-42e1-87ca-64913a3c9606",
      avatar_icon3: "https://firebasestorage.googleapis.com/v0/b/woak-cda27.appspot.com/o/avatar%2Favatar_1.png?alt=media&token=40f461d9-9296-4aed-a51d-4f17c597bab8",
      avatar_icon4: "https://firebasestorage.googleapis.com/v0/b/woak-cda27.appspot.com/o/avatar%2Favatar_4.png?alt=media&token=138b02a6-90ca-4f92-aad4-298549b871e3",
      avatar_selected : true,
      isLoggedIn : false
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

  selectAvatar = (avt) => {
    this.setState({
      displaySource: avt,
      avatar_selected : true
    })
  }

  getRef() {
    return firebase.database().ref();
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#2b2b39",
      elevation: null
    },
    headerTitleStyle: {
      color: "white"
    }
  };

  async onRegisterPress() {
    this.setState({ errorMessage: null, loading: true });
    const { email, password, name } = this.state;
    console.log(email);
    console.log(name);
    console.log(password);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        this.setState({ errorMessage, loading: false });
      });

    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("name", name);
    await AsyncStorage.setItem("password", password);

    
    if(this.state.avatar_selected)
    {
      this.registerWithAvatar(this.state.displaySource);
    }
    else{
      this.uploadImage(this.state.avatarSource);
    }

  }

  registerWithAvatar = uri => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user.uid, user.email);
        this.setState({
          user_uid: user.uid
        });
        this.getRef()
          .child("friends/" + user.uid)
          .set({
            email: user.email,
            uid: user.uid,
            name: this.state.name,
            avatar: uri,
            contact: this.state.contact,
            address: this.state.address,
            groups: ""
          });
        this.setState({
          loading: false,
          isLoggedIn : true
        });
      }
    });
  }

  renderErrorMessage = () => {
    if (this.state.errorMessage)
      return <Text style={styles.error}>{this.state.errorMessage}</Text>;
  };

  pickImage = () => {
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.path.toString() };
        const displaySource = { uri: response.uri }
        this.setState({
          avatarSource: source,
          displaySource: displaySource.uri,
          avatar_selected : false

        });
      }
    });
  }

  uploadImage = async uri => {
    try {
      const ref = firebase
        .storage()
        .ref('avatar')
        .child(this.state.email);
      const task = ref.putFile(uri.uri);

      return new Promise((resolve, reject) => {
        task.on('state_changed',
          (snapshot) => {
            // alert("progress");
          },
          (error) => {
            //alert("founderror");
          },
          () => {
            ref.getDownloadURL().then(url => {
              this.setState({
                user_profile: url,
                loading: true
              });
              firebase.auth().onAuthStateChanged(user => {
                if (user) {
                  console.log(user.uid, user.email);
                  this.setState({
                    user_uid: user.uid
                  });
                  this.getRef()
                    .child("friends/" + user.uid)
                    .set({
                      email: user.email,
                      uid: user.uid,
                      name: this.state.name,
                      avatar: this.state.user_profile,
                      contact: this.state.contact,
                      address: this.state.address,
                      groups: ""
                    });
                  this.setState({
                    loading: false,
                    isLoggedIn : true
                  });
                  this.props.navigation.navigate("Home");
                }
              });
            });
            
          }
        );

      });
    } catch (err) {
      alert('uploadImage try/catch error: ' + err.message);
    }
  };


  render() {
    if(this.state.isLoggedIn)
    {
      return <MainScreenNavigator/>
    }
    else{
      return (
        <View behavior="padding" style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#2b2b39" />
  
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={{uri:this.state.displaySource}} />
  
            <TouchableHighlight style={styles.logoShadowContainer} onPress={this.pickImage}>
              <Text>{'\n'}<Icon name="ios-camera" size={40} color="#e5e5e5" /></Text>
            </TouchableHighlight>
          </View>
          <View style={styles.avatarConatiner}>
            <TouchableOpacity onPress={()=> this.selectAvatar(this.state.avatar_icon1)}>
              <Image style={styles.avatarUser}
                source={{ uri: this.state.avatar_icon1 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.selectAvatar(this.state.avatar_icon2)}>
              <Image style={styles.avatarUser}
                source={{ uri: this.state.avatar_icon2 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.selectAvatar(this.state.avatar_icon3)}>
              <Image style={styles.avatarUser}
                source={{ uri: this.state.avatar_icon3 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.selectAvatar(this.state.avatar_icon4)}>
              <Image style={styles.avatarUser}
                source={{ uri: this.state.avatar_icon4 }} />
            </TouchableOpacity>
          </View>
          <TextInput
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
            style={styles.input}
            placeholder="Enter Name..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            returnKeyType="next"
            onSubmitEditing={() => this.emailInput.focus()}
          />
          <TextInput
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
            style={styles.input}
            placeholderTextColor="rgba(255,255,255,0.7)"
            returnKeyType="next"
            ref={input => (this.emailInput = input)}
            onSubmitEditing={() => this.passwordCInput.focus()}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Enter Email..."
          />
          <TextInput
            value={this.state.contact}
            onChangeText={contact => this.setState({ contact })}
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter Contact..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            returnKeyType="next"
          // onSubmitEditing={() => this.emailInput.focus()}
          />
          <TextInput
            value={this.state.address}
            onChangeText={address => this.setState({ address })}
            style={styles.input}
            placeholder="Enter Address..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            returnKeyType="next"
          // onSubmitEditing={() => this.emailInput.focus()}
          />
          <TextInput
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            style={styles.input}
            placeholder="Enter Password..."
            secureTextEntry={true}
            placeholderTextColor="rgba(255,255,255,0.7)"
            ref={input => (this.passwordCInput = input)}
            onSubmitEditing={() => this.passwordInput.focus()}
            returnKeyType="next"
            secureTextEntry
          />
          <TextInput
            value={this.state.password}
            onChangeText={password_confirmation =>
              this.setState({ password_confirmation })
            }
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            placeholderTextColor="rgba(255,255,255,0.7)"
            returnKeyType="go"
            secureTextEntry
            ref={input => (this.passwordInput = input)}
          />
          <TouchableHighlight
            onPress={this.onRegisterPress.bind(this)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableHighlight>
          {this.renderErrorMessage()}
          <Spinner visible={this.state.loading} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1.2,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#2b2b39",
    padding: 20,
    justifyContent:"flex-end"
  },
  avatarConatiner: {
    flexDirection: "row",
    backgroundColor: "#2b2b39",
    elevation: 5,
    borderRadius: 10,
    borderWidth: 0.5,
    marginBottom: 20,
    width: "100%",
    height: 85,
    borderColor: "#7f7f88",
    padding: 17,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    borderTopWidth:0,
    borderBottomWidth:0
  },
  avatarUser: {
    height: 50,
    width: 50,
    borderRadius: 25,
    elevation: 10
  },
  logoContainer: {
    alignItems: "center",
    // flexGrow: 1,
    marginBottom: 25,
    height: 200,
    width: 200,
    justifyContent: "center",
    alignItems: "center"
  },
  logoShadowContainer: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    height: 200,
    width: 200,
    borderRadius: 100,
    top: 0,
    left: 0,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "white"
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
  button: {
    height: 50,
    backgroundColor: "#2b2b39",
    alignSelf: "stretch",
    marginTop: 10,
    justifyContent: "center",
    paddingVertical: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#7f7f88",
    borderRadius: 10,
    elevation: 15
  },
  buttonText: {
    fontSize: 18,
    alignSelf: "center",
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700"
  },
  subtext: {
    color: "#ffffff",
    width: 160,
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 20
  },
  error: {
    margin: 8,
    marginBottom: 0,
    color: "red",
    textAlign: "center"
  }
});

AppRegistry.registerComponent("Register", () => Register);
