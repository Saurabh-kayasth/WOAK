import React, { Component } from 'react';
import {
    AsyncStorage
} from "react-native";
AsyncStorage.getItem("isDarkModeEnabled")
    .then((value) => {
        if (value == "true") {

            global.isDarkMode = true;
            global.appBgColor = "#40404c";
            global.appHeaderBgColor = "#2b2b39";
            global.appFontColor = "#fff";
            global.appComponentBgColor = "#40404c";
            global.appOptionsBgColor = "#2b2b39";
            global.appBottomTabBarBgColor = "#2b2b39",
            global.appTopTabBarBgColor = "#2b2b39"
        }
        else {

            global.isDarkMode = false;
            global.appBgColor = "#e5e5e5";
            global.appHeaderBgColor = "#ff5b77";
            global.appFontColor = "#000";
            global.appComponentBgColor = "#fff";
            global.appOptionsBgColor = "#fff";
            global.appBottomTabBarBgColor = "#fff",
            global.appTopTabBarBgColor = "#252525"

        }

        
    });