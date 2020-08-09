import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    ImageBackground,
    TouchableWithoutFeedback,
    Dimensions
} from "react-native";
import { Card } from "react-native-elements";
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from "react-native-linear-gradient";
import Header from "./Header";

let {width,height} = Dimensions.get("window");

class GroupData extends Component {
    constructor(props) {
        super(props);
    }

    viewTeam = ()=> {
        var name = this.props.item.name;
        var email = this.props.item.email;
        var uid = this.props.item.id;
        this.props.navigation.navigate("OtherTeamDetails", {
          name: name,
          email: email,
          uid: uid,
          member: this.props.item.member,
          avatar: this.props.item.avatar
        });
      }

    render() {
        return (
            <Card
                containerStyle={styles.cardContainer}>
                    <TouchableWithoutFeedback onPress={() => this.viewTeam()}>
                        <View>
                <ImageBackground
                    style={styles.avatarStyle}
                    source={{ uri: this.props.item.avatar }}>
                    <LinearGradient
                        colors={['#cc000000', '#000']}
                        style={styles.cardBody}>
                        <View>
                            <Text style={[styles.viewText, { color: "#fff",marginBottom:3 }]}>{this.props.item.name}</Text>
                            {/* <Text style={styles.likeText}><Icon name="favorite" color="#ff5b77"/> 11k</Text> */}
                        </View>
                    </LinearGradient>

                </ImageBackground>
                <View style={{flexDirection :"row"}}>
                <TouchableOpacity 
                    style={[styles.viewBtn,{backgroundColor : global.appOptionsBgColor,borderRightWidth:0.4,borderRightColor : "gray"}]}
                    onPress={() => this.viewTeam()}>
                    <Text style={[styles.viewText,{color:global.appFontColor}]}>View</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity 
                    style={[styles.viewBtn,{backgroundColor : global.appOptionsBgColor,}]}>
                    <Text style={[styles.viewText,{color:global.appFontColor}]}>Join +</Text>
                </TouchableOpacity> */}
                </View>
                </View>
                </TouchableWithoutFeedback>
            </Card>
        )
    }
}

export default class AllTeamsComponent extends Component {
    constructor(props) {
        super(props);
        console.log(JSON.stringify(this.props.data));
    }

    render() {
        return (
            <View style={[styles.container,{ backgroundColor : global.appBgColor }]}>
                <Header iconName="ios-people" headerTitle="Groups" />
                <FlatList
                    numColumns={2}
                    data={this.props.data}
                    renderItem={({ item, index }) => {
                        return (
                            <GroupData navigation={this.props.navigation} item={item} />
                        )
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height : height,
    },
    cardContainer: {
        width: "44.5%",
        height: 200,
        borderRadius: 5,
        elevation: 5,
        backgroundColor: "#fff",
        overflow: "hidden",
        padding: 0,
        borderWidth : 0.2,
        marginRight : 0,
        marginBottom : 10
    },
    avatarStyle: {
        width: "100%",
        height: 160
    },
    viewBtn: {
        backgroundColor: "#fff",
        width: "100%",
        height: 40,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        // marginTop : 20
    },
    viewText: {
        fontSize: 16,
        color: "#000",
        fontFamily: "Roboto"
    },
    cardBody: {
        width : "100%",
        height : 70,
        padding: 5,
        paddingTop: 4,
        paddingBottom: 4,
        position : "absolute",
        bottom : 0,
        justifyContent : "flex-end"
    },
    likeText: {
        fontSize: 12,
        color: "#e5e5e5",
        fontFamily: "Roboto"
    }
});
