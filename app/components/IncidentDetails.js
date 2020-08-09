import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    ScrollView,
    Image,
    Dimensions,
    ImageBackground,
    Button,
    Share,
    StatusBar,
    TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Book from '../screens/IncidentDetails/Incident';
import LinearGradient from 'react-native-linear-gradient';
import Utils from "./GetUser";
import firebase from "react-native-firebase";
import { FlatList } from 'react-native-gesture-handler';
import moment from "moment";
let Dimension = Dimensions.get('window');
let height = Dimension.height;
let width = Dimension.width;

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            uname: ""
        }
        this.friendsRef = this.getRef().child("friends");
    }

    getUserDetails = () => {
        this.friendsRef.on("value", snap => {
            var name = "";
            var avt = "";
            snap.forEach(child => {
                console.log("======================================" + this.props.item.uid);
                if (child.val().uid == this.props.item.uid) {
                    name = child.val().name,
                    avt = child.val().avatar
                }
            });
            this.setState({
                uname: name,
                avatar : avt
            });
            console.log("uname-------------" + this.state.uname);
        });
        console.log("uname-------------" + this.state.uname);
    }

    componentDidMount() {
        this.getUserDetails();
    }

    componentWillMount() {
        this.getUserDetails();
    }

    componentWillReceiveProps(){
        this.getUserDetails();
    }

    getRef() {
        return firebase.database().ref();
    }

    render() {
        return (
            <View style={styles.review}>
                <View style={{ width: "92%" }}>
                    <View style={styles.reviewPerson}>
                        <View style={styles.reviewPersonFirstContainer}>
                            <Text style={styles.reviewPersonFirstLetter}>{this.state.uname[0]}</Text>
                            
                             {/* <Image
                                style= {{height:20,width:20,borderRadius : 10}}
                                source = {{uri : this.state.avatar}}
                             /> */}
                        </View>
                            <Text style={styles.reviewName}>{this.state.uname}{'\n'}
                            <Text style={{fontSize : 10}}>{this.props.item.createdAt}</Text>
                            </Text>
                    </View>
                    <Text style={[styles.reviewText, { color: global.isDarkMode ? "lightgray" : "#000" }]}>
                        {this.props.item.comment}
                    </Text>
                </View>
                {/* <View style={{justifyContent:"center"}}>
                    <Icon name = "delete" size={25} color="red"/>
                </View> */}
            </View>
        )
    }
}

