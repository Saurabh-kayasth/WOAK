import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    TouchableHighlight,
    Button,
    Dimensions,
    StatusBar,
    FlatList,
    TextInput,
    AsyncStorage
} from 'react-native';
// import LoginComponent from  "./LoginComponent";
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import Icon from 'react-native-vector-icons/Ionicons';
// import ImagePicker from 'react-native-imagepicker';
import firebase from "react-native-firebase";
import FriendsList from "./Friendlist";
import MyProduct from "./MyProduct";
import Chat from "./GroupMessage";
import Chats from "./Chat";
import GloChat from "./GloChat";
import TeamComponent from "./teamComponent";
import DiscussionComponent from "./DiscussionComponent";
import CreateTeam from "./CreateTeam";
import TeamInfo from "./TeamInfo";
import AddMember from "./AddMember";
import Maps from "./maps";
import Login from "./Login";
import Spinner from "react-native-loading-spinner-overlay";
import ImagePicker from "react-native-image-picker";
import LinearGradient from 'react-native-linear-gradient';
let Dimention = Dimensions.get('window');
let height = Dimention.height;
let width = Dimention.width;

const theme = "#fff";

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.showDetails = this.showDetails.bind(this);

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
            aboutColor: "orange",
            productColor: "black",
            current_user: [],
            loading: true,
            userdata: {},
            isEditable: false,
            username: null,
            useremail: null,
            usercontact: null,
            useraddress: null,
            userprofile: null,
            userprofilepush: null,
            user_profile: null,
            isChanginProfile: false,
            isDarkMode: null,
            appBgColor: null,
            appFontColor: null,
            appHeaderBgColor: null,
            todayDate : null
        };

        this.friendsRef = this.getRef().child("friends");

    }

    editProfile = () => {
        if (this.state.isEditable == true) {
            this.setState({
                isEditable: false
            });
        }
        else {
            this.setState({
                isEditable: true
            });
        }
    }

    listenForItems(friendsRef) {
        var user = firebase.auth().currentUser;
        // alert(user);

        friendsRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {
                if (child.val().email == user.email) {
                    items.push({
                        name: child.val().name,
                        uid: child.val().uid,
                        email: child.val().email,
                        avt: child.val().avatar,
                        address: child.val().address,
                        contact: child.val().contact
                    });
                    this.setState({
                        username: child.val().name,
                        usercontact: child.val().contact,
                        useraddress: child.val().address,
                        userprofile: child.val().avatar,
                    });
                }

            });

            this.setState({
                current_user: items,
                loading: false
            });
        });
    }

    getRef() {
        return firebase.database().ref();
    }

    componentDidMount() {
        // alert(this.state.loading);
        this.listenForItems(this.friendsRef);
       
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

    componentDidUpdate(){

        // alert(global.isDarkMode);
        if(global.isDarkMode)
        {
            global.appTopTabBarBgColor = "#2b2b39";
            
        }
        else {
            global.appTopTabBarBgColor = "#ff5b77";

        }
    }

    LogOut = () => {
        const navi = this.props.navigation;
        firebase.auth().signOut().then(function () {
            navi.navigate('login');
        }, function (error) {
            console.log(error.message);
        });
    }

    pickImage = () => {
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            // alert(JSON.stringify(response));

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.path.toString() };
                const displaySource = { uri: response.uri }
                // alert(displaySource);ns
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    userprofilepush: source,
                    userprofile: displaySource.uri,
                    isChanginProfile: true
                });
                //alert(JSON.stringify(this.state.avatarSource));
                // this.uploadImage(this.state.avatarSource);
            }
        });
    }

    updateProfile = async => {
        this.setState({
            loading: true
        })
        if (this.state.isChanginProfile) {
            try {
                const ref = firebase
                    .storage()
                    .ref('avatar')
                    .child(this.state.useremail);
                const task = ref.putFile(this.state.userprofilepush.uri);

                return new Promise((resolve, reject) => {
                    task.on('state_changed',
                        (snapshot) => {
                            // alert("progress");
                        },
                        (error) => {
                            //alert("founderror");
                        },
                        () => {
                            this.setState({
                                loading: true
                            })
                            ref.getDownloadURL().then(url => {
                                this.setState({
                                    user_profile: url,
                                    loading: true
                                });

                                var user = firebase.auth().currentUser;

                                this.friendsRef.child(user.uid).update({
                                    name: this.state.username,
                                    avatar: this.state.user_profile,
                                    address: this.state.useraddress,
                                    contact: this.state.usercontact
                                });

                            });
                            this.setState({
                                loading: false,
                                isEditable: false,
                                isChanginProfile:false
                            })
                        }
                    );

                });
            } catch (err) {
                alert('uploadImage try/catch error: ' + err.message);
            }
        }
        else {
            var user = firebase.auth().currentUser;

            this.friendsRef.child(user.uid).update({
                name: this.state.username,
                address: this.state.useraddress,
                contact: this.state.usercontact
            });

            this.setState({
                loading: false,
                isEditable: false,
                isChanginProfile:false
            })
        }
    }

    showDetails() {
        alert(JSON.stringify(this.state.current_user[0].avt));
    }

    render() {


        if (this.state.current_user[0] != undefined) {
            return (
                <View style={[styles.container,{backgroundColor:this.state.isDarkMode ? "#40404c":"#fff"}]}>
                    <StatusBar barStyle="light-content" backgroundColor={this.state.appHeaderBgColor} />
                    <View style={{height:50,width:"100%",backgroundColor:global.appTopTabBarBgColor}}>

                    </View>
                    {/* <View style={[styles.profileContainer,{backgroundColor:this.state.isDarkMode ? "#2b2b39":"#ff5b77"}]}> */}
                        <LinearGradient 
                        locations={[0.8,3,0.6]}
                        colors={!this.state.isDarkMode? ['#ff5b77','#b23f53']:['#2b2b39','#191922']} style={styles.profileContainer}>
                        <View style={styles.profileShadow}>

                            <ImageBackground
                                borderRadius={200 / 2}
                                style={styles.profile}
                                source={{ uri: this.state.userprofile }}
                            >
                            </ImageBackground>
                            {
                                this.state.isEditable ?
                                    <View style={styles.photoOverlay}>
                                        <TouchableOpacity onPress={() => this.pickImage()}>
                                            <Icon name="ios-camera" size={50} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    null

                            }


                        </View>
                        <TouchableOpacity style={styles.edit} onPress={() => { this.LogOut() }}>
                            <Text style={styles.editText}><Icon name="md-log-out" color="#fff" size={25} /></Text>
                        </TouchableOpacity>
                        </LinearGradient>
                    {/* </View> */}
                    <View style={[styles.divider,{backgroundColor:this.state.isDarkMode ? "gray":"#e5e5e5",height:10}]}></View>
                    <View style={[styles.name,{backgroundColor:this.state.isDarkMode ? "#40404c":"#fff"}]}>
                        <View style={styles.iconContainer}>
                            <Icon name="ios-person" size={25} color="#fff" />
                        </View>
                        <View style={styles.nameText}>
                            {
                                this.state.isEditable ?
                                    <TextInput
                                        value={this.state.username}
                                        onChangeText={username => this.setState({ username })}
                                        style={[styles.input,{color:this.state.appFontColor}]}
                                        placeholder="Enter Name..."
                                        placeholderTextColor="#000"
                                        returnKeyType="next"
                                    />
                                    :
                                    <View>
                                        <Text style={{ fontSize: 13, color: "gray" }}>Name</Text>
                                        <Text style={{ fontSize: 18,color:this.state.appFontColor }}>{this.state.current_user[0].name}</Text>
                                    </View>
                            }


                        </View>
                    </View>
                    <View style={[styles.divider,{backgroundColor:this.state.isDarkMode ? "gray":"#e5e5e5"}]}></View>

                    <View style={[styles.name,{backgroundColor:this.state.isDarkMode ? "#40404c":"#fff"}]}>
                        <View style={styles.iconContainer}>
                            <Icon name="ios-mail" size={25} color="#fff" />
                        </View>
                        <View style={styles.nameText}>
                            <View>
                                <Text style={{ fontSize: 13, color: "gray" }}>Email</Text>
                                <Text style={{ fontSize: 18,color:this.state.appFontColor }}>{this.state.current_user[0].email}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.divider,{backgroundColor:this.state.isDarkMode ? "gray":"#e5e5e5"}]}></View>

                    <View style={[styles.name,{backgroundColor:this.state.isDarkMode ? "#40404c":"#fff"}]}>
                        <View style={styles.iconContainer}>
                            <Icon name="ios-call" size={25} color="#fff" />
                        </View>
                        <View style={styles.nameText}>
                            {
                                this.state.isEditable ?
                                    <TextInput
                                        value={this.state.usercontact}
                                        onChangeText={usercontact => this.setState({ usercontact })}
                                        style={[styles.input,{color:this.state.appFontColor}]}
                                        placeholder="Enter Contact..."
                                        keyboardType="numeric"
                                        placeholderTextColor="#000"
                                        returnKeyType="next"
                                    />
                                    :
                                    <View>
                                        <Text style={{ fontSize: 13, color: "gray" }}>Contact</Text>
                                        <Text style={{ fontSize: 18,color:this.state.appFontColor }}>{this.state.current_user[0].contact}</Text>
                                    </View>
                            }
                        </View>
                    </View>
                    <View style={[styles.divider,{backgroundColor:this.state.isDarkMode ? "gray":"#e5e5e5"}]}></View>

                    <View style={[styles.name,{backgroundColor:this.state.isDarkMode ? "#40404c":"#fff"}]}>
                        <View style={styles.iconContainer}>
                            <Icon name="ios-locate" size={25} color="#fff" />
                        </View>
                        <View style={styles.nameText}>
                            {
                                this.state.isEditable ?
                                    <TextInput
                                        value={this.state.useraddress}
                                        onChangeText={useraddress => this.setState({ useraddress })}
                                        style={[styles.input,{color:this.state.appFontColor}]}
                                        placeholder="Enter Address..."
                                        placeholderTextColor="#000"
                                        returnKeyType="next"
                                    />
                                    :
                                    <View>
                                        <Text style={{ fontSize: 13, color: "gray" }}>Address</Text>
                                        <Text style={{ fontSize: 18,color:this.state.appFontColor }}>{this.state.current_user[0].address}</Text>
                                    </View>
                            }
                        </View>
                    </View>
                    <View style={[styles.divider,{backgroundColor:this.state.isDarkMode ? "gray":"#e5e5e5"}]}></View>

                    {
                        this.state.isEditable ?
                            <View style={styles.editableButtons}>
                                <TouchableOpacity
                                    style={[styles.logoutBtn, { width: "40%", marginLeft: 24,backgroundColor:this.state.appBgColor,borderColor:this.state.isDarkMode? "#7f7f88":"#ff5b77" }]}
                                    onPress={() => this.editProfile()}
                                >
                                    <Text style={[styles.editbtnText,{color:this.state.appFontColor}]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.logoutBtn, { width: "40%", marginRight: 24,backgroundColor:this.state.appBgColor,borderColor:this.state.isDarkMode? "#7f7f88":"#ff5b77" }]}
                                    onPress={() => this.updateProfile()}
                                >
                                    <Text style={[styles.editbtnText,{color:this.state.appFontColor}]}>Update</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <TouchableOpacity style={[styles.logoutBtn,{backgroundColor:this.state.appBgColor,borderColor:this.state.isDarkMode? "#7f7f88":"#ff5b77"}]} onPress={() => this.editProfile(this.state.userprofilepush)}>
                                <Text style={[styles.editbtnText,{color:this.state.appFontColor}]}>Edit Profile</Text>
                            </TouchableOpacity>
                    }

                    <Spinner visible={this.state.loading} />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <Spinner visible={this.state.loading} />
            </View>
        );
    }
}

