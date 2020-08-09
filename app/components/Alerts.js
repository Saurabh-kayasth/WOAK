import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    Modal,
    Dimensions,
    Share,
    AsyncStorage,
    StatusBar
} from 'react-native';
import SetupCamp from "./SetupCamp";
import Camps from "./Camps";
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from "react-native-firebase";
import Spinner from "react-native-loading-spinner-overlay";
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import Header from "./Header";

let { width, height } = Dimensions.get("window");

class CartData extends Component {
    static navigationOptions = {
        title: "Alerts",
        headerTransparent: true,
        headerTintColor: "#fff"
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            members: [],
            alerts: [],
            tabCount: 0,
            latitude: 0,
            longitude: 0,
            isDarkMode: null,
            appBgColor: null,
            appFontColor: null,
            appHeaderBgColor: null,
            modalVisible: false,
            campModalVisible : false
        }
    }
    componentDidMount() {
        Geolocation.getCurrentPosition(position => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                loading: false
            });
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

    whatsAppShare = () => {
        var message = "test message";
        var shareOptions = {
            title: "Incident",
            message: this.props.item.picture +
                '\nIncident : ' + this.props.item.type +
                "\nDescription : " + this.props.item.des +
                "\nLocation : " + this.props.item.location,
            // "\nDistance : "+'https://api.opencagedata.com/geocode/v1/json?q=' + this.state.latitude + "+" + this.state.longitude + '&key=5c0bf3a094c742fe99bd791d7e8eaf71',
            // message: video.content + " " + "http://freehitnews.com?link=" + video.media_uri,
            url: this.props.item.picture,
            subject: this.props.item.picture, //  for email
        };
        Share.share(
            Object.assign(shareOptions, {
                "social": "whatsapp"
            }
        ));
    };

    onTap = (item) => {
        var passObject = { "latitude": item.name, "longitude": item.avt };
        this.props.navigation.navigate('Maps', { "latitude": this.state.latitude, "longitude": this.state.longitude, "object": passObject });
    };

    getLocation = async (latitude, longitude) => {
        var data = await fetch("https://api.opencagedata.com/geocode/v1/json?q=" + latitude + "+" + longitude + "&key=5c0bf3a094c742fe99bd791d7e8eaf71");
        var dataObj = await data.json();
        this.setState({ location: dataObj.results[0].components });
        return dataObj.results[0].components.city;
    }

    openModal = () => {
        this.setState({
            modalVisible: true,
            headerBg: "#000"
        });
    }

    closeModal = () => {
        this.setState({
            modalVisible: false,
            headerBg: "#ff5b77"
        });
    }

    openCampModal = () => {
        this.setState({
            campModalVisible: true,
            headerBg: "#000"
        });
    }

    closeCampModal = () => {
        this.setState({
            campModalVisible: false,
            headerBg: "#ff5b77"
        });
    }

    render() {
        return (
            <View style={{ backgroundColor: this.state.appOptionsBgColor }}>
                <StatusBar backgroundColor={this.state.headerBg} />
                <Modal
                    visible={this.state.campModalVisible}
                    animationType="slide"
                >
                    <View style={styles.headerModal}>
                        <Text style={styles.headerTextModal}>
                            <Icon name="ios-home" size={20} color="#fff" />  Camps</Text>
                    </View>
                    <View style={styles.arrowContainer}>
                        <TouchableOpacity style={styles.arrow} onPress={this.closeCampModal}>
                            <Icon name="ios-arrow-down" size={30} color="#ff5b77" />
                        </TouchableOpacity>
                    </View>
                    <Camps alertId={this.props.item.alertId}/>
                </Modal>
                <Modal
                    visible={this.state.modalVisible}
                    animationType="slide"
                >
                    <View style={styles.headerModal}>
                        <Text style={styles.headerTextModal}>
                            <Icon name="ios-home" size={20} color="#fff" />  Setup Camp</Text>
                    </View>
                    <View style={styles.arrowContainer}>
                        <TouchableOpacity style={styles.arrow} onPress={this.closeModal}>
                            <Icon name="ios-arrow-down" size={30} color="#ff5b77" />
                        </TouchableOpacity>
                    </View>
                    <SetupCamp alertId={this.props.item.alertId} />
                </Modal>
                <View style={[styles.cart, { backgroundColor: global.appOptionsBgColor }]}>
                    <View style={styles.cartItem}>
                        <View>
                            <View style={styles.itemPic}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: this.props.item.picture }}
                                />
                            </View>
                        </View>

                        <View style={styles.itemName}>
                            <View>
                                <Text style={[styles.bookName, { color: this.state.appFontColor }]}>{this.props.item.type}</Text>
                                <Text style={styles.bookDescription}>{this.props.item.des}</Text>
                                <Text style={styles.bookDescription}>{this.props.item.location}</Text>
                            </View>
                            <TouchableOpacity 
                                onPress = {() => this.openCampModal()}
                                style={{width : 100,backgroundColor : global.isDarkMode ? "#40404c":"#ff5b77",padding : 3,marginTop:8,borderRadius : 10,paddingLeft:8}}>
                                <Text style={{color : "#fff",fontWeight : "bold"}}>View Camps</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={[styles.remove, { backgroundColor: this.state.appBgColor }]}>
                    <TouchableOpacity
                        style={{ width: "33.33%", borderRightWidth: 0.5, borderColor: "#2b2b39" }}
                        onPress={() => this.onTap(this.props.item)}
                    >
                        <Text style={[styles.removeText, { color: this.state.appFontColor }]}>
                            <Icon name="ios-locate" color={this.state.appFontColor} size={17} />  Location
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ width: "33.33%", borderRightWidth: 0.5, borderColor: "#2b2b39" }}
                        onPress={this.whatsAppShare}>
                        <Text style={[styles.removeText, { color: this.state.appFontColor }]}>
                            <Icon name="logo-whatsapp" color={this.state.appFontColor} size={17} />  Share
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: "33.33%" }} onPress={this.openModal}>
                        <Text style={[styles.removeText, { color: this.state.appFontColor }]}>
                            <Icon name="ios-home" color={this.state.appFontColor} size={17} />  Set Camp
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.divider, { backgroundColor: this.state.isDarkMode ? "#40404c" : "#e5e5e5" }]}></View>
            </View>
        );
    }
}

