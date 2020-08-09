import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  AsyncStorage,
  Dimensions
} from "react-native";

import firebase from "react-native-firebase";
import Spinner from "react-native-loading-spinner-overlay";
import { SearchBar, Card } from 'react-native-elements';
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";

const {width,height} =Dimensions.get("window");
export default class TeamComponent extends Component {

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
      groups: [],
      group_details: [],
      isDarkMode: null,
      appBgColor: null,
      appFontColor: null,
      appHeaderBgColor: null
    };

    this.getGroupDetails = this.getGroupDetails.bind(this);
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
      loading: true
    };

    this.friendsRef = this.getRef().child("friends");
    this.groupRef = this.getRef().child("GroupDetails");

  }

  getRef() {
    return firebase.database().ref();
  }

  listenForItems(friendsRef) {
    var user = firebase.auth().currentUser;

    friendsRef.on("value", snap => {
      var items = [];
      snap.forEach(child => {
        if (child.val().email == user.email) {
          items.push({
            name: child.val().name,
            uid: child.val().uid,
            email: child.val().email,
            avt: child.val().avatar,
            group: child.val().groups
          });
        }

      });

      this.setState({
        dataSource: items,
        dataBackup: items,
        loading: false
      });
      var groups = [];
      for (var i = 0; i < this.state.dataSource[0].group.length; i++) {
        groups.push(this.state.dataSource[0].group[i]);
      }
      this.setState({
        groups: groups
      });
      this.getGroupDetails(this.state.groups);
    });
  }

  getGroupDetails(groups) {
    this.groupRef.on("value", snap => {
      var items = [];
      snap.forEach(child => {
        for (var i = 0; i < groups.length; i++) {
          if (child.val()._id == groups[i]) {
            items.push({
              name: child.val().name,
              id: child.val()._id,
              member: child.val().members,
              avatar: child.val().avatar
            });
          }
        }
      });
      this.setState({
        group_details: items
      });
    });
  }

  createTeam() {
    this.props.navigation.navigate("createTeam");
  }

  getRef() {
    return firebase.database().ref();
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
    searchText = event.nativeEvent.text;
    this.setState({
      query: searchText
    })
    if (searchText == "") {
      fullData = this.state.dataBackup;
      this.setState({
        dataSource: fullData
      });
    }
    else {
      data = this.state.dataSource;
      searchText = searchText.toLowerCase();
      data = data.filter(l =>
        l.name.toLowerCase().match(searchText)
      );
      this.setState({
        dataSource: data
      });

    }
  }

  FlatListItemSeparator = () => {
    return (
      <View style={{ height: 1.2, width: "100%", backgroundColor: "#e5e5e5", backgroundColor: this.state.isDarkMode ? "gray" : "#e5e5e5" }}>

      </View>
    );
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: global.appBgColor }]}>
        <View style={{ height: 50, elevation: 10, width: "100%", backgroundColor: global.appTopTabBarBgColor }}>

        </View>
        <TouchableOpacity style={[styles.addProduct, { backgroundColor: this.state.isDarkMode ? "#2b2b39" : "#fff" }]} onPress={this.createTeam}>
          <Text style={[styles.addStyle2, { color: this.state.appFontColor }]}>Create Group</Text>
          <Text style={[styles.addStyle, { color: this.state.appFontColor }]}> +</Text>
        </TouchableOpacity>

        <FlatList
          numColumns={2}
          showsVerticalScrollIndicator={false}
          data={this.state.group_details}
          renderItem={({ item, index }) => {
            return (
              <Card containerStyle={styles.cardContainer}>
                <ImageBackground
                  source={{ uri: item.avatar }}
                  style={styles.profileImage}
                >
                  <LinearGradient
                    colors={['#cc000000', '#000']}
                    style={styles.cardBody}>
                    <View>
                      <Text style={[styles.viewText, { color: "#fff" }]}>{item.name}</Text>
                      {/* <Text style={styles.likeText}><Icon name="favorite" color="#ff5b77" /> 11k</Text> */}
                    </View>
                  </LinearGradient>
                </ImageBackground>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.viewChat,{backgroundColor : global.appOptionsBgColor,borderRightWidth:0.4,borderRightColor : "gray"}]}
                    onPress={() => {
                      var name = item.name;
                      var email = item.email;
                      var uid = item.id;
                      this.props.navigation.navigate("teamInfo", {
                        name: name,
                        email: email,
                        uid: uid,
                        member: item.member,
                        avatar: item.avatar
                      });
                    }}
                  >
                    <Text style={[styles.viewChatText,{color:global.appFontColor}]}>
                      <Icon name="details" /> View
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.viewChat,{backgroundColor : global.appOptionsBgColor,}]}
                    onPress={() => {
                      this.props.navigation.navigate("Chat", {
                        name: item.name,
                        uid: item.id,
                      });
                    }}>
                    <Text style={[styles.viewChatText,{color:global.appFontColor}]}>
                      <Icon name="chat" /> Chat
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          }}
        />
        <Spinner visible={this.state.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height : height,
    alignItems: "stretch",
  },
  profileImage: {
    width: "100%",
    height: 160,
  },
  profileName: {
    marginLeft: 6,
    fontSize: 16
  },
  addProduct: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom : 10,
    height: 50,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderRadius: 25,
    elevation: 5,
    alignSelf: "center"
  },
  addStyle: {
    color: "#2b2b39",
    fontSize: 32,
    fontWeight: "bold",
  },
  addStyle2: {
    color: "#2b2b39",
    fontSize: 22,
    fontWeight: "bold",
  },
  cardContainer: {
    width: "44.5%",
    height: 200,
    elevation: 5,
    borderWidth: 0.2,
    padding: 0,
    borderRadius: 5,
    overflow: "hidden",
    marginRight : 0,
    marginBottom : 2
  },
  viewText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Roboto"
  },
  cardBody: {
    width: "100%",
    height: 70,
    padding: 10, //change to 5 if likes
    paddingTop: 4,
    paddingBottom: 4,
    position: "absolute",
    bottom: 0,
    justifyContent: "flex-end"
  },
  likeText: {
    fontSize: 12,
    color: "#e5e5e5",
    fontFamily: "Roboto"
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    height: 40
  },
  viewChat: {
    width: "50%",
    backgroundColor: "#77c995",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  viewChatText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Roboto"
  }
});
