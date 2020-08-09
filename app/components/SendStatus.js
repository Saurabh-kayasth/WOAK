import React, { Component } from 'react';

import {
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
    View,
    Text
} from 'react-native';
import firebase from "react-native-firebase";
import moment from 'moment';

class SendStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: ""
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

        this.statusRef = this.getRef().child("status");
    }

    getRef() {
        return firebase.database().ref();
    }

    formatDate = (date) => {
        var monthNames = [
            "Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }

    sendStatus = () => {
        var user = firebase.auth().currentUser;
        var key = this.statusRef.push().key;
        var now = Date.now();
        // var now_time = moment()
        //     .utcOffset('+05:30')
        //     .format(' hh:mm a');
            
        this.getRef()
            .child("status/" + key)
            .set({
                status_id: key,
                status: this.state.status,
                timestamp : now,
                source_id : user.uid
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={{ uri: global.userDetails[0].avt }} style={styles.imgStyle} />
                <TextInput
                    multiline
                    value={this.state.status}
                    onChangeText={status => this.setState({ status })}
                    placeholder="Type a Status..."
                    placeholderTextColor="gray"
                    style={styles.inputStyle}
                />
                <TouchableOpacity style={[styles.postBtn,{backgroundColor:appHeaderBgColor}]} onPress={()=> this.sendStatus()}>
                    <Text style={styles.postTxt}>Post</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default SendStatus;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 70,
        padding: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    imgStyle: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    inputStyle: {
        marginLeft: 5,
        marginRight: 5,
        width: "70%",
        height: 50,
        borderRadius: 10,
        borderWidth: 0.4,
        borderColor: "#2b2b39",
        padding: 10
    },
    postBtn: {
        backgroundColor: "#ff5b77",
        width: "17%",
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5
    },
    postTxt: {
        fontSize: 17,
        color: "#fff"
    }
});