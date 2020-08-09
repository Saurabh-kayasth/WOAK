import React, { Component } from 'react';
import {
    View,
    Text
} from "react-native";

class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ position: "absolute", bottom: 0, height: 50, width: "100%", backgroundColor: global.appBottomTabBarBgColor }}>

            </View>
        )
    }
}

export default Footer;