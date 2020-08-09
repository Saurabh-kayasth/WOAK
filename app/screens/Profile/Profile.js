import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    StatusBar
} from "react-native";
import Boiler from "../../components/Boiler";
import MainScreenNavigator from "../../components/Profile";
import Footer from "../../components/Footer";
class Profile extends Component {
    static navigationOptions = {
    headerStyle: {
      backgroundColor: "#16a085",
      elevation: null
    },
    header: null
  };
    render() {

        return (
            <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#191922" />
            
                <MainScreenNavigator></MainScreenNavigator>
                <Footer/>
            </View>
        );
    }
}

export default Profile;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1
    }
});