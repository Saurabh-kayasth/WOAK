import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.header, { backgroundColor: global.appHeaderBgColor }]}>
                <Text style={styles.headerText}>
                    <Icon name={this.props.iconName} size={25} /> {this.props.headerTitle}
                </Text>
            </View>
        )
    }
}

export default Header;

const styles = StyleSheet.create({
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
    }
});