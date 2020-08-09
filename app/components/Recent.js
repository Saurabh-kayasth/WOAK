import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';

export default class Recent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let recents = [
            "Incident Title ?...",
            "Incident Title ?...",
            "Incident Title ?...",
            "Incident Title ?...",
        ];
        return (
            <View>
                <FlatList
                    showsHorizontalScrollIndicator = {false}
                    data={recents}
                    horizontal={true}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity style={[styles.recentStyle,{backgroundColor:global.appOptionsBgColor}]}>
                                <Image 
                                    source={require('./avatar.png')}
                                    style = { styles.avatarStyle }/>
                                <Text style={{ fontSize: 18, color: global.isDarkMode? "lightgray":"#000" }}>{recents[index]}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    recentStyle: {
        borderWidth: 0.5,
        elevation: 5,
        backgroundColor: "#fff",
        borderRadius: 20,
        margin: 10,
        height : 40,
        // padding: 10,
        // paddingLeft:15,
        paddingRight:15,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        flexDirection : "row",
        overflow : "hidden"
    },
    avatarStyle : {
        height : 40,
        width : 40,
        borderRadius : 20,
        marginRight : 10,
        borderWidth: 6,

    }
});
