import React from 'react';
import { 
  Image, 
  Button, 
  View, 
  Text, 
  NetInfo, 
  AsyncStorage, 
  StatusBar,
  TouchableOpacity
} from 'react-native';
import Chatbot from './Chatbot.js';
// import { Icon } from 'react-native-elements';
import Icon from "react-native-vector-icons/Ionicons";
class ChatbotUi extends React.Component {
  constructor(props) {
    super(props);
    this.clearChat = this.clearChat.bind(this);
  }

  clearChat() {
    AsyncStorage.clear();

  }

  render() {
    console.disableYellowBox = true;
    return (
      <View style={{ flex: 1 ,backgroundColor:"#2b2b39"}}>
        <StatusBar barStyle="light-content" backgroundColor={global.appHeaderBgColor}/>
        <View style={{width:"100%",height : 55,backgroundColor:global.appHeaderBgColor,flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingLeft: 15,paddingRight:15}}>
          <View style={{flexDirection:"row",alignItems:"center"}}>
             <Icon name="ios-notifications" size={30} color = "#fff"/>
            <Text style={{fontSize : 20,color : "#fff"}}>  WoakApp</Text>
          </View>
          <TouchableOpacity style={{flexDirection:"row",alignItems:"center"}} onPress={() => { this.clearChat(); this.props.navigation.goBack(); }}>
            <Text style={{fontSize : 14,color : "#fff"}}>Clear Chat  </Text>
            <Icon name="md-chatboxes" size={18} color = "#fff" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 6, backgroundColor: '#e5e5e5' }} >
          <Chatbot navigation={this.props.navigation} />
        </View> 
      </View>

    );
  }
}

export default ChatbotUi;