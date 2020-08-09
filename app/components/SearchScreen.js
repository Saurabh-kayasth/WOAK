import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    Animated,
    TextInput
} from "react-native";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
const headerBg = '#282f3f';
const activeBg = '#384153';
const normalBg = '#434e64';
const activeText = '#ff5b77';
const normalText = '#222222';
import SearchFeed from "./SearchFeed";
import SearchTeam from "./SearchTeam";
import SearchPeople from "./SearchPeople";

// const FirstRoute = () => (
//    <SearchFeed/>
// );

class FirstRoute extends Component {
    constructor(props){
        super(props);
        console.log(props.route.navigation.navigate);
    }
    render(){
        return (
            <SearchFeed navigation={this.props.route.navigation}/>
        )
    }
}

class SecondRoute extends Component {
    constructor(props){
        super(props);
        console.log(props.route.navigation.navigate);
    }
    render(){
        return (
            <SearchTeam navigation={this.props.route.navigation}/>
        )
    }
}

class ThirdRoute extends Component {
    constructor(props){
        super(props);
        console.log(props.route.navigation.navigate);
    }
    render(){
        return (
            <SearchPeople navigation={this.props.route.navigation}/>
        )
    }
}
// const SecondRoute = () => (
//     <SearchTeam navigation={this.props.navigationState.navigation}/>
// );

// const ThirdRoute = () => (
//     <SearchPeople/>
// );

export default class SearchScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            index: 0,
            routes: [
                { 
                    key: 'first', 
                    title: 'Feeds',
                    navigation : this.props.navigation
                },
                { 
                    key: 'second', 
                    title: 'Groups',
                    navigation : this.props.navigation 
                },
                { 
                    key: 'third', 
                    title: 'People',
                    navigation : this.props.navigation 
                },
            ],
        };
    }
    
    _renderTabBar = props => (
        <TabBar
            {...props}
            scrollEnabled
            navigation={this.props.navigation}
            tabStyle={styles.tabStyle}
        />
    );

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" backgroundColor={headerBg}/>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: FirstRoute,
                        second: SecondRoute,
                        third: ThirdRoute,
                    })}
                    onIndexChange={ index => this.setState({ index }) }
                    initialLayout={{ width: Dimensions.get('window').width }}
                    renderTabBar={this._renderTabBar}
                    animationEnabled={true}
                    swipeEnabled={true}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    text: {
        lineHeight: 20,
        paddingTop: 9,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 9,
        textAlign: 'center',
      },
      tabStyle: {
        // opacity: 1,
        width: 131,
        backgroundColor: headerBg,
      },
      indicator: {
        backgroundColor: "#fff",
      },
      content: {
        padding: 20,
        backgroundColor: activeBg
      },
      contentText: {
        color: activeText,
      },
});