import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ListView,
  Image,
  Button,
  TextInput,
  StatusBar
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import firebase from "react-native-firebase";

var name, uid, email;
const theme = "#fff";
export default class Chat extends Component {
  // static navigationOptions = {
  //   title : "hello",
  //   headerStyle: {
  //     backgroundColor: "#2b2b39"
  //   },
  //   headerTintColor : "white",
  //   headerTitleStyle : {
  //     color : "white"
  //   }
  // };

  static navigationOptions = ({navigation}) => {
    return {
    title : navigation.getParam('name','chat'),
    headerStyle: {
          backgroundColor: theme
        },
        headerTintColor : "#2b2b39",
        headerTitleStyle : {
          color : "#2b2b39"
        },
        headerRight: (
          <Image
          style={{height:38,width:38,marginRight:9,borderWidth:0.5,borderColor : "white",borderRadius : 19}}
          source = {{uri: navigation.getParam('avatar','./avatar.png')}}
          />
        )
  }};

  constructor(props) {
    super(props);
    // alert(props.navigation.getParam('name'));
    this.state = {
      messages: []
    };
    if(!firebase.apps.length)
    {
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

    this.user = firebase.auth().currentUser;
    console.log("User:" + this.user.uid);
    
    const { params } = this.props.navigation.state;
    uid = params.uid;
    name = params.name;
    email = params.email;
    // alert(uid);


    this.chatRef = this.getRef().child("GroupMessage/" + uid);
    this.chatRefData = this.chatRef.orderByChild("order");
    this.onSend = this.onSend.bind(this);
  }

  //generate ChatId works cause when you are the user sending chat you take user.uid and your friend takes uid
  // when your friend is using the app to send message s/he takes user.uid and you take the uid cause you are the friend 

  generateChatId() {
    if (this.user.uid > uid) return `${this.user.uid}-${uid}`;
    else return `${uid}-${this.user.uid}`;
  }

  getRef() {
    return firebase.database().ref();
  }

  listenForItems(chatRef) {
    chatRef.on("value", snap => {
      // get children as an array
      var items = [];
      snap.forEach(child => {
        //var name = child.val().uid == this.user.uid ? this.user.name : name1;
        items.push({
          _id: child.val().createdAt,
          text: child.val().text,
          createdAt: new Date(child.val().createdAt),
          user: {
            _id: child.val().uid,
            avatar: null
          }
        });
      });

      this.setState({
        loading: false,
        messages: items
      });
    });
  }

  componentDidMount() {
    this.listenForItems(this.chatRefData);
  }

  componentWillUnmount() {
    this.chatRefData.off();
  }

  onSend(messages = []) {
    // this.setState({
    //     messages: GiftedChat.append(this.state.messages, messages),
    // });
    messages.forEach(message => {
      //var message = message[0];
      var now = new Date().getTime();
      this.chatRef.push({
        _id: now,
        text: message.text,
        createdAt: now,
        uid: this.user.uid,
        fuid: uid,
        order: -1 * now
      });
    });

    
  }
  render() {
    return (
      <View style={{flex:1,backgroundColor:global.appComponentBgColor,marginBottom:50}}>
      <StatusBar backgroundColor="#ff5b77"/>
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend.bind(this)}
        user={{
          _id: this.user.uid
        }}
        
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    marginRight: 10,
    marginLeft: 10
  }
});
