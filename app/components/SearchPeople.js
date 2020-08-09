import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Text,
  Modal,
  TouchableOpacity
} from "react-native";
// import Icon from "react-native-vector-icons";
import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class SearchPeople extends Component {
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
      appHeaderBgColor: null,
      modalVisible: false
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
      loading: true,
      modalVisible: false,
      avt: "",
      modalName: "",
      userId : "",
      userEmail : ""
    };

    this.friendsRef = this.getRef().child("friends");

  }

  getRef() {
    return firebase.database().ref();
  }

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

  showModal = (avt, name,uid,email) => {
    console.log("showmodal");
    if (this.state.modalVisible == true) {
      this.setState({
        modalVisible: false
      })
    }
    else {
      this.setState({
        modalVisible: true,
        avt: avt,
        modalName: name,
        userId : uid,
        userEmail : email
      })
    }
  }

  goToChat = () => {
    
    this.props.navigation.navigate("Chat",{
      name: this.state.modalName,
      email: this.state.userEmail,
      uid: this.state.userId,
      avatar: this.state.avt,
      fromSearch : true
    });

    this.setState({
      modalVisible : false
    })
  }

  goToProfile = () => {
    this.props.navigation.navigate("OtherUserProfile",{
      uid : this.state.userId,
      avt : this.state.avt
    });
    this.setState({
      modalVisible : false
    })
  }

  componentDidMount() {
    this.listenForItems(this.friendsRef);
  }

  render() {
    return (
      <View style={[styles.scene, { backgroundColor: global.appBgColor }]} >

        <Modal
          visible={this.state.modalVisible}
          animationType="fade"
          onRequestClose={() => this.showModal()}
          transparent
        >
          <View style={styles.modalImage}>

            <View style={{ height: 340, width: 300, backgroundColor: "#fff" }}>

              <Image
                style={{ height: 300, width: 300 }}
                source={{ uri: this.state.avt }}
              />
              <View style={{ width: "100%",padding : 10, height: 40, zIndex: 999, backgroundColor: "rgba(0,0,0,0.7)", position: "absolute", top: 0, left: 0 }}>
                <Text style={{fontSize : 16,color:"#fff"}}>{this.state.modalName}</Text>
              </View>
              <View style={{ 
                  backgroundColor : global.isDarkMode ? "#2b2b39":"#fff",
                  width: 300, 
                  flexDirection: "row",
                  borderTopWidth:0.5,
                  borderTopColor:"#333333" 
                  }}>
                <TouchableOpacity 
                  style={[styles.modalButton, { borderRightWidth: 1.4, borderRightColor: "#e5e5e5" }]}
                  onPress = {() => this.goToProfile()}>
                  <Text style={{fontSize : 16,color:"#000"}}>
                    <Icon name="info" size={20} color={global.appFontColor}/>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress = {() => this.goToChat()}>
                  <Text style={{fontSize : 16,color:"#000"}}>
                    <Icon name="chat" size={20} color={global.appFontColor}/>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <TextInput
          placeholder="Enter Text Here"
          placeholderTextColor="gray"
          style={[styles.input,{backgroundColor : global.isDarkMode ? "#2b2b39":"#fff",color:global.appFontColor}]}
          onChange={this.setSearchText.bind(this)}
          value={this.state.query}
        />
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item, index }) => {
            return (
              <View style={[styles.feedContainer, { backgroundColor:global.isDarkMode?"#2b2b39":"#fff",marginTop: index == 0 ? 10 : 0 }]}>

                <TouchableOpacity 
                  onPress={() => this.showModal(item.avt, item.name,item.uid,item.email)} 
                  style={[styles.image, { width: 60 }]}>
                  <Image
                    style={styles.image}
                    source={{ uri: item.avt }}
                  />
                </TouchableOpacity>
                <View style={[styles.data,{backgroundColor:global.isDarkMode?"#2b2b39":"#fff"}]}>
                  <Text style={[styles.title,{color:global.appFontColor}]}>{item.name}</Text>
                  {/* <Text style={styles.des} numberOfLines={2}>Description........</Text>  */}
                  <Text style={[styles.datetime,{color:global.appFontColor}]}>{item.email}</Text>
                </View>
              </View>
            )
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1
  },
  input: {
    borderColor: "#e5e5e5",
    borderWidth: 0.5,
    elevation: 5,
    margin: 10,
    borderRadius: 5,
    padding: 8,
    paddingLeft: 10,
    backgroundColor: "#fff"
  },
  modalImage: {
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  modalButton: {
    width: 150,
    height: 40,
    // backgroundColor: "#fff",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  feedContainer: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    margin: 10,
    marginTop: 0,
    marginBottom: 10,
    elevation: 5,
    borderRadius: 5,
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30
  },
  image: {
    width: "100%",
    height: 60,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30
  },
  data: {
    width: "60%",
    backgroundColor: "white",
    flexDirection: "column",
    padding: 10
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Roboto"
  },
  des: {
    fontSize: 13,
    color: "#000",
    fontFamily: "Roboto"
  },
  datetime: {
    fontSize: 13,
    color: "#000",
    fontFamily: "Roboto"
  },
})