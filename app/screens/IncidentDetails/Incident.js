import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    StatusBar
} from "react-native";
import IncidentDetails from "../../components/IncidentDetails";

class Incident extends Component {
    static navigationOptions = {
        headerTransparent: true,
        headerTintColor: "#fff"
    };
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#191922" />
                
                <IncidentDetails videos={this.props.navigation.state.params} navigation={this.props.navigation}></IncidentDetails>


            </View>
        );
    }
}

export default Incident;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1
    }
});