import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    TouchableHighlight,
    ScrollView,
    Image,
    StatusBar,
    ImageBackground,
    Dimensions,
    AsyncStorage,
    Share,
    TextInput
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from "react-native-vector-icons/Ionicons";
import { SearchBar } from 'react-native-elements';
import Geolocation from "@react-native-community/geolocation";
import LinearGradient from 'react-native-linear-gradient';
import Recent from "./Recent";
import Utils from "./GetUser";
import firebase from "react-native-firebase";
import SendStatus from './SendStatus';
import Status from "./Status";

let { width, height } = Dimensions.get("screen");

class ProductData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDarkMode: null,
            appBgColor: null,
            appFontColor: null,
            appHeaderBgColor: null,
            likesCount: this.props.item.likes,
            liked: false,
            ModalVisible: false
        };

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
        };
        this.incidentRef = this.getRef().child("Incidents");
        this.likesRef = this.getRef().child("PostLikes");
    }

    getRef() {
        return firebase.database().ref();
    }

    feedSelector = (feed, index) => {
        this.props.navigation.navigate('book', { 'data': feed, 'likes': this.state.likesCount });
    }

    feedSelectorComment = (feed, index) => {
        this.props.navigation.navigate('book', { 'data': feed, 'likes': this.state.likesCount, 'comment_enabled': true });
    }

    whatsAppShare = () => {
        var message = "test message";
        var shareOptions = {
            title: "Incident",
            message: this.props.item.book_name + "\n" + this.props.item.description + "\n" + this.props.item.img_url,
            // message: video.content + " " + "http://freehitnews.com?link=" + video.media_uri,
            url: this.props.item.img_url,
            subject: this.props.item.img_url, //  for email
        };
        Share.share(Object.assign(shareOptions, {
            "social": "whatsapp"
        }));
    };

    componentDidMount = () => {
        console.log("component mounted....................................");
        var user = firebase.auth().currentUser;
        this.getRef().child("PostLikes/" + this.props.item.id).on("value", snap => {
            var len = Object.keys(snap._childKeys).length;
            console.log("length===========", len);
            this.setState({
                likesCount: len
            });
            var i = 0;
            for (i = 0; i < len; i++) {
                if (user.uid == snap._childKeys[i]) {
                    this.setState({
                        liked: true
                    });
                    break;
                }
                else {
                    this.setState({
                        liked: false
                    });
                }
            }
            console.log("liked or not --------------- " + this.state.liked);

        });
        AsyncStorage.getItem("isDarkModeEnabled")
            .then((value) => {
                if (value == "true") {
                    this.setState({
                        isDarkMode: true,
                        appBgColor: "#2b2b39",
                        appHeaderBgColor: "#2b2b39",
                        appFontColor: "#fff"
                    });
                    theme = "pink";
                }
                else {
                    this.setState({
                        isDarkMode: false,
                        appBgColor: "#fff",
                        appHeaderBgColor: "#ff5b77",
                        appFontColor: "#000"
                    });
                }
            });
    }

    unlike = () => {
        console.log("unline........................");
        var user = firebase.auth().currentUser;
        this.likesRef.child(this.props.item.id + '/' + user.uid).remove();
        this.setState({
            liked: false
        })
    }

    like = () => {
        var user = firebase.auth().currentUser;
        this.likesRef.child(this.props.item.id + '/' + user.uid).set(
            true
        );

        this.getRef().child("PostLikes/" + this.props.item.id).on("value", snap => {
            this.setState({
                likesCount: Object.keys(snap._childKeys).length
            });
        });
    }

    render() {
        return (
            <View>
                <TouchableWithoutFeedback
                    onPress={() => this.feedSelector(this.props.item, this.props.index)}>
                        <View
                    style={[styles.Product, { backgroundColor: this.state.isDarkMode ? "#40404c" : "#e5e5e5" }]}>
                    <View
                        borderRadius={10}
                    >
                        <ImageBackground
                            source={{ uri: this.props.item.img_url }}
                            style={styles.cardImage}
                        >
                            <LinearGradient
                                colors={['#cc000000', '#000000']}
                                style={styles.linearGradientBottom}
                            >
                                <View style={styles.cardData}>
                                    <View style={styles.cardLogo}>
                                        <Image
                                            source={{ uri: this.props.item.src_avt }}
                                            style={styles.profileImage}
                                        />
                                    </View>
                                    <View style={styles.cardDetails}>
                                        <Text style={styles.ProductName} numberOfLines={1}>
                                            {this.props.item.book_name}
                                        </Text>
                                        <Text style={styles.sellerName} numberOfLines={1}>
                                            {this.props.item.description}
                                        </Text>
                                        <Text style={styles.sellerName}>
                                            {this.props.item.datetime}
                                        </Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </ImageBackground>
                    </View>
                    <View style={[styles.option, { backgroundColor: this.state.appBgColor }]}>
                        <TouchableOpacity
                            style={[styles.opt, { borderRightWidth: 0.5, borderColor: "gray" }]}
                            onPress={() => this.state.liked ? this.unlike() : this.like()}>
                            <Text style={{ fontSize: 19, color: global.appFontColor }}>
                                {this.state.likesCount}  <Icon2 name="ios-heart" size={19} color={this.state.liked ? "#ff5b77" : this.state.appFontColor} />
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.opt, { borderRightWidth: 0.5, borderColor: "gray" }]}
                            onPress={() => this.feedSelectorComment(this.props.item, this.props.index)}>
                            <Icon name="comment" size={22} color={this.state.appFontColor} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.opt}
                            onPress={this.whatsAppShare}>
                            <Icon name="share" size={22} color={this.state.appFontColor} />
                        </TouchableOpacity>
                    </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