class Incident extends Component {

    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: "#fff"
    };
    constructor(props) {
        super(props);
        this.state = {
            isDescriptionEnabled: true,
            isCommentsEnabled: false,
            comments: null,
            likesCount: this.props.item.likes,
            liked: false,
            comment: null
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
        };
        this.incidentRef = this.getRef().child("Incidents");
        this.likesRef = this.getRef().child("PostLikes");
        this.commentRef = this.getRef().child("Comments");
    }

    displayDescription = () => {
        this.setState({
            isDescriptionEnabled: true,
            isCommentsEnabled: false
        });
    }

    getComments = () => {
        var user = firebase.auth().currentUser;
        this.getRef().child("Comments/" + this.props.item.data.id).on("value", snap => {
            var comments = [];
            snap.forEach(child => {
                comments.push({
                    comment: child.val().comment,
                    uid: child.val().uid,
                    createdAt: child.val().createdAt
                });
            });
            this.setState({
                comments: comments.reverse()
            });
            console.log(this.state.comments)
        });
    }

    displayComments = () => {
        this.setState({
            isDescriptionEnabled: false,
            isCommentsEnabled: true
        })
    }

    formatDate = (date) => {
        var monthNames = [
            "Jan","Feb","Mar","April","May","June","July","Aug","Sep","Oct","Nov","Dec"
        ];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }

    postComment = () => {
        var user = firebase.auth().currentUser;
        var key = this.commentRef.push().key;
        var now = this.formatDate(new Date());
        var now_time = moment()
        .utcOffset('+05:30')
        .format(' hh:mm a');
        this.commentRef.child(this.props.item.data.id + '/' + key).set({
            uid: user.uid,
            comment_id: key,
            comment: this.state.comment,
            createdAt: now+' '+now_time,
            order: -1 * now
        });
        this.setState({
            comment: ""
        });
    }

    componentDidMount = () => {
        this.getComments();
        console.log("comenerifnrnff.............dcdcdcdc",this.props.item.comment_enabled);
        if(this.props.item.comment_enabled)
        {
            this.setState({
                isCommentsEnabled : true,
                isDescriptionEnabled : false
            })
        }
        var user = firebase.auth().currentUser;
        this.getRef().child("PostLikes/" + this.props.item.data.id).on("value", snap => {
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
    }

    getRef() {
        return firebase.database().ref();
    }

    whatsAppShare = () => {
        var message = "test message";
        var shareOptions = {
            title: "Incident",
            message: this.props.item.data.book_name + "\n" + this.props.item.data.description + "\n" + this.props.item.data.img_url,
            // message: video.content + " " + "http://freehitnews.com?link=" + video.media_uri,
            url: this.props.item.data.img_url,
            subject: this.props.item.data.img_url, //  for email
        };
        Share.share(Object.assign(shareOptions, {
            "social": "whatsapp"
        }));
    };

    unlike = () => {
        console.log("unline........................");
        var user = firebase.auth().currentUser;
        this.likesRef.child(this.props.item.data.id + '/' + user.uid).remove();
        this.setState({
            liked: false
        })
    }

    like = () => {
        var user = firebase.auth().currentUser;
        this.likesRef.child(this.props.item.data.id + '/' + user.uid).set(
            true
        );

        this.getRef().child("PostLikes/" + this.props.item.data.id).on("value", snap => {
            this.setState({
                likesCount: Object.keys(snap._childKeys).length
            });
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" backgroundColor="#2b2b39" />
                <View style={styles.profileContainerLogo}>
                    <View style={styles.profileShadow}>
                        <ImageBackground
                            style={styles.profile}
                            source={{ uri: this.props.item.data.img_url }}
                        >
                            <LinearGradient colors={['#2b2b39', '#cc000000']} style={{ height: 50, width: "100%", position: "absolute", top: 0, left: 0 }}>

                            </LinearGradient>
                            <LinearGradient colors={['#cc000000', '#2b2b39']} style={styles.linearGradientBottom}>
                                <Text style={styles.description}>{this.props.item.data.book_name}</Text>
                                {/* <Text style={styles.views}><Icon2 name="ios-heart" size={12} color="#ff5b77" />  {this.state.likesCount}</Text> */}
                            </LinearGradient>
                        </ImageBackground>
                    </View>
                </View>

                <View style={{ width: "100%", height: 50, elevation: 10, backgroundColor: "#2b2b39", flexDirection: "row", borderWidth: 0.5, borderColor: "gray" }}>
                    <TouchableOpacity
                        onPress={() => this.displayDescription()}
                        style={{ width: "50%", borderBottomWidth: this.state.isDescriptionEnabled ? 2 : 0, borderBottomColor: "#fff", alignItems: "center", alignContent: "center", justifyContent: "center" }}>
                        <Text style={{ justifyContent: "center", alignContent: "center", alignItems: "center", fontSize: 18, color: this.state.isDescriptionEnabled ? "#fff" : "gray" }}>
                            <Icon name="details" size={12} backgroundColor={this.state.isDescriptionEnabled ? "#fff" : "gray"} />  Description</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.displayComments()}
                        style={{ width: "50%", borderBottomWidth: this.state.isCommentsEnabled ? 2 : 0, borderBottomColor: "#fff", alignItems: "center", alignContent: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 18, color: this.state.isCommentsEnabled ? "#fff" : "gray" }}>
                            <Icon name="comment" size={12} backgroundColor={this.state.isDescriptionEnabled ? "#fff" : "gray"} />  Comments</Text>
                    </TouchableOpacity>
                </View>

                {
                    this.state.isDescriptionEnabled ?
                        <View style={{ height: height - 270 }}>

                            <View style={[styles.descriptionD, { height: height - 270 - 45, backgroundColor: global.isDarkMode ? "#40404c" : "gray" }]}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text style={[styles.desHeading, { color: global.isDarkMode ? "lightgray" : "#fff" }]}>Description</Text>
                                    <Text style={[styles.desData, { color: global.isDarkMode ? "lightgray" : "#fff" }]}>
                                        {this.props.item.data.description}
                                    </Text>

                                    <View style={{ height: 0.02, backgroundColor: "white" }}></View>

                                    {/* <Text style={[styles.desHeading,{color:global.isDarkMode? "lightgray":"#fff"}]}>{"\n"}Location</Text>
                                    <Text style={[styles.desData,{color:global.isDarkMode? "lightgray":"#fff"}]}>
                                        {this.props.item.data.location}
                                    </Text> */}
                                </ScrollView>
                            </View>
                            <View style={styles.option}>
                                <TouchableOpacity style={styles.opt}>
                                    <Text
                                        style={{ color: "#fff", fontSize: 20 }}
                                        onPress={() => this.state.liked ? this.unlike() : this.like()}>
                                        {this.state.likesCount}  <Icon2 name="ios-heart" size={22} color={this.state.liked ? "#ff5b77" : "#fff"} />
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.opt} onPress={() => this.displayComments()}>
                                    <Icon name="comment" size={22} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.opt} onPress={this.whatsAppShare}>
                                    <Icon name="share" size={22} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View style={[styles.reviewContainer, { backgroundColor: global.isDarkMode ? "#40404c" : "#fff" }]}>
                            <View style={styles.sendCommentContainer}>

                                <View style={{ height: 40, width: 40, borderRadius: 20, elevation: 10, marginRight: 10 }}>
                                    <Image
                                        // source = {require('../Images/bg.png')}
                                        source={{ uri: global.userDetails[0].avt }}
                                        style={styles.userProfile}
                                    />
                                </View>
                                <TextInput
                                    multiline
                                    value={this.state.comment}
                                    placeholder="Leave your thoughts here..."
                                    onChangeText={comment => this.setState({ comment })}
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: global.isDarkMode ? "#40404c" : "#fff",
                                            borderColor: "lightgray",
                                            color: global.isDarkMode ? "lightgray" : "rgba(0,0,0,0.5)"
                                        }]}
                                    placeholderTextColor={global.isDarkMode ? "lightgray" : "rgba(0,0,0,0.5)"}
                                />
                                <TouchableOpacity style={styles.sendCommentBtn} onPress={() => this.postComment()}>
                                    <Text style={styles.sendCommentText}>POST</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.divider, { marginTop: 0, marginBottom: 5 }]}></View>
                            <Text style={[styles.reviewHeading, { color: global.isDarkMode ? "lightgray" : "#000" }]}>Comments</Text>
                            <FlatList
                                initialNumToRender={5}
                                maxToRenderPerBatch={1}
                                data={this.state.comments}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View>
                                            <Comment item={item} />
                                            <View style={styles.divider}></View>
                                        </View>
                                    )
                                }}
                            />
                        </View>
                }
            </View>
        );
    }
}

