import React, { Component } from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width , height } = Dimensions.get("window");

class NoInternet extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <View style={styles.container}>
                <Icon name="ios-cloud" size = {80} color="#000"/>
                <Text style={styles.error}>No Internet Connection!!</Text>
            </View>
        )
    }
}

const styles  = StyleSheet.create({
    container : {
        // flex : 1,
        height : height,
        backgroundColor : "#e5e5e5",
        alignContent : "center",
        alignItems : "center",
        justifyContent : "center"
    },
    error : {
        fontSize : 20,
        color : "#000",
        fontFamily : "Roboto"
    }
});

export default NoInternet;