import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar
} from "react-native";
// import Header from "../../components/Header";
import Alerts from "../../components/Alerts";
import Footer from "../../components/Footer";
class Alert extends Component {

    constructor(props)
    {
        super(props);
    }
    render() {

        return (
            <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={global.appHeaderBgColor} />   
            <Alerts navigation={this.props.navigation}/>  
               <Footer/>
             </View>
        );
    }
}

export default Alert;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1
    }
});