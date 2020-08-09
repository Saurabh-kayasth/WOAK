import firebase from "react-native-firebase";

class Backend {
    uid = '';
    messagesRef = null;
    constructor() {
        if(!firebase.apps.length)
    {
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
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                alert(user);
                this.setUid(user.uid);
                alert(user.uid);
            }
            else {
                firebase.auth().signInAnonymously().catch((error) => {
                    // alert(error.message);
                });
            }
        });
    }

    setUid(value){
        this.uid = value;
    }
    getUid(value){
        return this.uid;
    }
    
    loadMessages(callback){
        this.messagesRef = firebase.database().ref('messages');
        this.messagesRef.off();
        const onReceive = (data) => {
            const message = data.val();
            callback({
                _id : data.key,
                text : message.text,
                createdAt : new Date(message.createdAt),
                user : {
                    _id : message.user._id,
                    name : message.user.name
                },
            });
        };
        this.messagesRef.limitToLast(20).on('child_added',onReceive);
    }

    sendMessage(message){
        alert(JSON.stringify(message));
        for(let i=0; i<message.length;i++){
            this.messagesRef.push({
                text : message[i].text,
                user : message[i].user,
                createdAt : firebase.database.ServerValue.TIMESTAMP,
            });
        }
    }

    closeChat() {
        if(this.messagesRef){
            this.messagesRef.off();
        }
    }
}

export default new Backend;
