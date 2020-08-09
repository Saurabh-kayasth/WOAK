import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
  ToastAndroid
} from "react-native";
import SendIncidentStyle from "../Styles/SendIncidentStyle";
import Header from "./Header";
import { Card } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { ScrollView } from "react-native-gesture-handler";
import ImagePicker from 'react-native-image-picker';
import firebase from "react-native-firebase";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment";
class SendIncident extends Component {

  constructor(props) {
    super(props);
    this.state = {
      description: null,
      topic: null,
      picture: null,
      isDisplayPreview: false,
      displaySource: null,
      avatarSource: null,
      incident_picture: null,
      loading: false
    }

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
    this.incidentRef = this.getRef().child("Incidents");
  }

  textDesChanged = (text) => {
    console.log(text);
    this.setState({
      description: text,
      isDisplayPreview: true
    })
  };

  textTopicChanged = (text) => {
    console.log(text);
    this.setState({
      topic: text,
      isDisplayPreview: true
    })
  };

  pickImage = () => {
    const options = {
      title: 'Select Avatar',
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
          displaySource: displaySource,
          isDisplayPreview: true
        });
      }
    });
  }

  getRef() {
    return firebase.database().ref();
  }

  formatDate = (date) => {
    var monthNames = [
      "Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  sendPost = () => {
    this.setState({
      loading: true
    });
    try {
      const ref = firebase
        .storage()
        .ref('incident')
        .child(this.state.email);
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
                incident_picture: url,
                loading: true
              });
              firebase.auth().onAuthStateChanged(user => {
                if (user) {

                  var key = this.incidentRef.push().key;
                  var date = new Date();
                  var dateStr = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
                  // var time = new Date();
                  var timestr = date.getHours() + ':' + date.getMinutes();
                  var now = this.formatDate(new Date());
                  var now_time = moment()
                    .utcOffset('+05:30')
                    .format(' hh:mm a');
                  this.getRef()
                    .child("Incidents/" + key)
                    .set({
                      _id: key,
                      uid: user.uid,
                      src_avt: global.userDetails[0].avt,
                      comments: "",
                      likes: 0,
                      topic: this.state.topic,
                      description: this.state.description,
                      picture: this.state.incident_picture,
                      datetime: now + ' ' + now_time
                    });
                  this.setState({
                    loading: false,
                  });

                  ToastAndroid.showWithGravity(
                    'The post has been sent.',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                  );
                }
              });
            });
          }
        );

      });
    } catch (err) {
      console.log('uploadImage try/catch error: ' + err.message);
    }
  }

  render() {
    return (
      <View style={[SendIncidentStyle.container, { backgroundColor: global.isDarkMode ? "#40404c" : "#e5e5e5" }]}>
        <StatusBar barStyle="light-content" backgroundColor={global.appHeaderBgColor} />
        <Header iconName={null} headerTitle="     Send Incident" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Card containerStyle={[SendIncidentStyle.cardContainer, { backgroundColor: global.isDarkMode ? "#2b2b39" : "#fff" }]}>
            {
              this.state.isDisplayPreview ?
                <View style={SendIncidentStyle.previewContainer}>
                  <Image
                    style={SendIncidentStyle.pictureStyle}
                    source={{ uri: this.state.displaySource.uri }}
                  />
                  <Text style={SendIncidentStyle.desText}>Topic</Text>
                  <Text style={SendIncidentStyle.desData}>{this.state.topic}</Text>
                  <Text style={SendIncidentStyle.desText}>Description</Text>
                  <Text style={SendIncidentStyle.desData}>{this.state.description}</Text>
                </View>
                :
                null
            }
            <View style={{ backgroundColor: global.isDarkMode ? "#2b2b39" : "#fff" }}>
              <View style={[SendIncidentStyle.cardTopicBody, { backgroundColor: global.isDarkMode ? "#2b2b39" : "#fff" }]}>
                <Image
                  source={{ uri: global.userDetails[0].avt }}
                  style={SendIncidentStyle.avatarStyle}
                />
                <TextInput
                  value={this.state.topic}
                  onChangeText={text => this.textTopicChanged(text)}
                  placeholder="Type Topic name here..."
                  placeholderTextColor="gray"
                  style={[SendIncidentStyle.input, { width: "65.5%", color: global.appFontColor, borderWidth: global.isDarkMode ? 0.3 : 1.5 }]}
                />
                <TouchableOpacity
                  style={[SendIncidentStyle.iconContainer, { width: "18%", elevation: 3, borderWWidth: 0, borderColor: "#77c995", backgroundColor: "#77c995" }]}
                  onPress={() => this.pickImage()}>
                  <Icon name="ios-camera" size={30} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={[SendIncidentStyle.cardBody, { backgroundColor: global.isDarkMode ? "#2b2b39" : "#fff" }]}>
                <TextInput
                  value={this.state.description}
                  onChangeText={text => this.textDesChanged(text)}
                  placeholder="Type description here..."
                  placeholderTextColor="gray"
                  style={[SendIncidentStyle.input, { width: "80%", color: global.appFontColor, borderWidth: global.isDarkMode ? 0.3 : 1.5 }]}
                />
                <TouchableOpacity
                  style={[SendIncidentStyle.iconContainer, { width: "18%", elevation: 3, borderWWidth: 0, borderColor: "#77c995", backgroundColor: "#77c995" }]}
                  onPress={() => this.sendPost()}>
                  <Text style={{ color: "#fff", fontWeight: "bold", letterSpacing: 1 }}>POST</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </ScrollView>
        <Spinner visible={this.state.loading} />
      </View>
    )
  }
}

export default SendIncident;

