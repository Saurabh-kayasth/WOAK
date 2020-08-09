import firebase from "react-native-firebase";



const UserDetails = [];
const getUserDetails = () => {
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


    var friendsRef = getRef().child("friends");
    var items = [];

    friendsRef.on("value", snap => {
        var user = firebase.auth().currentUser;
        snap.forEach(child => {
            try {
                if (child.val().email == user.email) {
                    UserDetails.push({
                        name: child.val().name,
                        name: "saurabh",
                        uid: child.val().uid,
                        email: child.val().email,
                        avt: child.val().avatar,
                        address: child.val().address,
                        contact: child.val().contact
                    });
                }
            } catch (err) {
                console.log(err);
            }
        });
        global.userDetails = UserDetails;
    });
}


const getRef = () => {
    return firebase.database().ref();
}

const Utils = {
    getUserDetails,
    UserDetails
}

export default Utils;
