import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    Image
} from "react-native";
import firebase from "react-native-firebase";
import ProductComponent from "../../components/ProductComponent";
import Footer from "../../components/Footer";
import Spinner from "react-native-loading-spinner-overlay";
import Utils from "../../components/GetUser";
import NoInternet from '../../ErrorPages/NoInternet';
import Status from '../../components/Status';

class Home extends Component {

    static navigationOption = {
        title: "Home"
    }
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            news: [],
            loading: false
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
        }
        this.groupRef = this.getRef().child("Incidents");
        this.likesRef = this.getRef().child("PostLikes");
    }

    getRef() {
        return firebase.database().ref();
    }

    callUtils(){
        Utils.getUserDetails();
    }

    componentDidMount(){
        Utils.getUserDetails();
    }

    componentWillMount() {
        this.fetchNews();
    }

    fetchNews() {
        this.setState({
            loading: true
        });
        
        this.groupRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {
                var likesCount = this.getLikesCount(child.val()._id);
                console.log(likesCount);
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
            });
            this.setState({
                news: items.reverse(),
                loading: false
            });
            this.callUtils();
        });
    }

    getLikesCount(postId) {
        this.setState({
            loading: true
        });
        this.getRef().child("PostLikes/" + postId).on("value", snap => {
            this.setState({
                loading: false
            });
            return Object.keys(snap._childKeys).length;
        }
        );
    }

    render() {
        console.disableYellowBox = true;
        return (
            <View style={styles.container}>

                <StatusBar barStyle="light-content" backgroundColor="#2b2b39" />
                <TouchableOpacity style={styles.action}>
                    <Image style={styles.logo} source={{ uri: "https://firebasestorage.googleapis.com/v0/b/book-store-56297.appspot.com/o/logo%2Ficon.png?alt=media&token=c7f92169-f597-408e-af31-774eda3ee0b1" }} />
                </TouchableOpacity>
                {/* <Status/>                     */}
                {
                    this.state.loading ?
                    // <NoInternet/>
                    null
                    :
                    <ProductComponent navigation={this.props.navigation} data={this.state.news} />
                }
                
                <Footer />
                <Spinner visible={this.state.loading} />
            </View>
        );
    }
}

export default Home;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1
    },
    action: {
        position: "absolute",
        bottom: 10,
        right: 10,
        height: 40,
        width: 40,
        zIndex: 999
    }
});