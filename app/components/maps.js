import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TouchableHighlight,
    ScrollView,
    Image,
    StatusBar
} from 'react-native';
import WebView from 'react-native-webview';

export default class Maps extends Component {

    static navigationOptions = {
        headerTransparent : true,
        headerTintColor : "#fff"
      };

    constructor(props) {
        super(props);
        this.state = {
            ready : true
        }
    }

    componentDidMount = () => {

    };
    
    render() {
        return (
            this.state.ready && 
            <View style = {{flex : 1}} >
                <StatusBar barStyle="light-content" backgroundColor="#4a89f3"/>
                <WebView
                    automaticallyAdjustContentInsets = {false}
                    source = {{uri : "https://www.google.com/maps/dir/'" + this.props.navigation.state.params.latitude + "," + this.props.navigation.state.params.longitude + "'/'" + this.props.navigation.state.params.object.latitude + "," + this.props.navigation.state.params.object.longitude + "'/"}}
                    javaScriptEnabled = {true}
                    domStorageEnabled = {true}
                    decelerationRate = "normal"
                    startInLodingState = {true}
                />
            </View>
        );
    }
}

// "https://www.google.com/maps/dir/'19.0386008,72.8248019'/'19.0386007,72.8248019'/"

// "https://www.google.com/maps/dir/'" + this.props.navigation.state.params.latitude + "," + this.props.navigation.state.params.longitude + "'/'" + this.props.navigation.state.params.object.latitude + "," + this.props.navigation.state.params.object.longitude + "'/"