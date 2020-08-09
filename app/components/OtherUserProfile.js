import React, { Component } from 'react';
import {
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    StatusBar,
    FlatList,
    Image,
    View,
    Text,
} from 'react-native';
import {Card} from "react-native-elements";
import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: []
        };
        this.friendRef = this.getRef().child("friends");
    }

    getRef() {
        return firebase.database().ref();
    }

    componentDidMount() {
        this.setState({
            uid: this.props.route.navigation.state.params.uid
        });
        this.listenForUsers(this.friendRef);
    }

    listenForUsers = (friendRef) => {

        friendRef.on("value", snap => {
            snap.forEach(child => {
                if (child.val().uid == this.state.uid) {
                    this.setState({
                        userData: child.val()
                    })
                }
            });
        });
    }

    displayData = (field, icon, value) => {
        return (
            <View>
                <View style={[styles.name, { backgroundColor: global.isDarkMode ? "#40404c" : "#fff" }]}>
                    <View style={styles.iconContainer}>
                        <Icon name={icon} size={25} color="#fff" />
                    </View>
                    <View style={styles.nameText}>
                        <View>
                            <Text style={{ fontSize: 13, color: "gray" }}>{field}</Text>
                            <Text style={{ fontSize: 18, color: global.appFontColor }}>{value}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: global.isDarkMode ? "gray" : "#e5e5e5", height: 1 }}></View>
            </View>
        )
    }

    openChat = (item) => {
        this.props.route.navigation.navigate("Chat",{
            name: this.state.userData.name,
            email: this.state.userData.email,
            uid: this.state.userData.uid,
            avatar: this.state.userData.avatar,
            fromSearch : true
          });
    }

    render() {
        return (
            <View>
                {this.displayData("Name", "ios-person", this.state.userData.name)}
                {this.displayData("Email", "ios-mail", this.state.userData.email)}
                {this.displayData("Address", "ios-locate", this.state.userData.address)}
                {this.displayData("Contact", "ios-call", this.state.userData.contact)}
                <TouchableOpacity 
                    style={[styles.chatButton, { backgroundColor: global.isDarkMode ? "#2b2b39" : "#fff" }]}
                    onPress = {() => this.openChat(this.state.userData)}>
                    <Text style={{ fontSize: 20, color: global.appFontColor }}><Icon2 name="chat" size={16} />  Chat</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class Incident extends Component {
    constructor(props) {
        super(props);
        this.state = {
            incidentData: []
        };

        this.incidentRef = this.getRef().child("Incidents");
    }

    getRef() {
        return firebase.database().ref();
    }

    componentDidMount() {
        this.setState({
            uid: this.props.route.navigation.state.params.uid
        });
        this.listenForIncidents(this.incidentRef);
    }

    listenForIncidents(incidentRef) {
        incidentRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {
                if (child.val().uid == this.state.uid) {
                    items.push({
                        id: child.val()._id,
                        img_url: child.val().picture,
                        book_name: child.val().topic,
                        description: child.val().description,
                        uid: child.val().uid,
                        likes: child.val().likes,
                        comments: child.val().comments,
                        src_avt: child.val().src_avt,
                        datetime: child.val().datetime,
                    });
                }
            });
            this.setState({
                incidentData: items
            });
        });
    }

    viewFeed = (item) => {
        this.props.route.navigation.navigate("book", { 'data': item });
        // this.props.navigation.navigate("book", {'data':item});
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.incidentData}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableWithoutFeedback onPress={() => this.viewFeed(item)}>
                                <View style={[styles.feedContainer, { marginTop: index == 0 ? 10 : 0 }]}>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: item.img_url }}
                                    />
                                    <View style={styles.data}>
                                        <Text style={styles.title}>
                                            <Icon name="ios-cube" size={16} /> {item.book_name}
                                        </Text>
                                        <Text style={styles.des} numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                        <Text style={styles.datetime}>
                                            <Icon name="ios-clock" size={14} color="gray" /> {item.datetime}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    }}
                />
                {
                    this.state.incidentData.length == 0 ?
                        <View style={{justifyContent:"center",alignContent:"center",alignItems:"center",height:"100%"}}>
                            <Text style={{fontSize : 18}}>No Incidents!!</Text>
                        </View>
                        :
                        null
                }
            </View>
        )
    }
}

