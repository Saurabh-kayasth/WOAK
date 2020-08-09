import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar
} from "react-native";
import AllTeamsComponent from "../../components/AllTeamsComponent";

import firebase from "react-native-firebase";
import Footer from "../../components/Footer";
class Teams extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groups: null
        }

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

        this.groupRef = this.getRef().child("GroupDetails");
    }

    getRef() {
        return firebase.database().ref();
    }

    getGroups() {
        this.groupRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {
                items.push({
                    name: child.val().name,
                    id: child.val()._id,
                    member: child.val().members,
                    avatar: child.val().avatar
                });
            });
            this.setState({
                groups: items
            });
        });
       
    }

    componentDidMount() {
        this.getGroups();
    }

    render() {

        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor={global.appHeaderBgColor} />
                <AllTeamsComponent 
                    navigation={this.props.navigation}
                    data = {this.state.groups} />
                <Footer/>
            </View>
        );
    }
}

export default Teams;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1
    }
});