
import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    Animated,
    TouchableHighlight,
    Share,
    AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from "react-native-firebase";
import Spinner from "react-native-loading-spinner-overlay";
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import Accordion from 'react-native-collapsible/Accordion';
const SECTIONS = [
    {
        title: 'Status',
        content: 'Lorem ipsum...',
    },
];
class CartData extends Component {

    constructor(props) {
        super(props);
        //alert(JSON.stringify(this.props.item));
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
            appHeaderBgColor: null
        }
        this.alertsRef = this.getRef().child("alerts");
    }

    getRef() {
        return firebase.database().ref();
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

    deleteAlert = (alertId) => {
        // alert(alertId);
        this.alertsRef.child(alertId).remove();
    }

    onTap = (item) => {
        alert(item.name + ' : ' + item.avt);
        var passObject = { "latitude": item.name, "longitude": item.avt };
        this.props.navigation.navigate('maps', { "latitude": this.state.latitude, "longitude": this.state.longitude, "object": passObject });
    };

    getLocation = async (latitude, longitude) => {
        var data = await fetch("https://api.opencagedata.com/geocode/v1/json?q=" + latitude + "+" + longitude + "&key=5c0bf3a094c742fe99bd791d7e8eaf71");
        var dataObj = await data.json();
        this.setState({ location: dataObj.results[0].components });
        // alert(JSON.stringify(dataObj.results[0].components));
        return dataObj.results[0].components.city;
    }

    render() {
        return (
            <View>

                <View style={[styles.cart, { backgroundColor: this.state.appBgColor }]}>
                    <View style={[styles.cartItem, { backgroundColor: this.state.appBgColor }]}>
                        <TouchableOpacity>
                            <View style={styles.itemPic}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: this.props.item.picture }}
                                />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.itemName}>
                            <TouchableOpacity>
                                <Text style={[styles.bookName, { color: this.state.appFontColor }]}>{this.props.item.type}</Text>
                                <Text style={styles.bookDescription}>{this.props.item.des}</Text>
                                <Text style={styles.bookDescription}>{this.props.item.location}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={[styles.remove, { backgroundColor: this.state.isDarkMode ? "#2b2b39" : "#fff" }]}>
                    <TouchableOpacity
                        style={{ width: "33.33%", borderRightWidth: 0.5, borderColor: "#2b2b39" }}
                        onPress={() => this.onTap(this.props.item)}
                    >
                        <Text style={styles.removeText}>
                            <Icon name="ios-locate" color="#7f7f7f" size={20} /> Locate
                            </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: "33.33%", borderRightWidth: 0.5, }} onPress={() => this.deleteAlert(this.props.item.alertId)}>
                        <Text style={styles.removeText}>
                            <Icon name="ios-trash" size={20} /> Delete
                            </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ width: "33.33%", borderColor: "#2b2b39" }}
                        onPress={this.whatsAppShare}
                    >
                        <Text style={styles.removeText}>
                            <Icon name="logo-whatsapp" size={20} /> Share
                            </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.divider, { backgroundColor: this.state.isDarkMode ? "#40404c" : "#e5e5e5" }]}></View>
            </View>
        );
    }
}

class Status extends Component {
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
        this.storiesRef = this.getRef().child("status");

    }

    getRef() {
        return firebase.database().ref();
    }

    deleteStory = (item) => {
        console.log(item.status_id);
        this.storiesRef.child(item.status_id).remove();
    }

    render() {
        return (
            <View style={{ margin: 3, elevation: 3, width: "100%", height: 50, padding: 10, paddingRight: 15, backgroundColor: "#fff", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text numberOfLines={2} style={{ width: "90%" }}>{this.props.item.status}</Text>
                <TouchableOpacity onPress={() => this.deleteStory(this.props.item)}>
                    <Icon name="ios-trash" size={25} color="red" />
                </TouchableOpacity>
            </View>
        )
    }
}

export default class MyProduct extends Component {

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
            status: [],
            tabCount: 0,
            latitude: 0,
            longitude: 0,
            isDarkMode: null,
            appBgColor: null,
            appFontColor: null,
            appHeaderBgColor: null,
            activeSections: [0],
            arrow: "ios-arrow-up"
        }
        this.alertsRef = this.getRef().child("alerts");
        this.statusRef = this.getRef().child("status");
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

    getStatus(statusRef) {
        var user = firebase.auth().currentUser;

        statusRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {
                if (child.val().source_id == user.uid) {
                    items.push({
                        status: child.val().status,
                        status_id: child.val().status_id
                    });
                }

            });
            this.setState({
                loading: false,
                status: items
            })
            console.log(this.state.status);
        });
    }

    getAlerts(alertsRef) {

        var user = firebase.auth().currentUser;

        alertsRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {
                this.getLocation(child.val().latitude, child.val().longitude);
                if (child.val().uid == user.uid) {
                    items.push({
                        name: child.val().latitude,
                        avt: child.val().longitude,
                        des: child.val().calamDes,
                        type: child.val().calamType,
                        picture: child.val().picture,
                        location: child.val().location,
                        alertId: child.val().alertId
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
        this.getAlerts(this.alertsRef);
        this.getStatus(this.statusRef);
    }

    _renderHeader = section => {
        return (
            <View style={{ padding: 10, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                <Text style={{ fontSize: 16, color: "#fff" }}>Status</Text>
                <Icon name={this.state.arrow} size={20} color="#fff" />
            </View>
        );
    };

    _renderContent = section => {
        return (
            <View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.status}
                    renderItem={({ item, index }) => {
                        return (
                            <Status item={item} />
                        );
                    }}
                />
            </View>
        );
    };

    _updateSections = activeSections => {
        if (this.state.arrow == "ios-arrow-up") {
            this.setState({
                arrow: "ios-arrow-down"
            })
        }
        else {
            this.setState({
                arrow: "ios-arrow-up"
            })
        }
        this.setState({ activeSections });
    };

    render() {

        return (
            <View style={[styles.container, { backgroundColor: global.appBgColor }]}>
                <View style={{ height: 50, elevation: 10, width: "100%", backgroundColor: global.appTopTabBarBgColor }}>

                </View>
                <View>
                    <Accordion
                        sections={SECTIONS}
                        activeSections={this.state.activeSections}
                        // renderSectionTitle={this._renderSectionTitle}
                        renderHeader={this._renderHeader}
                        renderContent={this._renderContent}
                        onChange={this._updateSections}
                    />
                </View>
                <View style={{ padding: 10, backgroundColor: "rgba(0,0,0,0.5)", marginTop: 10 }}>
                    <Text style={{ fontSize: 16, color: "#fff" }}>Alerts</Text>
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
        borderColor: "#e5e5e5",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: "white",
        elevation: 5,
        padding: 15,
        flexDirection: "row"
    },
    removeText: {
        color: "#7f7f7f",
        fontSize: 20,
        textAlign: "center"

    },
    addProduct: {
        // position : "absolute",
        // bottom : 15,
        // right : 15,
        flexDirection: "row",
        // marginTop : 5,
        height: 50,
        width: "100%",
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        // borderRadius : 25,
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
    }
})
//export default Header;