export default class Alerts extends Component {


    static navigationOptions = {
        title: "Alerts"
    }

    constructor(props) {
        super(props);
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

        this.state = {
            loading: true,
            members: [],
            alerts: [],
            tabCount: 0,
            latitude: 0,
            longitude: 0,
            isDarkMode: null,
            appBgColor: null,
            appFontColor: null,
            appHeaderBgColor: null,
            headerBg: "#ff5b77"
        }
        this.alertsRef = this.getRef().child("alerts");
    }

    getRef() {
        return firebase.database().ref();
    }

    getLocation = async (latitude, longitude) => {
        var data = await fetch("https://api.opencagedata.com/geocode/v1/json?q=" + latitude + "+" + longitude + "&key=5c0bf3a094c742fe99bd791d7e8eaf71");
        var dataObj = await data.json();
        this.setState({ location: dataObj.results[0].components });
        // alert(JSON.stringify(dataObj.results[0].components));
    }

    getAlerts(alertsRef) {
        var user = firebase.auth().currentUser;
        alertsRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {
                this.getLocation(child.val().latitude, child.val().longitude);

                if (child.val().uid != user.uid) {
                    items.push({
                        alertId: child.val().alertId,
                        name: child.val().latitude,
                        avt: child.val().longitude,
                        des: child.val().calamDes,
                        type: child.val().calamType,
                        picture: child.val().picture,
                        location: child.val().location
                    });
                }

            });
            this.setState({
                loading: false,
                alerts: items
            })

            //   alert(this.state.alerts);
        });

    }

    componentDidMount() {
        Geolocation.getCurrentPosition(position => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                loading: false
            });
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
        this.getAlerts(this.alertsRef);
    }

    render() {

        return (
            <View style={[styles.container, { backgroundColor: global.appBgColor }]}>
                {/* <StatusBar backgroundColor={this.state.headerBg}/> */}
                <View style={[styles.header, { backgroundColor: this.state.appHeaderBgColor }]}>
                    <Text style={styles.headerText}>
                        <Icon name="ios-notifications" size={25} />  Alerts
                </Text>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.alerts}
                    renderItem={({ item, index }) => {
                        return (
                            <CartData item={item} index={index} navigation={this.props.navigation}>

                            </CartData>
                        );
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    address: {
        backgroundColor: "white",
        elevation: 5,
        padding: 15
    },
    addressText: {
        fontSize: 17,
        fontWeight: "bold",
        color: "black"
    },
    divider: {
        height: 15,
        backgroundColor: "#f2f2f2"
    },
    cart: {
        backgroundColor: "white",
        padding: 15,
    },
    cartItem: {
        flexDirection: "row"
    },
    itemPic: {
        width: 160,
        height: 100,
        backgroundColor: "#2b2b39",
        elevation: 5
    },
    image: {
        width: 160,
        height: 100
    },
    itemName: {
        paddingLeft: 15
    },
    bookName: {
        fontSize: 20,
        color: "black"
    },
    bookDescription: {
        color: "#7f7f7f",
        fontSize: 14
    },
    remove: {
        borderWidth: 0.5,
        borderColor: "gray",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: "white",
        elevation: 5,
        padding: 15,
        flexDirection: "row",
        borderRightWidth: 0,
        borderLeftWidth: 0
    },
    removeText: {
        color: "#7f7f7f",
        fontSize: 17,
        textAlign: "center"

    },
    addProduct: {
        flexDirection: "row",
        height: 50,
        width: "100%",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        elevation: 25,
        alignSelf: "center"
    },
    addStyle: {
        color: "#2b2b39",
        fontSize: 32,
        fontWeight: "bold",
    },
    addStyle2: {
        color: "#2b2b39",
        fontSize: 22,
        fontWeight: "bold",
    },
    header: {
        height: 60,
        width: "100%",
        paddingLeft: 15,
        justifyContent: "center",
        elevation: 10,
        backgroundColor: "#ff5b77"
    },
    headerText: {
        fontSize: 25,
        color: "#fff"
    },
    headerModal: {
        width: "100%",
        height: 60,
        backgroundColor: "#000",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        zIndex: 19999
    },
    headerTextModal: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        zIndex: 100
    },
    arrow: {
        backgroundColor: "#000",
        width: 50,
        height: 50,
        justifyContent: "flex-end",
        alignContent: "center",
        alignItems: "center",
        borderRadius: 25,
        position: "absolute",
        top: -25,
        zIndex: -999
    },
    arrowContainer: {
        width: "100%",
        height: 50,
        backgroundColor: "#333333",
        alignItems: "center"
    }
});
