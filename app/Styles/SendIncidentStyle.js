import {
    StyleSheet
} from "react-native";

const SendIncidentStyles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : "#e5e5e5"
    },
    cardContainer : {
        backgroundColor : "#fff",
        padding : 0,
        elevation : 5,
        borderRadius : 8,
        overflow : "hidden",
        borderWidth : 0.3,
        marginBottom : 10
    },
    previewContainer : {
        backgroundColor : "teal",
        padding : 10,
        width : "100%",
    },
    pictureStyle : {
        width : "100%",
        height : 250,
        borderRadius : 5,
        elevation : 10,
        marginBottom : 4
    },
    cardBody : {
        backgroundColor : "#e5e5e5",
        flexDirection : "row",
        padding : 10,
        paddingTop : 0,
        width : "100%"
    },
    cardTopicBody : {
        flexDirection : "row",
        padding : 10,
        width : "100%"
    },
    avatarStyle : {
        height : 45,
        width : 45,
        borderRadius : 22.5,
        marginRight : 5
    },
    input: {
      height: 45,
      width: "71%",
      color: "#000",
      paddingHorizontal: 10,
      borderWidth: 0.3,
      borderColor: "#e5e5e5",
      borderRadius: 10,
      marginRight : 5
    },
    iconContainer : {
        width : 45,
        height : 45,
        alignContent : "center",
        justifyContent : "center",
        alignItems : "center",
        borderRadius : 10,
        borderWidth : 0.5,
        borderColor : "#333333",
        backgroundColor : "rgba(0,0,0,0.1)"
    },
    desText : {
        fontFamily : "Roboto",
        color : "#fff",
        fontSize : 16,
        fontWeight : "bold"
    },
    desData : {
        color : "#fff"
    }
});

export default SendIncidentStyles;