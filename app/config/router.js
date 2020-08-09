import React, { Component } from 'react';
import '../../global';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import Icon from 'react-native-vector-icons/Ionicons';
import Home from "../screens/Home/Home";
import Profile from "../screens/Profile/Profile";
import Incident from "../screens/IncidentDetails/Incident";
import FriendsList from "../components/Friendlist";
import Chat from "../components/Chat";
import SendAlert from "../components/sendAlert";
import Alert from "../screens/Alerts/Alerts";
import Maps from "../components/maps";
import Settings from "../screens/Settings/Settings";
import ForgetPassword from "../components/ForgetPassword";
import Teams from "../screens/Teams/Teams";
import SendIncident from "../components/SendIncident";
import OtherTeamDetails from "../components/OtherTeamDetails";
import ChatbotUi from "../components/ChatbotUi";
import SearchScreen from "../components/SearchScreen";
import OtherUserProfile from "../components/OtherUserProfile";
import EmergencyList from '../components/EmergencyList';
import DiscussionComponent from "../components/DiscussionComponent";

const HeaderStyle = {
  headerTransparent: true,
  headerTintColor: "#fff",
  headerStyle: {
    position: "absolute",
    backgroundColor: "transparent",
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0
  }
};

const Tabs = createBottomTabNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarTitle: "Home",
      tabBarIcon: ({ focused }) => <Icon name="ios-home" color={focused ? (global.isDarkMode ? "#fff" : "#ff5b77") : "gray"} size={22} />
    },
  },
  Alerts: {
    screen: Alert,
    navigationOptions: {
      tabBarIcon: ({ focused }) => <Icon name="ios-notifications" color={focused ? (global.isDarkMode ? "#fff" : "#ff5b77") : "gray"} size={22} />
    },
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      header: null,
      tabBarIcon: ({ focused }) => <Icon name="ios-person" color={focused ? (global.isDarkMode ? "#fff" : "#ff5b77") : "gray"} size={22} />
    }
  },
  Groups: {
    screen: Teams,
    navigationOptions: {
      tabBarIcon: ({ focused }) => <Icon name="ios-people" color={focused ? (global.isDarkMode ? "#fff" : "#ff5b77") : "gray"} size={22} />
    }
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      tabBarIcon: ({ focused }) => <Icon name="ios-settings" color={focused ? (global.isDarkMode ? "#fff" : "#ff5b77") : "gray"} size={22} />
    }
  },

},
  {
    initialRouteName: 'Home',
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    lazyLoad: true,
    animationEnabled: true,
    tabBarOptions: {
      style: {
        position: "absolute",
        backgroundColor: "transparent",
        zIndex: 100,
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        height: 50
      },
      activeTintColor: global.isDarkMode ? "#fff" : "#ff5b77",
      inactiveTintColor: "gray",
      showLabel: true,
      allowFontScaling: true,
      labelStyle: {
        fontSize: 10,
        padding: 12,
        paddingBottom: 4,
        paddingTop: 0
      }
    },
  }
);


const MainScreenNavigator = createStackNavigator({
  Tab: {
    screen: Tabs,
    navigationOptions: {
      title: "BOOK STORE",
      headerLeft: <Icon style={{ paddingLeft: 22 }} name="ios-book" size={30} color="#fff" />,
      headerStyle: {
        backgroundColor: "#2b2b39",
      },
      headerTitleStyle: { color: "#fff" },
      header: null
    }
  },
  book: {
    screen: Incident,
    navigationOptions: {
      headerTransparent: true,
      headerTintColor: "#fff"
    }
  },
  OtherTeamDetails : {
    screen: OtherTeamDetails,
    navigationOptions : HeaderStyle
  },
  Friendlist: {
    screen: FriendsList,
    navigationOptions:
    {
      title: "Friend List"
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      headerStyle: {
          position: "relative",
          backgroundColor: "#ff5b77",
          zIndex: 100,
          top: 0,
          left: 0,
          right: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0
      },
      // header:null,
      headerTintColor : "#fff",
  headerTitleStyle : {
    color : "#fff"
  },
      
  }
  },
  Home: {
    screen: Home
  },
  SendAlert: {
    screen: SendAlert,
    navigationOptions: HeaderStyle
  },
  Maps: {
    screen: Maps
  },
  ForgetPassword: {
    screen: ForgetPassword,
    navigationOptions: HeaderStyle
  },
  SendIncident: {
    screen: SendIncident,
    navigationOptions: HeaderStyle
  },
  EmergencyList: {
    screen: EmergencyList,
    navigationOptions: HeaderStyle
  },
  ChatbotUi: {
    screen: ChatbotUi,
    navigationOptions: HeaderStyle
  },
  SearchScreen : {
    screen : SearchScreen,
    navigationOptions : {
      headerTransparent : true,
      header:null
    }
  },
  OtherUserProfile : {
    screen : OtherUserProfile,
    navigationOptions : {
      header : null
    }
  },
  DiscussionComponent : {
    screen : DiscussionComponent,
    navigationOptions: {
        headerStyle: {
            position: "absolute",
            backgroundColor: "transparent",
            zIndex: 100,
            top: 0,
            left: 0,
            right: 0,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0
        },
    }
}
});

export default createAppContainer(MainScreenNavigator);