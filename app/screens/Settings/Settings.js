import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar
} from "react-native";
// import Header from "../../components/Header";
import SettingComponent from "../../components/SettingComponent";
import Footer from "../../components/Footer";
class Settings extends Component {

    constructor(props)
    {
        super(props);
    }
    render() {

        return (
            <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#191922" />   
            <SettingComponent navigation={this.props.navigation}/>  
                <Footer/>
             </View>
        );
    }
}

export default Settings;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1
    }
});