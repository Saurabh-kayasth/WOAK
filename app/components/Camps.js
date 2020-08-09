import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    Image
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import firebase from "react-native-firebase";

class Camps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            camps: []
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
        console.log(this.props.alertId);
        this.campRef = this.getRef().child("camps");
        this.getCamps(this.campRef);
    }

    getRef() {
        return firebase.database().ref();
    }

    getCamps(campRef) {
        this.campRef = this.getRef().child("camps/" + this.props.alertId);
        this.campRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {
                items.push({
                    camp_name: child.val().camp_name,
                    camp_picture: child.val().camp_picture,
                    camp_location: child.val().camp_location,
                    products : child.val().products
                })
            });
            this.setState({
                camps: items,
            });
        });
    }

    render() {
        return (
            <View style={styles.Container}>
                {
                    this.state.camps.length == 0 ?
                        <View style={styles.noCamp}>
                            <Text style={{ color: "#fff", fontSize: 16 }}>No Camps Available</Text>
                        </View>
                        :
                        null
                }
                <FlatList
                    data={this.state.camps}
                    renderItem={({ item, index }) => {
                        console.log(item.products);
                        return (
                            <View style={[styles.campContainer,{marginBottom : index==this.state.camps.length-1 ? 20:0}]}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: item.camp_picture }}
                                />
                                <View style={styles.dataContainer}>
                                    <Text style={{fontWeight : "bold",fontSize : 16,color : "#fff"}}>{item.camp_name}</Text>
                                    <Text style={{fontWeight : "normal",fontSize : 14,color : "#e5e5e5"}}>{item.camp_location}</Text>
                                    <Text style={{fontWeight : "normal",fontSize : 14,color : "#e5e5e5"}}>Products : {item.products}</Text>
                                </View>
                            </View>
                        )
                    }}
                />

            </View>
        )
    }
}

export default Camps;

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: "#333333"
    },
    noCamp: {
        width: "100%",
        marginTop: "70%",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center"
    },
    campContainer: {
        width: "90%",
        height: 130,
        backgroundColor: "#282828",
        borderRadius: 10,
        overflow: "hidden",
        elevation: 10,
        margin: 18,
        marginBottom : 0,
        flexDirection: "row"
    },
    image: {
        width: "50%",
        height: 130
    },
    dataContainer : {
        padding : 5,
        paddingLeft : 10,
        width : "50%"
    } 
});