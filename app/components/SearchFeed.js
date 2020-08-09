import React, { Component } from 'react';
import {
    View,
    TouchableWithoutFeedback,
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    Text
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import firebase from "react-native-firebase";

export default class SearchFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            news : [],
            query:"",
            dataBackup:[],
            dataSource:[]
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

        this.groupRef = this.getRef().child("Incidents");
    }
    getRef() {
        return firebase.database().ref();
    }

    componentWillMount() {
        this.fetchNews();
    }

    fetchNews() {
        this.setState({
            // loading : true
        });

        this.groupRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {

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
                news: items,
                // loading : false
                dataSource : items.reverse(),
                dataBackup : items
            });
        });

    }

    setSearchText(event) {
        var searchText = event.nativeEvent.text;
        this.setState({
          query: searchText
        })
        if (searchText == "") {
          var fullData = this.state.dataBackup;
          // alert(fullData);
          this.setState({
            dataSource: fullData
          });
        }
        else {
          var data = this.state.dataBackup;
          searchText = searchText.toLowerCase();
          // alert(searchText);
          data = data.filter(l =>
            l.book_name.toLowerCase().match(searchText)
          );
          // alert(JSON.stringify(data));
          this.setState({
            dataSource: data
          })
        }
      }

      viewFeed = (item)=> {
        this.props.navigation.navigate("book", {'data':item});
      }

    render() {
        return (
            <View style={[styles.scene, { backgroundColor: global.appBgColor }]} >
                <TextInput
                    placeholder="Enter Text Here"
                    placeholderTextColor="gray"
                    style={[styles.input,{backgroundColor : global.isDarkMode ? "#2b2b39":"#fff",color:global.appFontColor}]}
                    onChange={this.setSearchText.bind(this)}
                    value={this.state.query}
                />

                <FlatList
                    data={this.state.dataSource}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableWithoutFeedback onPress={()=> this.viewFeed(item)}>
                            <View style={[styles.feedContainer,{backgroundColor:global.appOptionsBgColor,marginTop : index==0 ? 10:0}]}>
                                <Image
                                    style = {styles.image}
                                    source = {{uri : item.img_url}}
                                />
                                <View style={[styles.data,{backgroundColor:global.appOptionsBgColor}]}>
                                    <Text style={[styles.title,{color:global.appFontColor}]} numberOfLines={1}>
                                        <Icon name="ios-cube" size={16}/> {item.book_name}</Text> 
                                    <Text style={[styles.des,{color:global.appFontColor}]} numberOfLines={2}>
                                        {item.description}</Text> 
                                    <Text style={[styles.datetime,{color:global.appFontColor}]}>
                                        <Icon name="ios-clock" size={14} color="gray"/> {item.datetime}</Text> 
                                </View>
                            </View>
                            </TouchableWithoutFeedback>
                        )
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1
    },
    input: {
        borderColor: "#e5e5e5",
        borderWidth: 0.5,
        elevation : 5,
        margin: 10,
        borderRadius: 5,
        padding: 8,
        paddingLeft: 10,
        backgroundColor : "#fff"
    },
    feedContainer: {
        flexDirection: "row",
        height: 100,
        backgroundColor: "#fff",
        margin: 10,
        marginTop : 0,
        marginBottom : 10,
        elevation : 5,
        borderRadius : 5,
        overflow : "hidden",
    },
    image : {
        width : "40%"
    },
    data : {
        width : "60%",
        backgroundColor :"white",
        flexDirection : "column",
        padding : 10,
    },
    title : {
        fontSize : 16,
        fontWeight : "bold",
        color : "#000",
        fontFamily : "Roboto",
        marginBottom : 2
    },
    des : {
        fontSize : 13,
        color : "#000",
        fontFamily : "Roboto",
        marginBottom : 2
    },
    datetime : {
        fontSize : 13,
        color : "#000",
        fontFamily : "Roboto"
    },
})