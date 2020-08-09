import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  // ListView,
  Image,
  Button,
  FlatList,
  AsyncStorage,
  Dimensions
} from "react-native";

import firebase from "react-native-firebase";
import Spinner from "react-native-loading-spinner-overlay";
import { SearchBar } from 'react-native-elements';
import Chat from "./Chat";
// import Voice from "react-native-voice";

let { width, height } = Dimensions.get("screen");

var name, uid, email;
var av_url = "hello";
export default class FriendsList extends Component {

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
      loading: true,
      isDarkMode: null,
      appBgColor: null,
      appFontColor: null,
      appHeaderBgColor: null
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

    this.state = {
      loading: true
    };

    this.friendsRef = this.getRef().child("friends");

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
        if (child.val().email != user.email) {
          items.push({
            name: child.val().name,
            uid: child.val().uid,
            email: child.val().email,
            avt: child.val().avatar,
          });
        }

      });

      this.setState({
        dataSource: items,
        dataBackup: items,
        loading: false
      });

      // alert(this.state.dataSource);
    });
  }

  getLastMessage(current_user, friend) {
    var chatId = this.generateChatId(current_user, friend);
    var chatRef = this.getRef().child("chat/" + chatId);
    var snap = "old";
    var chatRefData = chatRef.orderByKey().limitToLast(1).on("child_added",
      (snapshot) => {
        snap = snapshot.val().text;
        // alert(snap);
      }
    );
    // alert(snap);
  }

  getRef() {
    return firebase.database().ref();
  }

  generateChatId(current_user, friend) {
    if (current_user > friend) return `${current_user}-${friend}`;
    else return `${friend}-${current_user}`;
  }

  componentDidMount() {
    this.setState({
      mounted: true
    });
    this.listenForItems(this.friendsRef);
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

  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#2b2b39",
      elevation: null
    },
    headerTitleStyle: {
      color: "white"
    },
    header: null
  };

  setSearchText(event) {
    var searchText = event.nativeEvent.text;
    this.setState({
      query: searchText
    })
    if (searchText == "") {
      var fullData = this.state.dataBackup;
      // alert(fullData);
      this.setState({
        dataSource: fullData
      });
    }
    else {
      var data = this.state.dataBackup;
      searchText = searchText.toLowerCase();
      // alert(searchText);
      data = data.filter(l =>
        l.name.toLowerCase().match(searchText)
      );
      // alert(JSON.stringify(data));
      this.setState({
        dataSource: data
      })
    }
  }

  renderRow = rowData => {
    alert(rowData);
    return (
      <TouchableOpacity
        onPress={() => {
          name = "saurabh"
          email = "saurabh@gmail.com"
          uid = "Yp4EpnNRIsOrCmyxvlzydyvnwuO2"
          this.props.navigation.setParams({
            name: name,
            email: email,
            uid: uid
          });
        }}
      >
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://www.gravatar.com/avatar/"
            }}
            style={styles.profileImage}
          />
          <Text style={[styles.profileName, { color: this.state.appFontColor }]}>{rowData.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  FlatListItemSeparator = () => {
    return (
      <View style={{ height: 1.2, width: "100%", backgroundColor: this.state.isDarkMode ? "#40404c" : "#e5e5e5" }}>

      </View>
    );
  }

  renderItems = (item, index ) => {
    return (
      <View style={{ marginRight: 10, marginLeft: 10, marginBottom: 3, backgroundColor: this.state.isDarkMode ? "#40404c" : "#fff" }}>
        <TouchableOpacity
          onPress={() => {
            // name = rowData.name;
            // email = rowData.email;
            // uid = rowData.uid;
            name = item.name;
            email = item.email;
            uid = item.uid;
            this.props.navigation.navigate("chats", {
              name: name,
              email: email,
              uid: uid,
              avatar: item.avt
            });
          }}
        >
          <View style={[styles.profileContainer, { backgroundColor: this.state.isDarkMode ? "#2b2b39" : "#fff" }]}>
            <Image
              source={{ uri: item.avt }}
              style={styles.profileImage}
            />
            <Text style={[styles.profileName, { color: this.state.appFontColor }]}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.state.isDarkMode ? "#2b2b39" : "#fff" }]}>
        <View style={{ height: 50,elevation:10, width: "100%", backgroundColor: global.appTopTabBarBgColor }}>

        </View>
        <View style={{ marginBottom: 10 }}>
          {
            this.state.isDarkMode ?
              <SearchBar
                onChange={this.setSearchText.bind(this)}
                placeholder='Type Here ...'
                value={this.state.query}
              />
              :
              <SearchBar
                lightTheme
                onChange={this.setSearchText.bind(this)}
                placeholder='Type Here ...'
                value={this.state.query}
              />
          }
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          renderRow={this.renderRow}
          data={this.state.dataSource}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({item,index}) => this.renderItems(item,index)}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
        />
        <Spinner visible={this.state.loading} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: height-80,
    // alignItems: "stretch",
    // marginRight: 10,
    // marginLeft: 10
  },
  rightButton: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 10,
    padding: 0
  },
  topGroup: {
    flexDirection: "row",
    margin: 10
  },
  myFriends: {
    flex: 1,
    color: "#3A5BB1",
    //tintColor: "#fff",
    //secondaryColor: '#E9E9E9',
    //grayColor: '#A5A5A5',
    fontSize: 16,
    padding: 5
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 8,
    // marginLeft: 6,
    // marginBottom: 6,
    paddingLeft: 8,
    height: 65
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 0,
    marginRight: 7
  },
  profileName: {
    marginLeft: 6,
    fontSize: 16
  }
});
