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
  ToastAndroid
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/Ionicons";
export default class CreateTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      uid: null,
      email: "",
      dataSource: [],
      dataBackup: [],
      query: "",
      avatar_uri: "",
      mounted: true,
      loading: false,
      groups: [],
      group_details: [],

    };

    this.createTeam = this.createTeam.bind(this);
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
      loading: false,
      display_avatar: "https://firebasestorage.googleapis.com/v0/b/woak-cda27.appspot.com/o/teamAvatar%2Fteam1.png?alt=media&token=ea0d4cab-89f3-453a-8050-6af088f0fef3",
      avatar_icon1: "https://firebasestorage.googleapis.com/v0/b/woak-cda27.appspot.com/o/teamAvatar%2Fteam1.png?alt=media&token=ea0d4cab-89f3-453a-8050-6af088f0fef3",
      avatar_icon2: "https://firebasestorage.googleapis.com/v0/b/woak-cda27.appspot.com/o/teamAvatar%2Fteam2.png?alt=media&token=76d9e58c-5dbc-4697-87c6-d0162869a708",
      avatar_icon3: "https://firebasestorage.googleapis.com/v0/b/woak-cda27.appspot.com/o/teamAvatar%2Fteam3.jpg?alt=media&token=e24526a3-809d-4d00-b896-251296f7b840",
      avatar_icon4: "https://firebasestorage.googleapis.com/v0/b/woak-cda27.appspot.com/o/teamAvatar%2Fteam4.jpg?alt=media&token=7f129eb8-3c62-43f2-90fc-11b8eca53c11",

    };

    this.friendsRef = this.getRef().child("friends");
    this.groupRef = this.getRef().child("GroupDetails");

  }
  static navigationOptions = {
    headerTransparent: true,
    headerStyle: {
      // backgroundColor: global.appTopTabBarBgColor,
      elevation: null
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      color: "white"
    }
  };

  createTeam() {
    var user = firebase.auth().currentUser;
    // this.groupRef = this.getRef().child("GroupDetails");
    // alert(this.groupRef);
    var key = this.groupRef.push().key;
    var members = [];
    members.push(user.uid);
    this.groupRef.push({
      _id: key,
      members: members,
      name: this.state.email,
      avatar: this.state.display_avatar
    });
    ToastAndroid.showWithGravity(
      'The team has been created.',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    var chatRef = this.getRef().child("friends");
    // alert(chatRef);
    var chatRefData = chatRef.orderByChild("uid").equalTo(user.uid);
    var demo = "Demo User";
    chatRefData.on("child_added",
      (snapshot) => {
        var items = snapshot.val().groups;
        if (items == "") {
          items = [];
        }
        items.push(key);
        snapshot.ref.update({ groups: items });
      });
  }

  selectAvatar = (avt) => {
    this.setState({
      display_avatar: avt,
      avatar_selected: true
    })
  }

  getRef() {
    return firebase.database().ref();
  }

  renderErrorMessage = () => {
    if (this.state.errorMessage)
      return <Text style={styles.error}>{this.state.errorMessage}</Text>;
  };

  render() {
    return (
      <View style={[styles.container, { backgroundColor: global.appBottomTabBarBgColor }]}>
        <StatusBar barStyle="light-content" backgroundColor={global.appTopTabBarBgColor} />
        <View style={[styles.header, { backgroundColor: global.appHeaderBgColor }]}>
          <Text style={styles.headerText}>
            Create Group
                </Text>
        </View>
        <View style={[styles.createTeamContainer, { backgroundColor: global.appBottomTabBarBgColor, borderColor: "gray" }]}>
          <View style={{ height: 200, width: "100%", backgroundColor: "#2b2b39", borderRadius: 10, marginBottom: 20, elevation: 20 }}>
            <Image
              style={{ height: 200, width: "100%", borderRadius: 10 }}
              source={{ uri: this.state.display_avatar }}
            />
            {/* <TouchableOpacity style={styles.avatarOverlay}>
              <TouchableOpacity style={styles.cameraCover}>
              <Icon name="ios-camera" size={40} color="#fff"/>
              </TouchableOpacity>
              
            </TouchableOpacity> */}
          </View>
          <View style={[styles.avatarConatiner, { backgroundColor: global.appBottomTabBarBgColor, borderColor: global.isDarkMode ? "#8c8c93" : "#ff9cad" }]}>
            <TouchableOpacity onPress={() => this.selectAvatar(this.state.avatar_icon1)}>
              <Image style={styles.avatarUser}
                source={{ uri: this.state.avatar_icon1 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.selectAvatar(this.state.avatar_icon2)}>
              <Image style={styles.avatarUser}
                source={{ uri: this.state.avatar_icon2 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.selectAvatar(this.state.avatar_icon3)}>
              <Image style={styles.avatarUser}
                source={{ uri: this.state.avatar_icon3 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.selectAvatar(this.state.avatar_icon4)}>
              <Image style={styles.avatarUser}
                source={{ uri: this.state.avatar_icon4 }} />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 18, marginBottom: 5, color: global.appFontColor }}>Enter Group Name</Text>
          <TextInput
            placeholder="Type Group Name..."
            placeholderTextColor="gray"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.input, { borderColor: global.isDarkMode ? "#8c8c93" : "gray", color: global.appFontColor }]}
            value={this.state.email}
            onChangeText={email => this.setState({ email })}
          />
          <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor: global.isDarkMode ? "#2b2b39" : "#77c995", borderColor: global.isDarkMode ? "#40404c" : "#77c995" }]}
            onPress={this.createTeam.bind(this)}
          >
            <Text style={styles.buttonText}>Create Group</Text>
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
  },
  avatarConatiner: {
    flexDirection: "row",
    backgroundColor: "#2b2b39",
    elevation: 5,
    borderRadius: 10,
    borderWidth: 0.5,
    marginBottom: 5,
    width: "100%",
    height: 65,
    borderColor: "#7f7f88",
    padding: 5,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  cameraCover: {
    height: 60,
    width: 60,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 30
  },
  avatarOverlay: {
    width: "100%",
    height: 200,
    position: "absolute",
    top: 0,
    left: 0,
    // backgroundColor:"rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  },
  avatarUser: {
    height: 50,
    width: 70,
    borderRadius: 5,
    elevation: 5
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
  input: {
    height: 40,
    marginBottom: 10,
    // backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: "white",
    borderRadius: 10
  },
  buttonContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 10,
    elevation: 5
  },
  buttonText: {
    textAlign: "center",
    color: "#FFF",
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
  },
  createTeamContainer: {
    width: "90%",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#40404c",
    elevation: 5
  }
});