class Status extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusData: []
        };

        this.statusRef = this.getRef().child("status");
    }

    getRef() {
        return firebase.database().ref();
    }

    componentDidMount() {
        this.setState({
            uid: this.props.route.navigation.state.params.uid
        });
        this.listenForIncidents(this.statusRef);
    }

    listenForIncidents(statusRef) {
        statusRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {
                if (child.val().source_id == this.state.uid) {
                    var date =new Date(child.val().timestamp);
                    console.log(date.getMinutes());
                    var hours = date.getHours()-12;
                    items.push({
                        status : child.val().status,
                        datetime : date.getDate()+'-'+date.getMonth()+1+'-'+date.getFullYear()+'   '+hours+'-'+date.getMinutes()
                    });
                }
            });
            this.setState({
                statusData: items
            });
        });
    }

    render() {
        return (
            <View>
                <FlatList
                    data = {this.state.statusData}
                    renderItem = {({item,index}) => {
                        return (
                            <Card
                                containerStyle={{padding : 0,backgroundColor:"#fff",elevation:3,borderRadius:10,overflow:"hidden",marginBottom:5}}
                            >
                                <Text style={{margin:10,marginBottom:0,fontFamily:"Roboto"}}>{item.status}</Text>
                            <View style={{padding : 10}}>
                                <Text>
                                    <Icon name="ios-clock" size={16} color="gray"/>  {item.datetime}</Text>
                            </View>
                            </Card>
                        )
                    }}
                />
            </View>
        )
    }
}

class OtherUserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            uid: "",
            routes: [
                {
                    key: 'first',
                    title: 'About',
                    navigation: this.props.navigation,
                    uid: this.props.navigation.getParam("uid")
                },
                {
                    key: 'second',
                    title: 'Incidents',
                    navigation: this.props.navigation,
                    uid: this.props.navigation.getParam("uid")
                },
                {
                    key: 'third',
                    title: 'Status',
                    navigation: this.props.navigation,
                    uid: this.props.navigation.getParam("uid")
                },
            ],
        };

    }

    _renderTabBar = props => (
        <TabBar
            {...props}
            scrollEnabled
            navigation={this.props.navigation}
            tabStyle={[styles.tabStyle, { backgroundColor: global.appHeaderBgColor }]}
            inactiveColor="#e5e5e5"
            activeColor="#fff"
        />
    );

    render() {
        return (
            <View style={[styles.container, { backgroundColor: global.isDarkMode ? global.appBgColor : "#fff" }]}>
                <StatusBar barStyle="light-content" backgroundColor={global.appHeaderBgColor} />
                <View style={[styles.profileContainer, { backgroundColor: global.appHeaderBgColor }]}>
                    <View style={styles.profileShadow}>
                        <Image
                            style={styles.avatarStyle}
                            source={{ uri: this.props.navigation.getParam("avt") }}
                        />
                    </View>
                </View>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: Detail,
                        second: Incident,
                        third: Status,
                    })}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                    renderTabBar={this._renderTabBar}
                    animationEnabled={true}
                    swipeEnabled={true}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    profileContainer: {
        width: "100%",
        height: 300,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#fff",
        elevation: 0
    },
    avatarStyle: {
        height: 200,
        width: 200,
        borderRadius: 100
    },
    profileShadow: {
        height: 200,
        width: 200,
        borderRadius: 100,
        elevation: 20,
    },
    iconContainer: {
        marginRight: 15,
        width: 40,
        height: 40,
        backgroundColor: "gray",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20
    },
    name: {
        alignContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
        flexDirection: "row",
    },
    chatButton: {
        height: 45,
        width: "50%",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: "#fff",
        marginTop: 10,
        borderRadius: 10,
        elevation: 5,
        borderWidth: 0.1,
        borderColor: "#000"
    },
    tabStyle: {
        width: 131,
        backgroundColor: "#ff5b77",
    },
    feedContainer: {
        flexDirection: "row",
        height: 100,
        backgroundColor: "#fff",
        margin: 10,
        marginTop: 0,
        marginBottom: 10,
        elevation: 5,
        borderRadius: 5,
        overflow: "hidden",
    },
    image: {
        width: "40%"
    },
    data: {
        width: "60%",
        backgroundColor: "white",
        flexDirection: "column",
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        fontFamily: "Roboto",
        marginBottom: 2
    },
    des: {
        fontSize: 13,
        color: "#000",
        fontFamily: "Roboto",
        marginBottom: 2
    },
    datetime: {
        fontSize: 13,
        color: "#000",
        fontFamily: "Roboto"
    },
});

export default OtherUserProfile;