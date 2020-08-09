import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TouchableHighlight,
  // Button,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  AsyncStorage,
  ToastAndroid
} from 'react-native';
import { Button } from "react-native-elements";
// import LoginComponent from  "./LoginComponent";
import Icon from 'react-native-vector-icons/Ionicons';
// import ImagePicker from 'react-native-imagepicker';
import firebase from "react-native-firebase";
import FriendsList from "./Friendlist";
import MyProduct from "./MyProduct";
import Chat from "./GroupMessage";
import Chats from "./Chat";
import GloChat from "./GloChat";
import TeamComponent from "./teamComponent";
import CreateTeam from "./CreateTeam";
import Spinner from "react-native-loading-spinner-overlay";
import LinearGradient from 'react-native-linear-gradient';
import { Card } from "react-native-elements";
let Dimention = Dimensions.get('window');
let height = Dimention.height;
let width = Dimention.width;

const theme = "#fff";

export default class OtherTeamDetails extends Component {

  static navigationOptions = {
    // title : "Team",
    headerTransparent: true,
    headerTintColor: "#fff"
    // headerStyle: {
    //   position:"absolute",
    //   backgroundColor: "transparent",
    //   zIndex : 100,
    //   top : 0,
    //   left : 0,
    //   right : 0,
    //   elevation : 0,
    //   shadowOpacity : 0,
    //   borderBottomWidth : 0,
    // },
  };
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
      loading: true,
      members: [],
      isDarkMode: null,
      appBgColor: null,
      appFontColor: null,
      appHeaderBgColor: null
    }
    this.groupRef = this.getRef().child("friends");
  }

  getRef() {
    return firebase.database().ref();
  }

  listenForItems(friendsRef) {
    var user = firebase.auth().currentUser;

    friendsRef.on("value", snap => {
      // get children as an array
      var items = [];
      snap.forEach(child => {
        var members = this.props.navigation.state.params.member;
        for (var i = 0; i < members.length; i++) {
          if (child.val().uid == members[i]) {
            items.push({
              name: child.val().name,
              avt: child.val().avatar
            });
          }
        }

      });

      this.setState({
        loading: false
      });
      this.setState({
        members: items
      });
      // alert(this.state.members);
    });
  }

  

  componentDidMount() {
    AsyncStorage.getItem("isDarkModeEnabled")
      .then((value) => {
        if (value == "true") {
          this.setState({
            isDarkMode: true,
            appBgColor: "#2b2b39",
            appHeaderBgColor: "#2b2b39",
            appFontColor: "#fff"
          });
          theme = "pink";

        }
        else {
          this.setState({
            isDarkMode: false,
            appBgColor: "#fff",
            appHeaderBgColor: "#ff5b77",
            appFontColor: "#000"
          });
        }
      });
    this.listenForItems(this.groupRef);
  }

  FlatListItemSeparator = () => {
    return (
      <View style={{ height: 0.2, width: "100%", backgroundColor: "#40404c" }}>

      </View>
    );
  }

  directToDiscussion = ()=> {
    this.props.navigation.navigate('DiscussionComponent',{'g_id':this.props.navigation.state.params.uid});
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.state.isDarkMode ? "#40404c" : "#e5e5e5" }]}>
        <StatusBar barStyle="light-content" backgroundColor="#2b2b39" />

        <View style={styles.profileContainerLogo}>
          <View style={styles.profileShadow}>
            <ImageBackground
              // borderRadius={200 / 2}
              style={styles.profile}
              source={{ uri: this.props.navigation.state.params.avatar }}
            >
              <LinearGradient colors={['#2b2b39', '#cc000000']} style={{ height: 50, width: "100%" }}>

              </LinearGradient>
              <LinearGradient colors={['#cc000000', '#000000']} style={styles.linearGradientBottom}>
                <Text style={styles.description}>{this.props.navigation.state.params.name}</Text>
                <TouchableOpacity onPress = {()=>this.directToDiscussion()}>
                  <Text style={styles.description}>
                    <Icon name="ios-people" size={18}/>  Public Discussion</Text>
                </TouchableOpacity>
                {/* <Text style={styles.views}>81k Likes</Text> */}
              </LinearGradient>
            </ImageBackground>
          </View>
        </View>
        {/* <View style={[styles.addToCart, { backgroundColor: "transparent" }]}>

          <TouchableOpacity style={[styles.buttons, { backgroundColor: global.appOptionsBgColor, borderColor: global.isDarkMode ? "#7f7f88" : "rgba(0,0,0,0)" }]}
            onPress={() => {
              this.props.navigation.navigate("addMember", { "g_id": this.props.navigation.state.params.uid });
            }}
          >

            <Text style={[styles.buttonsText, { color: global.isDarkMode ? "#fff" : "#000" }]}>
              <Icon name="ios-person" size={18} />   Add Member</Text>

          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttons, { backgroundColor: global.appOptionsBgColor, borderColor: global.isDarkMode ? "#7f7f88" : "rgba(0,0,0,0)" }]}
            onPress={() => {
              this.props.navigation.navigate("Chat", {
                name: this.props.navigation.state.params.name,
                uid: this.props.navigation.state.params.uid,
              });
            }}
          >

            <Text style={[styles.buttonsText, { color: global.isDarkMode ? "#fff" : "#000" }]}>
              <Icon name="logo-whatsapp" size={18} />   Chat</Text>

          </TouchableOpacity>

        </View> */}

        <Card containerStyle={[styles.memberContainer, { backgroundColor: this.state.appBgColor }]}>
          <Text style={[styles.descriptionM, { color: this.state.appFontColor }]}>Members</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.members}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({ item, index }) => {
              return (
                <View style={{ marginRight: 0, marginLeft: 0, marginBottom: 0, backgroundColor: this.state.appBgColor }}>

                  <View style={styles.profileContainer}>
                    <Image
                      source={{ uri: item.avt }}
                      style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>{item.name}</Text>
                    {/* <Icon name="ios-trophy" size={25} color="gold" style={{ position: "absolute", right: 12 }} /> */}
                  </View>
                </View>
              );
            }}
          />
        </Card>
        <Spinner visible={this.state.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#2b2b39",
    // backgroundColor: theme
  },
  buttons: {
    width: "47%",
    height: 50,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#7f7f88",
    elevation: 5
  },
  buttonsText: {
    fontSize: 18,
    color: "#fff"
  },
  memberContainer: {
    backgroundColor: "#fff",
    paddingTop: 5,
    elevation: 5,
    borderWidth: 0.2,
    borderRadius: 10,
    padding: 5,
  },
  memberChat: {
    height: 50,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#2b2b39"
  },
  addToCart: {
    padding: 15,
    paddingBottom : 0,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
    // height: 60,
  },
  profileContainerLogo: {
    alignContent: "center",
    alignItems: "center",
    elevation: 20,
    height: 250,
  },
  profileShadow: {
    flex: 1,
    alignContent: "center",
    backgroundColor: "teal",
    alignItems: "center",
    height: 250,
    width: "100%",
  },
  profile: {
    height: 250,
    width: "100%",
  },
  linearGradientBottom: {
    width: "100%",
    height: 86,
    // marginTop: iHeight - 300,
    // marginBottom:0,
    bottom: 0,
    padding: 35,  //chenge to 15 if likes
    paddingLeft : 15, // remove if likes
    paddingBottom: 5,
    paddingRight : 15,
    position: "absolute",
    flexDirection:"row",
    justifyContent : "space-between"
  },
  description: {
    fontFamily: "Myriad Pro",
    fontSize: 18.3,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
    marginTop: 10
  },
  descriptionM: {
    fontFamily: "Myriad Pro",
    fontSize: 18.3,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    // color: "#ffffff",
    color: "#2b2b39",
    marginTop: 5,
    marginLeft: 8,
    marginBottom: 8
  },
  views: {
    fontFamily: "Myriad Pro",
    fontSize: 10,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff",
    marginTop: 5
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 8,
    marginBottom: 6,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginLeft: 0,
    marginRight: 0
  },
  profileName: {
    marginLeft: 8,
    fontSize: 16,
    color: "gray"
  },
})