const app = createMaterialTopTabNavigator({
    Profile: {
        screen: UserProfile,
        navigationOptions: {
            header: null
        }
    },
    chat: { screen: FriendsList },
    groups: {
        screen: TeamComponent,
        navigationOptions: {
            headerStyle: {
                position: "absolute",
                backgroundColor: "transparent",
                zIndex: 100,
                top: 0,
                left: 0,
                right: 0,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0
            },
        }
    },
    feed: { screen: MyProduct },
},
    {
        swipeEnabled: true,
        tabBarOptions:{
            visible : false
        },
        tabBarOptions: {

            activeTintColor: "#fff",
            inactiveTintColor: global.isDarkMode? "gray":"#e5e5e5",
            style: {
                position: "absolute",
                backgroundColor: "transparent",
                zIndex: 100,
                top: 0,
                left: 0,
                right: 0,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
                justifyContent:"center",
                height:50
            },
            indicatorStyle: {
                backgroundColor: "#fff",
                // height : 3
            }
        }
    }
)

const MainScreenNavigator = createStackNavigator({
    
    Tab: {
        screen: app,
        navigationOptions: {
            header: null
        }
    },
    Friendlist: {
        screen: FriendsList,
        navigationOptions:
        {
            title: "Friend List",
            header: null
        }
    },
    Chat: {
        screen: Chat,
        navigationOptions: {
            headerStyle: {
                position: "relative",
                backgroundColor: "#ff5b77",
                zIndex: 100,
                top: 0,
                left: 0,
                right: 0,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0
            },
            headerTintColor : "#fff",
        headerTitleStyle : {
          color : "#fff"
        },
        }
    },
    chats: {
        screen: Chats,
        navigationOptions: {
            headerStyle: {
                position: "relative",
                backgroundColor: "#ff5b77",
                zIndex: 100,
                top: 0,
                left: 0,
                right: 0,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0
            },
            // header:null,
            headerTintColor : "#fff",
        headerTitleStyle : {
          color : "#fff"
        },
            
        }
    },
    createTeam: {
        screen: CreateTeam,

        navigationOptions : {
            headerTransparent:true,
            headerStyle: {
                // position: "absolute",
                // backgroundColor: "transparent",
                // zIndex: 100,
                // top: 0,
                // left: 0,
                // right: 0,
                // elevation: 0,
                // shadowOpacity: 0,
                // borderBottomWidth: 0
            },
            headerTintColor : "#fff",
            // headerTitleStyle:{
            //     color : "#fff"
            // }
        }
    },
    teamInfo: {
        screen: TeamInfo,
    },
    addMember: {
        screen: AddMember,
        navigationOptions: {
            headerStyle: {
                position: "absolute",
                backgroundColor: "transparent",
                zIndex: 100,
                top: 0,
                left: 0,
                right: 0,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0
            },
        }
    },
    maps: {
        screen: Maps
    },
    Login: {
        screen: Login,
        navigationOptions: {
          title: "Login",
          headerTintColor : "white"
        }
    },
    DiscussionComponent : {
        screen : DiscussionComponent,
        navigationOptions: {
            
            headerStyle: {
                position: "absolute",
                backgroundColor: "transparent",
                zIndex: 100,
                top: 0,
                left: 0,
                right: 0,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0
            },
        }
    }
});