export default class ProductComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: "",
            latitude: 0,
            longitude: 0,
            location: '',
            isDarkMode: null,
            appBgColor: null,
            appFontColor: null,
            appHeaderBgColor: null,
            isDisplayedSearch: false,
            ModalVisible: false
        }
        Utils.getUserDetails();
    }

    getLocation = async (latitude, longitude) => {
        var data = await fetch("https://api.opencagedata.com/geocode/v1/json?q=" + latitude + "+" + longitude + "&key=5c0bf3a094c742fe99bd791d7e8eaf71");
        var dataObj = await data.json();
        this.setState({ location: dataObj.results[0].components });
    }

    displayLocation = () => {
        alert(this.state.latitude + "  " + this.state.longitude);
    }

    componentDidMount() {
        Utils.getUserDetails();
        Geolocation.getCurrentPosition(position => {
            this.getLocation(position.coords.latitude, position.coords.longitude)
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
        AsyncStorage.getItem("isDarkModeEnabled")
            .then((value) => {
                if (value == "true") {
                    this.setState({
                        isDarkMode: true,
                        appBgColor: "#40404c",
                        appHeaderBgColor: "#2b2b39",
                        appFontColor: "#fff"
                    });
                    theme = "pink";
                }
                else {
                    this.setState({
                        isDarkMode: false,
                        appBgColor: "#fff",
                        appHeaderBgColor: "#ff5b77",
                        appFontColor: "#000"
                    });
                }
            });
    }

    sendAlert = () => {
        var loc = this.state.location;
        var location = loc.neighbourhood + ' , ' + loc.city + ' , ' + loc.postcode;
        this.props.navigation.navigate('SendAlert', { 'location': location });
    }

    sendIncident = () => {
        this.props.navigation.navigate('SendIncident');
    }

    showSearch = () => {
        this.props.navigation.navigate("SearchScreen");
    }

    showModal = () => {
        this.props.navigation.navigate("ChatbotUi");
    }

    showEmergencyList = () => {
        this.props.navigation.navigate('EmergencyList');
    }

    render() {
        return (
            <View style={[styles.container, { backgroundColor: this.state.appBgColor }]}>
                <StatusBar barStyle="light-content" backgroundColor={this.state.appHeaderBgColor} />
                <View style={[styles.header, { backgroundColor: this.state.appHeaderBgColor }]}>
                    <Text style={[styles.headerText, { overflow: "hidden" }]}>
                        <Icon name="notifications" size={20} /> WOAK
                    </Text>
                    <View style={{ marginRight: 15, flexDirection: "row", paddingTop: 5 }}>
                        
                        <TouchableOpacity style={{ marginRight: 15 }} onPress={() => this.showSearch()}>
                            <Icon name="search" color="#fff" size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginRight: 15 }} onPress={() => this.showModal()}>
                            <Icon name="chat" color="#fff" size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.showEmergencyList()}>
                            <Icon name="contacts" color="#fff" size={25} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.action2} onPress={this.sendIncident}>
                    <Text style={styles.post}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.action} onPress={this.sendAlert}>
                    <Image style={styles.actionlogo} source={{ uri: "https://firebasestorage.googleapis.com/v0/b/book-store-56297.appspot.com/o/logo%2Ficon.png?alt=media&token=c7f92169-f597-408e-af31-774eda3ee0b1" }} />
                </TouchableOpacity>

                <ScrollView>
                    <SendStatus/>
                    <Status/>
                    <View style={{ backgroundColor: "#2b2b39" }}>
                        <FlatList
                            numColumns={1}
                            showsVerticalScrollIndicator={false}
                            maxToRenderPerBatch={1}
                            initialNumToRender={1}
                            data={this.props.data}
                            renderItem={({ item, index }) => {
                                return (
                                    <ProductData
                                        location={this.state.location}
                                        navigation={this.props.navigation}
                                        data={this.props.data}
                                        item={item}
                                        index={index}>

                                    </ProductData>
                                );
                            }}
                        />
                    </View>
                </ScrollView>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        height: height - 80,
        // backgroundColor: "#40404c",
        backgroundColor: "#e5e5e5"
    },
    Product: {
        height: 300,
        width: "100%",
        // backgroundColor: "#40404c",
        // backgroundColor: theme

    },
    linearGradientBottom: {
        width: "100%",
        height: 73,
        // marginTop: iHeight - 300,
        // marginBottom:0,
        bottom: 0,
        padding: 5,
        position: "absolute"
    },
    ProductName: {
        color: "white",
        textAlign: "left",
        alignContent: "center",
        alignItems: "center"
    },
    sellerName: {
        color: "#e5e5e5",
        textAlign: "left",
    },
    cardImage: {
        height: 240
    },
    cardDetails: {
        // marginBottom : 10,
        width: "80%"
    },
    option: {
        flexDirection: "row",
        width: "100%",
        borderTopWidth: 0.5,
        // borderBottomWidth : 0.5,
        borderColor: "gray",
        height: 45,
        elevation: 5,
        // marginBottom : 10
    },
    opt: {
        width: "33.33%",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"
    },
    cardData: {
        flexDirection: "row"
    },
    cardLogo: {

    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        // marginLeft: 0,
        marginRight: 7,
        borderWidth: 0.5,
        borderColor: "#fff"
    },
    action: {
        backgroundColor: "red",
        position: "absolute",
        right: 25,
        bottom: 35,
        height: 55,
        width: 55,
        zIndex: 999,
        borderRadius: 27.5,
        elevation: 10,
    },
    actionlogo: {
        height: 55,
        width: 55,
    },
    action2: {
        backgroundColor: "#ff5b77",
        position: "absolute",
        right: 25,
        bottom: 115,
        height: 55,
        width: 55,
        zIndex: 999,
        borderRadius: 27.5,
        elevation: 10,
        alignContent: "center",
        alignItems: "center"
    },
    post: {
        fontSize: 40,
        color: "white",
        fontWeight: "bold",
    },

    header: {
        height: 60,
        width: "100%",
        paddingLeft: 15,
        justifyContent: "space-between",
        alignItems: "center",
        // elevation: 10,
        backgroundColor: "#ff5b77",
        // paddingTop: 8,
        flexDirection: "row",
        elevation: 10
    },
    headerText: {
        fontSize: 25,
        color: "#fff"
    }
})