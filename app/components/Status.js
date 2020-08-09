import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Image,
    FlatList,
    Dimensions,
    Modal,
    ProgressBarAndroid
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

class StatusData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colorIndex: 0,
            status: [],
            user_profile: "",
            user_name: "",
            modalVisible: false,
            headerColor : "red",
            progressValue : 0
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
        this.friendsRef = this.getRef().child("friends");
        this.interval;
    }

    componentDidMount() {
        console.log(this.props.data.source_id);
        this.friendsRef.on("value", snap => {
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
                user_name: items[0].name
            });
        });
    }

    getRef() {
        return firebase.database().ref();
    }

    openModal = () => {
        this.setState({
            modalVisible: true
        });
        this.startProgress();
    }

    startProgress(){
        this.interval = setInterval(() => {
            this.setState({
                progressValue : this.state.progressValue+0.0025
            })
            if(this.state.progressValue >= 1){
                console.log("reached");
                this.closeModal();
            }
        },20);
        
    }

    closeModal = () => {

        console.log("closed");
        clearInterval(this.interval);
        this.setState({
            modalVisible: false,
            progressValue:0
        });
    }

    render() {
        return (
            <View>
                <Modal 
                    visible={this.state.modalVisible} 
                    animationType="slide">
                        
                    <View style={[styles.modalInner,{backgroundColor : this.props.color}]}>
                        <View style={{width:"100%",position:"absolute",top:0}}>
                    <ProgressBarAndroid
                            styleAttr="Horizontal"
                            color="#ff5b77"
                            indeterminate={false}
                            progress={this.state.progressValue}
                        />
                        </View>
                        <TouchableOpacity 
                            style = {{position : "absolute",top:10,justifyContent:"center"}}
                            onPress={() => this.closeModal()}>
                            <Icon name="ios-arrow-down" color="#fff" size={30}/>
                        </TouchableOpacity>
                        <Text style={[styles.statusText,{fontSize : 25,color:"#fff",textAlign:"center"}]}>
                            {this.props.data.status}
                        </Text>
                        <LinearGradient
                            colors={['#cc000000', '#000000']}
                            style={styles.linearGradientBottom}
                        >
                            <Image
                                source={{ uri: this.state.user_profile }}
                                style={styles.avatar}
                            />
                            <Text style={styles.username}>
                                {this.state.user_name}
                            </Text>
                        </LinearGradient>
                    </View>
                </Modal>
                <TouchableOpacity style={styles.status} onPress={() => this.openModal()}>
                    <Text style={styles.statusText} numberOfLines={12}>
                        {this.props.data.status}
                    </Text>
                    <LinearGradient
                        colors={['#cc000000', '#000000']}
                        style={styles.linearGradientBottom}
                    >
                        <Image
                            source={{ uri: this.state.user_profile }}
                            style={styles.avatar}
                        />
                        <Text style={styles.username}>
                            {this.state.user_name}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

            </View>
        )
    }
}

class Status extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colorIndex: 0,
            status: []
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

    componentDidMount() {
        this.getStatus();
    }

    getStatus() {
        this.statusRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {
                items.push({
                    status_id: child.val().status_id,
                    status: child.val().status,
                    date: child.val().date,
                    time: child.val().time,
                    source_id: child.val().source_id
                });
            });
            this.setState({
                status: items.reverse()
            });
        });
    }

    render() {
        let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
        let colors = ["#145a32", "#6a1e16", "#1B2631", "#6E2C00", "#154360", "#CD5C5C"];
        let colorIndex = 0;
        // console.log(this.state.colorIndex)
        return (
            <View style={[styles.container,{backgroundColor : global.appBgColor}]}>
                <FlatList
                    pagingEnabled={false}
                    alwaysBounceHorizontal={true}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    initialNumToRender={1}
                    data={this.state.status}
                    renderItem={({ item, index }) => {
                        colorIndex += 1;
                        if (colorIndex == 6) {
                            colorIndex = 0
                        }
                        return (
                            <View style={
                                [styles.statusContainer,
                                {
                                    borderColor : global.appBgColor,
                                    backgroundColor: colors[colorIndex],
                                    marginRight: (index + 1) % 3 == 0 ? 0 : 0
                                }
                                ]}>
                                <StatusData data={item} color={colors[colorIndex]} />
                            </View>
                        )
                    }}
                />
            </View>
        )
    }
}

export default Status;

const styles = StyleSheet.create({
    container: {
        // height: 190,
        width: "100%",
        borderTopWidth: 0.5,
        borderTopColor: "#2b2b39"
    },
    statusContainer: {
        width: width / 3,
        height: 190 - 10,
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 5,
        borderColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#2B2B39",
    },
    status: {
        width: "100%",
        height: 190 - 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    linearGradientBottom: {
        width: "100%",
        height: 100,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    statusText: {
        padding: 10,
        fontSize: 12,
        color: "gray"
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20
    },
    username: {
        color: "#fff",
        fontSize: 13,
        marginTop: 4
    },
    modalInner : { 
        height: height + 50, 
        width: width, 
        width : width,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    }
});