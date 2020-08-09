import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    StatusBar,
    Dimensions,
    Image
} from 'react-native';
import firebase from "react-native-firebase";
import moment from 'moment';
const { width, height } = Dimensions.get('window');

class Messages extends Component {
    constructor(props){
        super(props);
        this.state = {
            username : ""
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
        this.userRef = this.getRef().child("friends"); 
    }


    componentDidMount(){
        this.userRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {
                if (child.val().uid == this.props.data.source_id) {
                    items.push({
                        name: child.val().name,
                        avt: child.val().avatar,
                    });
                }
            });
            this.setState({
                user_profile: items[0].avt,
                username: items[0].name
            });
            // console.log(this.state.user);
        });
    }

    getRef() {
        return firebase.database().ref();
    } 

    render(){
        return (
            <View style={[styles.messageContainer,{backgroundColor:global.appOptionsBgColor}]}>
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Image
                        source={{uri : this.state.user_profile}}
                        style={{height : 20, width:20,borderRadius:10,borderWidth:0.3,borderColor:"gray"}}
                    />
                    <Text style={{color:"#ff5b77",fontSize:15}}>   {this.state.username}</Text>
                </View>
                
                <Text style={[styles.message,{color:global.appFontColor}]}>{this.props.data.message}</Text>
                <Text style={{color:"gray",fontSize:12,marginTop:5,alignSelf:"flex-end"}}>{this.props.data.datetime}</Text>
            </View>
        )
    }
}

class DiscussionComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            discussion:[]
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

        this.discussRef = this.getRef().child("Discuss/"+this.props.navigation.state.params.g_id);
        this.listenForDiscussion();
    }

    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: "#fff"
    };

    getRef() {
        return firebase.database().ref();
    }    

    listenForDiscussion(){
        this.discussRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {
                items.push({
                    message : child.val().message,
                    datetime : child.val().datetime,
                    source_id : child.val().source_id
                });
            });
            this.setState({
                discussion: items
            });
        });
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

    sendDiscussMessage = () => {
        var user = firebase.auth().currentUser;
        var key = this.props.navigation.state.params.g_id;
        var now = this.formatDate(new Date());
        var now_time = moment()
                    .utcOffset('+05:30')
                    .format(' hh:mm a');
        this.getRef()
            .child("Discuss/" + key)
            .push({
                message: this.state.value,
                datetime: now + ' ' + now_time,
                source_id : user.uid
            });
            this.setState({
                value : ""
            });
    }

    componentDidMount(){
        this.scroll();
    }

    scroll = () =>{
        this.refs.flatList.scrollToEnd()
    }

    render() {

        return (
            <View style={[styles.container,{backgroundColor : global.appBgColor}]}>
                <StatusBar barStyle="light-content" backgroundColor={global.isDarkMode ? "#2b2b39" : "#ff5b77"} />
                <View style={[styles.header, { backgroundColor: global.appHeaderBgColor }]}>
                    <Text style={styles.headerText}>Discussion</Text>
                </View>
                <View style={styles.discussionContainer}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data = {this.state.discussion}
                        ref = "flatList"
                        onContentSizeChange={()=> this.refs.flatList.scrollToEnd()}
                        renderItem = {({index,item})=>{
                            return(
                                <Messages data={item}/>
                            )
                        }}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input,{color:global.appFontColor,backgroundColor:global.appOptionsBgColor}]}
                        placeholder="Type Something Here..."
                        placeholderTextColor="gray"
                        value={this.state.value}
                        onChangeText={value => this.setState({ value })}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={()=>this.sendDiscussMessage()}>
                        <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default DiscussionComponent;

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent : "flex-end"
    },
    inputContainer: {
        flexDirection: "row",
        // position: "absolute",
        // backgroundColor : "#333333",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: 60,
        bottom: 50,
        padding: 10,
        zIndex : 999
        // left: 0,
        // right: 0,

    },
    input: {
        width: "82%",
        height: 40,
        borderRadius: 10,
        padding: 5,
        borderWidth: 0.5,
        borderColor: "gray",
        elevation : 2
    },
    sendBtn: {
        backgroundColor: "#2b2b39",
        borderRadius: 10,
        width: "17%",
        marginLeft: "1%",
        padding: 10,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        elevation : 5
    },
    sendText: {
        fontSize: 16,
        fontFamily: "Roboto",
        color: "#fff"
    },
    discussionContainer: {
        height : height-105,
        padding: 10,
        marginBottom : 35
    },
    header: {
        zIndex: -1,
        height: 60,
        width: "100%",
        paddingLeft: 55,
        justifyContent: "center",
        elevation: 10,
        position : "absolute",
        top:0
    },
    headerText: {
        fontSize: 25,
        color: "#fff"
    },
    messageContainer : {
        width : "100%",
        padding : 10,
        elevation : 2,
        marginBottom : 4,
        marginTop : 5
    },
    message : {
        fontSize : 16,
        fontFamily:"Roboto",
        letterSpacing : 0.4,
        marginTop : 5
        
    }
});