import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  TouchableHighlight,
  Image,
  KeyboardAvoidingView,
  AsyncStorage,
  ToastAndroid
} from "react-native";
import { Card } from "react-native-elements";
import firebase from "react-native-firebase";
import ImagePicker from 'react-native-image-picker';
import Spinner from "react-native-loading-spinner-overlay";
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from "@react-native-community/geolocation";
import { NodeCameraView } from "react-native-nodemediaclient";
import Header from "./Header";
var Token;

export default class SendAlert extends Component {
  constructor(props) {
    super(props);

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

    this.state = {
      calamityType: "",
      calamDes: "",
      errorMessage: null,
      loading: false,
      displaySource: require('./avatar.png'),
      user_uid: "",
      user_profile: "",
      latitude: 0,
      longitude: 0,
      camps: [],
      isPictureSelected: false
    };
    // alert(this.props.navigation.state.params.location);
    this.campsRef = this.getRef().child("camps");
    this.alertsRef = this.getRef().child("alerts");
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

  renderErrorMessage = () => {
    if (this.state.errorMessage)
      return <Text style={styles.error}>{this.state.errorMessage}</Text>;
  };

  sendAlert() {

  }



  pickImage = () => {



    const options = {
      title: 'Add Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      // alert(JSON.stringify(response));

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.path.toString() };
        const displaySource = { uri: response.uri }
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
          displaySource: displaySource,
          isPictureSelected: true
        });
        //alert(JSON.stringify(this.state.avatarSource));
        // this.uploadImage(this.state.avatarSource);
      }
    });
  }

  componentDidMount = () => {
    this.getCamps(this.campsRef);

  };

  getCamps(campsRef) {
    campsRef.on("value", snap => {
      // get children as an array
      var items = [];
      snap.forEach(child => {
        items.push({
          name: child.val().name,
          latitude: child.val().latitude,
          longitude: child.val().longitude
        });
      });
      // alert(JSON.stringify(items));
      this.setState({
        camps: items
      })

      // alert(this.state.camps);
    });

  }

  uploadImage = async () => {
    this.setState({
      loading: true
    });
    var user = firebase.auth().currentUser;
    try {
      // const response = await fetch(this.state.avatarSource.uri);
      // const blob = await response.blob();
      const ref = firebase
        .storage()
        .ref('alerts')
        .child(user.email);
      const task = ref.putFile(this.state.avatarSource.uri);

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

              Geolocation.getCurrentPosition(position => {

                this.setState({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                });
                var key = this.alertsRef.push().key;
                this.getRef()
                  .child("alerts/" + key)
                  .set({
                    calamType: this.state.calamityType,
                    calamDes: this.state.calamDes,
                    picture: this.state.user_profile,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    location: this.props.navigation.state.params.location,
                    uid: user.uid,
                    alertId: key
                    // token: Token
                  });
                // alert("finish");
                this.setState({
                  loading: false,
                });

                ToastAndroid.showWithGravity(
                  'The alert has been sent.',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );


                var temp = this.state.latitude;
                var diff = 10000;
                for (var i = 0; i < this.state.camps.length; i++) {
                  if (this.state.latitude - this.state.camps[i].latitude < diff) {
                    temp = this.state.camps[i].latitude;
                    diff = this.state.latitude - this.state.camps[i].latitude;
                  }
                }
                var passObject = {};
                for (var i = 0; i < this.state.camps.length; i++) {
                  if (temp == this.state.camps[i].latitude) {
                    passObject = this.state.camps[i];
                    break;
                  }

                }
                this.props.navigation.navigate("maps", { "object": passObject, "latitude": this.state.latitude, "longitude": this.state.longitude });
                // alert("sjknsk");
              });



            });
          }
        );

      });
    } catch (err) {
      console.log('uploadImage try/catch error: ' + err.message);
    }
  };



  render() {
    return (
      <View behavior="padding" style={[styles.container, { backgroundColor: global.appBgColor }]}>
        <StatusBar barStyle="light-content" backgroundColor={global.appHeaderBgColor} />
        <Header iconName={null} headerTitle="     Send Alert" />
        {/* <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require("./banana.png")} />
          <Text style={styles.subtext}>Sign Up:</Text>
        </View> */}
        <Card
          containerStyle={[styles.cardContainer, { backgroundColor: global.appOptionsBgColor }]}
        >
          <View style={styles.logoContainer}>
            {
              this.state.isPictureSelected ?
                <Image style={styles.logo} source={this.state.displaySource} />
                :
                <View style={{ height: 50, width: "100%",borderWidth:0.5,borderColor:"gray", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                  <Text style={{ color: "gray", fontSize: 14 }}>No Picture</Text>
                </View>
            }

            <TouchableHighlight onPress={this.pickImage}>
              <Text>{'\n'}<Icon name="ios-camera" size={40} /></Text>
            </TouchableHighlight>
          </View>

          <TextInput
            value={this.state.calamityType}
            onChangeText={calamityType => this.setState({ calamityType })}
            style={[styles.input,{color:global.appFontColor,borderColor : global.isDarkMode ? "#40404c":"#000"}]}
            placeholder="Calamity Type..."
            placeholderTextColor="gray"
          />
          <TextInput
            multiline
            value={this.state.calamDes}
            onChangeText={calamDes => this.setState({ calamDes })}
            style={[styles.input,{color:global.appFontColor,borderColor : global.isDarkMode ? "#40404c":"#000"}]}
            placeholderTextColor="gray"
            placeholder="Calamity Description"
          />
          <TouchableHighlight
            onPress={this.uploadImage}
            style={[styles.button,{backgroundColor:global.isDarkMode ? "#2b2b39":"#77c995"}]}
          >
            <Text style={styles.buttonText}>Send Alert</Text>
          </TouchableHighlight>
        </Card>
        {this.renderErrorMessage()}
        <Spinner visible={this.state.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1.2,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#2b2b39",
    // padding: 20,
    // paddingTop: 100
  },
  logoContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30
  },
  logo: {
    width: "100%",
    height: 250,
    borderWidth: 0.5,
    borderColor: "white"
  },
  input: {
    height: 40,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: "white",
    borderRadius: 10
  },
  button: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "stretch",
    marginTop: 10,
    justifyContent: "center",
    paddingVertical: 15,
    marginBottom: 10,
    borderWidth: 0.2,
    borderColor: "white",
    borderRadius: 10,
    elevation : 5
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
  },
  cardContainer: {
    margin: 50,
    width: "90%",
    backgroundColor: "#e5e5e5",
    borderRadius: 5,
    elevation: 5,
    borderWidth: 0,
    borderColor : "gray"
  }
});

AppRegistry.registerComponent("Register", () => Register);
