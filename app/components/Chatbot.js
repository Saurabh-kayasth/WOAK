import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import React from 'react';
import {
  View,
  AsyncStorage,
  Alert,
} from 'react-native';
class Chatbot extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };

    this.onSend = this.onSend.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.localStorage = this.localStorage.bind(this);
    this.capitalizeFirstLetter = this.capitalizeFirstLetter.bind(this);
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, func) => {
        var items = [];
        for (let i = 0; i < func.length; i++) {
          var value = func[i][1];
          var obj = JSON.parse(value);
         
          try{
            console.log(obj[0]._id);
            this.setState((previousState) => {
              return {
                messages: GiftedChat.append(previousState.messages, JSON.parse(value)),
              }
            }
            );
            
            // items.push(obj);
          }
          catch(err)
          {
            console.log("error ------------------------------------- "+err);
            break;
          }
        }
        // this.setState({
        //   messages : items
        // })
        console.log(this.state.messages);
      });
    });
  }

  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  onSend(messages = []) {
    this.answerDemo(messages);
    this.localStorage(messages);
    var text = this.capitalizeFirstLetter(messages[0].text);
    messages[0].text = text;
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }
  //1d62c052083542608c7d1ea23c5e2c76
  //fa6c46b3c7714886ba0400e5b98e09f1

  answerDemo(messages) {
    var query = messages[0].text;
    if (messages.length > 0) {
      fetch('https://api.dialogflow.com/v1/query?v=20150910&contexts=shop&lang=en&query=' + query + '&sessionId=12345&timezone=America/New_York', {
        method: 'GET',
        headers: new Headers({
          'Authorization': 'Bearer 1d62c052083542608c7d1ea23c5e2c76',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }),
      }).then((response) => response.json())
        .then((responseJson) => {
          this.handleResponse(responseJson);
        })
        .catch((error) => {
          return (
            Alert.alert(

              // This is Alert Dialog Title
              'CONNECTION PROBLEM',

              // This is Alert Dialog Message. 
              'You are offline' + error,
              [
                // First Text Button in Alert Dialog.
                { text: 'START CHATTING', onPress: () => this.props.navigation.navigate('Home') }
              ]
            )
          );
        });
    }
  }

  handleResponse(res) {
    console.log(res.result.fulfillment.speech);
    var speech = this.capitalizeFirstLetter(res.result.fulfillment.speech);
    var obj = [{
      "text": speech, "user": {
        "_id": 2, "name": 'Robo',
        "avatar": null,
      }, "createdAt": new Date(), "_id": Math.round(Math.random() * 1000000)
    }];
    this.localStorage(obj);

    // Tts.getInitStatus().then(() => {
    //   Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact');
    //   Tts.setDefaultLanguage('en-IE');
    //   Tts.setDucking(true);
    //   Tts.speak(res.result["speech"]);
    // });

    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, obj),
      };
    });
  }

  localStorage(data) {
    AsyncStorage.setItem(JSON.stringify(new Date().getTime()), JSON.stringify(data));
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: global.isDarkMode ? "#e5e5e5":"#fff",
            elevation: 1
          },
          right: {
            backgroundColor: global.isDarkMode ? "#2b2b39":"#ff5b77",
            elevation: 1
          }
        }}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: global.appBgColor }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          user={{
            "_id": 1// sent messages should have same user._id
          }}
          renderBubble={this.renderBubble}
        />
      </View>
    );
  }
}

export default Chatbot;