class IncidentDetails extends Component {
    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: "#fff",
        userProfile: null
    };

    componentDidMount() {
        var userData = Utils.getUserDetails();
        // console.log(global.userDetails[0].name)
        console.log("number of items" + JSON.stringify(this.props.videos));
    }
    render() {

        console.disableYellowBox = true;

        return (
            <View style={styles.container}>
                <LinearGradient colors={['#2b2b39', '#cc000000']} style={{ height: 50, width: "100%", position: "absolute", top: 0, left: 0 }}>

                </LinearGradient>
                <Incident item={this.props.videos} navigation={this.props.navigation}></Incident>
            </View>
        );
    }
}

export default IncidentDetails;

const styles = StyleSheet.create({
    userProfile: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        elevation: 5
    },
    sendCommentBtn: {
        width: "20%",
        height: 40,
        backgroundColor: "#77c995",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderColor: "#77c995",
        elevation: 5
    },
    sendCommentText: {
        fontSize: 16,
        fontFamily: "Roboto",
        color: "#fff"
    },
    input: {
        height: 40,
        width: "65%",
        backgroundColor: "#fff",
        color: "#000",
        borderWidth: 0.5,
        borderColor: "#77c995",
        borderRadius: 10,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        paddingLeft: 10
    },
    sendCommentContainer: {
        flexDirection: "row",
        width: "100%",
        marginTop: 5,
        marginBottom: 15
    },
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    details: {
        marginLeft: 20
    },
    bookName: {
        fontSize: 22,
        color: "white",
        fontWeight: "bold"
    },
    sellerName: {
        fontSize: 20,
        color: "white",
        marginTop: 5
    },
    icon: {
        marginRight: 10,
    },
    divider: {
        height: 0.3,
        backgroundColor: "gray"
    },
    descriptionD: {
        padding: 10,
        flex: 1,
        backgroundColor: "gray",
    },
    desHeading: {
        color: "#e5e5e5",
        fontSize: 15
    },
    desData: {
        fontSize: 17,
        color: "white",
        fontFamily: "Roboto"
    },
    review: {
        marginTop: 8,
        marginBottom: 8,
        flexDirection: "row"
    },
    reviewContainer: {
        padding: 10,
        margin: 0,
        height: height - 270
    },
    reviewHeading: {
        color: "#000",
        fontSize: 15
    },
    reviewPerson: {
        flexDirection: "row",
    },
    reviewPersonFirstContainer: {
        height: 30,
        width: 30,
        backgroundColor: "#77c995",
        padding: 3,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center"
    },
    reviewPersonFirstLetter: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold"
    },
    reviewNameRating: {
        marginLeft: 5
    },
    givenRating: {
        flexDirection: "row"
    },
    reviewName: {
        fontSize: 14,
        color: "gray",
        marginLeft: 7
    },
    reviewText: {
        color: "#000"
    },
    profileContainerLogo: {
        alignContent: "center",
        alignItems: "center",
        backgroundColor: "#2b2b39",
        height: 270,
    },
    profileShadow: {
        flex: 1,
        alignContent: "center",
        backgroundColor: "teal",
        alignItems: "center",
        height: 270,
        width: "100%",
    },
    profile: {
        height: 270,
        width: "100%",
    },
    linearGradientBottom: {
        width: "100%",
        height: 96,
        bottom: 0,
        padding: 15,
        position: "absolute",
        justifyContent: "flex-end"
    },
    description: {
        fontFamily: "Myriad Pro",
        fontSize: 18.3,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: "#ffffff",
        marginTop: 10
    },
    views: {
        fontFamily: "Myriad Pro",
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: "#ffffff",
        marginTop: 5,
    },
    option: {
        flexDirection: "row",
        borderColor: "gray",
        backgroundColor: "#rgba(0,0,0,0.7)",
        height: 45,
        marginTop: 0,
    },
    opt: {
        width: "33.33%",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        elevation: 10
    },
})