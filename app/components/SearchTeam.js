import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    Text,
    TouchableWithoutFeedback
} from "react-native";
import Icon from "react-native-vector-icons";
import firebase from "react-native-firebase";
export default class SearchTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: null,
            query : "",
            dataBackup : [],
            dataSource : []
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

        this.groupRef = this.getRef().child("GroupDetails");
    }

    getRef() {
        return firebase.database().ref();
    }

    getGroups() {
        this.groupRef.on("value", snap => {
            var items = [];
            snap.forEach(child => {
                items.push({
                    name: child.val().name,
                    id: child.val()._id,
                    member: child.val().members,
                    avatar: child.val().avatar
                });
            });
            this.setState({
                groups: items,
                dataSource: items,
            dataBackup: items,
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
            l.name.toLowerCase().match(searchText)
          );
          // alert(JSON.stringify(data));
          this.setState({
            dataSource: data
          })
        }
      }

    componentDidMount() {
        this.getGroups();
    }

    viewTeam = (item)=> {

        console.log("search team screen ================================================== ");
        console.log(this.props.navigation.navigate);
        console.log("search team screen ================================================== ");
        var name = item.name;
        var email = item.email;
        var uid = item.id;
        this.props.navigation.navigate("OtherTeamDetails", {
          name: name,
          email: email,
          uid: uid,
          member: item.member,
          avatar: item.avatar
        });
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
                    numColumns={2}
                    data={this.state.dataSource}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableWithoutFeedback onPress={()=>this.viewTeam(item)}>
                            <View style={styles.feedContainer}>
                                <Image
                                    style = {styles.image}
                                    source = {{uri : item.avatar}}
                                />
                                <View style={[styles.data,{backgroundColor:global.appOptionsBgColor}]}>
                                    <Text style={[styles.title,{color:global.appFontColor}]}>{item.name}</Text> 
                                    {/* <Text style={styles.des} numberOfLines={2}>{item.member}</Text> 
                                    <Text style={styles.datetime}>Date Time</Text>  */}
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
        // flexDirection: "row",
        width : "45%",
        height: 150,
        backgroundColor: "#fff",
        margin: 10,
        marginBottom : 7,
        elevation : 5,
        borderRadius : 5,
        overflow : "hidden"
    },
    image : {
        width : "100%",
        height : 110
    },
    data : {
        // width : "60%",
        backgroundColor :"white",
        flexDirection : "column",
        padding : 10
    },
    title : {
        fontSize : 16,
        fontWeight : "bold",
        color : "#000",
        fontFamily : "Roboto"
    },
    des : {
        fontSize : 13,
        color : "#000",
        fontFamily : "Roboto"
    },
    datetime : {
        fontSize : 13,
        color : "#000",
        fontFamily : "Roboto"
    },
})