export default createAppContainer(MainScreenNavigator);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme,
    },
    editableButtons: {
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between"
    },
    input: {
        height: 42.2,
        width: 320,
        // marginBottom: 10,
        backgroundColor: "rgba(0,0,0,0.1)",
        color: "#000",
        paddingHorizontal: 10,
        borderWidth: 0.2,
        borderColor: "white",
        borderRadius: 10
    },
    logoutBtn: {
        width: "50%",
        height: 40,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        alignSelf: "center",
        marginTop: 20,
        elevation: 5,
        borderWidth : 0.6,
        borderColor : "#ff5b77"
    },
    editbtnText: {
        textAlign: "center",
        fontSize: 20,
        color: "#000"
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
    profileContainer: {
        alignContent: "center",
        alignItems: "center",
        // backgroundColor: theme,
        backgroundColor:"#ff5b77",
        elevation: 7,
        height: 300
    },
    profileShadow: {
        flex: 1,
        // backgroundColor : "#ff5b77",
        alignContent: "center",
        alignItems: "center",
        height: 200,
        width: 200,
        borderRadius: 100,
        elevation: 10,
        margin: 12,
        marginTop: 50,
        marginBottom: 0,
    },
    photoOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        height: 200,
        width: 200,
        borderRadius: 100,
        // elevation: 10,
        margin: 12,
        marginTop: 0,
        marginBottom: 0,
        position: "absolute"
    },

    profile: {
        height: 200,
        width: 200,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "#fff",
        overflow: "hidden"
    },
    name: {
        alignContent: "center",
        alignItems: "center",
        backgroundColor: theme,
        padding: 10,
        flexDirection: "row",
    },
    username: {
        fontSize: 17,
        color: "gray",
        textAlign: "center"
    },
    divider: {
        height: 1,
        backgroundColor: "#e5e5e5"
    },
    addressContainer: {
        flex: 1,
        backgroundColor: theme,
        padding: 10
    },
    addressHeading: {
        fontSize: 14,
        color: "gray"
    },
    address: {
        fontSize: 17,
        color: "black"
    },
    cartContainer: {
        backgroundColor: "black",
        padding: 0
    },
    cart: {
        fontSize: 20,
        color: "black",
        padding: 12,
    },
    logoutContainer: {
        height: 80,
        backgroundColor: theme,
        padding: 10
    },
    edit: {
        width: 400,
    },
    editText: {
        color: "#2b2b39",
        fontSize: 20,
        textAlign: "right",
        padding: 7,
        paddingRight: 13
    },
    option: {
        flexDirection: "row",
        backgroundColor: theme,
        padding: 10
    },
    optionTitle: {
        fontSize: 22,
        color: "black",
        textAlign: "center"
    },
    about: {
        width: width / 2,
        borderRightWidth: 1,
        borderColor: "black"
    },
    products: {
        width: width / 2
    }
})
