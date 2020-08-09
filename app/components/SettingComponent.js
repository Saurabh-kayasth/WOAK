import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TouchableHighlight,
    ScrollView,
    Image,
    StatusBar,
    Switch,
    AsyncStorage
} from 'react-native';
import Communications from 'react-native-communications'; 
import Icon from "react-native-vector-icons/Ionicons";
import firebase from "react-native-firebase";

export default class SettingComponent extends Component {

    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: "#fff"
    };

    constructor(props) {
        super(props);
        this.state = {
            ready: true,
            isDarkMode : false,
            appBgColor : null,
            appHeaderBgColor : null,
            appFontColor : null
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

    onEmailPress = (email) => {
        Communications.email([email], null, null, null, null);
    };

    componentDidMount = () => {
        AsyncStorage.getItem("isDarkModeEnabled")
        .then((value) => {
            if(value=="true")
            {
                this.setState({
                    isDarkMode : true,
                    appBgColor : "#40404c",
                    appHeaderBgColor : "#2b2b39",
                    appFontColor : "#fff"
                });
                theme = "pink";
                
            }
            else {
                this.setState({
                    isDarkMode : false,
                    appBgColor : "#fff",
                    appHeaderBgColor : "#ff5b77",
                    appFontColor : "#000"
                });
            }
        });
    };

    enableDarkMode = () => {
        if(this.state.isDarkMode)
        {
            this.setState({
                isDarkMode : false
            });
            AsyncStorage.setItem("isDarkModeEnabled","false");
        }
        else {
            this.setState({
                isDarkMode : true
            });
            AsyncStorage.setItem("isDarkModeEnabled","true");
        }
        alert("To see the changes restart the app.");
    }

    changePassword = () => {
        this.props.navigation.navigate("ForgetPassword");
    }

    render() {
        return (
            <View style={[styles.container,{backgroundColor : this.state.appBgColor}]} >
                <StatusBar barStyle="light-content" backgroundColor={this.state.appHeaderBgColor} />
                <View style={[styles.header,{backgroundColor:this.state.appHeaderBgColor}]}>
                    <Text style={styles.headerText}>
                        <Icon name="ios-settings" size={27} /> Settings
                    </Text>
                </View>
                <View style={styles.settingContainer}>
                    <View style={styles.changePasswd}>
                        <TouchableOpacity onPress={()=> this.changePassword()}>
                            <Text style={[styles.changePassText,{color:this.state.appFontColor}]}>
                                <Icon name="ios-key" color={this.state.appFontColor} size={23}/>  Change Password
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="ios-arrow-forward" color={this.state.appFontColor} size={24} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.divider}></View>
                    <View style={styles.changePasswd}>
                        <TouchableOpacity>
                            <Text style={[styles.changePassText,{color:this.state.appFontColor}]}>
                                <Icon name="ios-help-buoy" color={this.state.appFontColor} size={23}/>  Dark Mode
                            </Text>
                        </TouchableOpacity>
                        <Switch
                            thumbColor={global.isDarkMode ? "#2b2b39":"#ff5b77"}
                            trackColor={{false:"gray",true:global.isDarkMode ? "#333333":"#ff9cad"}}
                            onValueChange={()=> this.enableDarkMode()}
                            value={this.state.isDarkMode} 
                            />
                    </View>
                    <View style={styles.divider}></View>
                    <View style={styles.changePasswd}>
                        <TouchableOpacity onPress= {()=> this.onEmailPress("i.am.saurabh.kayasth@gmail.com")}>
                            <Text style={[styles.changePassText,{color:this.state.appFontColor}]}>
                                <Icon name="ios-mail" color={this.state.appFontColor} size={23}/>  Contact Us
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="ios-arrow-forward" color={this.state.appFontColor} size={24} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.divider}></View>
                    {/* <View style={styles.changePasswd}>
                        <TouchableOpacity>
                            <Text style={[styles.changePassText,{color:this.state.appFontColor}]}>
                                <Icon name="ios-help-circle" color={this.state.appFontColor} size={23}/>  Help
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="ios-arrow-forward" color={this.state.appFontColor} size={24} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.divider}></View> */}
                    <View style={styles.changePasswd}>
                        <TouchableOpacity>
                            <Text style={[styles.changePassText,{color:this.state.appFontColor}]} onPress={() => { this.LogOut() }}>
                                <Icon name="md-log-out" color={this.state.appFontColor} size={23}/>  Log Out
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="ios-arrow-forward" color={this.state.appFontColor} size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : "#fff"
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
    changePasswd: {
        width: "100%",
        height: 55,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        flexDirection: "row",
    },
    changePassText: {
        color: "#000",
        fontSize: 20
    },
    divider: {
        height: 0.7,
        backgroundColor: "gray"
    }
});
