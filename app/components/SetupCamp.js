import React, { Component } from "react";
import {
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    View,
    Text,
    Image
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from 'react-native-image-picker';
import firebase from "react-native-firebase";
import Spinner from "react-native-loading-spinner-overlay";

class SetupCamp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            camp_name: null,
            camp_location: null,
            camp_product: null,
            product_names: "",
            products: [],
            product_visible: false,
            loading: false,
            avatar_selected: true,
            display_avatar: "https://firebasestorage.googleapis.com/v0/b/woak-cda27.appspot.com/o/assets%2Frescue.jpg?alt=media&token=affd5df1-e5b0-4c22-9ef9-f48fcccca289"
        }

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
        console.log(this.props.alertId);
        this.campRef = this.getRef().child("camps");
    }

    componentDidMount() {

    }

    onSentPress = () => {
        if (this.state.avatar_selected) {
            this.sentWithAvatar(this.state.display_avatar);
        }
        else {
            this.setupCamp(this.state.avatarSource);
        }
    }

    sentWithAvatar = (uri) => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                var camp_id = this.campRef.push().key;
                this.getRef()
                    .child("camps/" + this.props.alertId + '/' + camp_id)
                    .set({
                        camp_id: camp_id,
                        camp_name: this.state.camp_name,
                        camp_location: this.state.camp_location,
                        camp_picture: uri,
                        products: this.state.products
                    });
                this.setState({
                    loading: false,
                });
                alert("The setup has been done!");
            }
        });
    }

    setupCamp = async uri => {
        this.setState({
            loading : true
        })
        try {
            var camp_id = this.campRef.push().key;
            const ref = firebase
                .storage()
                .ref('avatar')
                .child(camp_id);
            const task = ref.putFile(uri.uri);

            return new Promise((resolve, reject) => {
                task.on('state_changed',
                    (snapshot) => {
                    },
                    (error) => {
                    },
                    () => {
                        ref.getDownloadURL().then(url => {
                            this.setState({
                                display_avatar: url,
                                loading: true
                            });
                            firebase.auth().onAuthStateChanged(user => {
                                if (user) {
                                    this.getRef()
                                        .child("camps/" + this.props.alertId + '/' + camp_id)
                                        .set({
                                            camp_id: camp_id,
                                            camp_name: this.state.camp_name,
                                            camp_location: this.state.camp_location,
                                            camp_picture: this.state.display_avatar,
                                            products: this.state.products
                                        });
                                    this.setState({
                                        loading: false,
                                    });
                                    alert("The setup has been done!");
                                }
                            });
                        });

                    }
                );

            });
        } catch (err) {
            console.log('uploadImage try/catch error: ' + err.message);
        }
    }

    getRef() {
        return firebase.database().ref();
    }

    addProduct = () => {
        this.state.products.push(this.state.camp_product);
        this.setState({
            product_visible: true,
            product_names: this.state.product_names + '  ' + this.state.camp_product
        });
    }

    pickImage = () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.path.toString() };
                const displaySource = { uri: response.uri }
                this.setState({
                    avatarSource: source,
                    display_avatar: displaySource.uri,
                    avatar_selected: false
                });
            }
        });
    }

    render() {
        return (
            <View style={Styles.container}>
                <View style={Styles.cardContainer}>
                    <View style={{ height: 220, width: "100%", backgroundColor: "#2b2b39", borderRadius: 10, marginBottom: 20, elevation: 20 }}>
                        <Image
                            style={{ height: 220, width: "100%", borderRadius: 10 }}
                            source={{ uri: this.state.display_avatar }}
                        />
                        <View style={Styles.overlay}>

                        </View>
                        <TouchableOpacity style={Styles.avatarOverlay}>
                            <TouchableOpacity style={Styles.cameraCover} onPress={() => this.pickImage()}>
                                <Icon name="ios-camera" size={40} color="#fff" />
                            </TouchableOpacity>

                        </TouchableOpacity>
                    </View>
                    <TextInput
                        placeholder="Type Camp Name..."
                        placeholderTextColor="gray"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={Styles.input}
                        value={this.state.camp_name}
                        onChangeText={camp_name => this.setState({ camp_name })}
                    />
                    <TextInput
                        placeholder="Type Camp Location..."
                        placeholderTextColor="gray"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={Styles.input}
                        value={this.state.camp_location}
                        onChangeText={camp_location => this.setState({ camp_location })}
                    />
                    <View style={Styles.product}>
                        <TextInput
                            placeholder="Type Product Name..."
                            placeholderTextColor="gray"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={[Styles.input, { width: "78%" }]}
                            value={this.state.camp_product}
                            onChangeText={camp_product => this.setState({ camp_product })}
                        />
                        <TouchableOpacity style={Styles.addBtn} onPress={() => this.addProduct()}>
                            <Text style={Styles.addBtnText}>Add +</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.product_visible ?
                            <View style={{ padding: 5, paddingLeft: 0, paddingRight: 0, marginBottom: 5 }}>
                                <Text style={{ color: "#fff" }}>{this.state.product_names}</Text>
                            </View>
                            :
                            null
                    }
                    <TouchableOpacity
                        style={Styles.buttonContainer}
                        onPress={() => this.onSentPress()}
                    >
                        <Text style={Styles.buttonText}>Add Camp</Text>
                    </TouchableOpacity>
                </View>
                <Spinner visible={this.state.loading} />
            </View>
        )
    }
}

export default SetupCamp;

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#333333"
    },
    cardContainer: {
        width: "90%",
        padding: 20,
        margin: 20,
        borderRadius: 10,
        borderWidth: 0,
        borderColor: "gray",
        backgroundColor: "#191919",
        elevation: 5
    },
    avatarConatiner: {
        flexDirection: "row",
        backgroundColor: "#2b2b39",
        elevation: 5,
        borderRadius: 10,
        borderWidth: 0.5,
        marginBottom: 5,
        width: "100%",
        height: 75,
        borderColor: "#7f7f88",
        padding: 5,
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: "center",
        borderTopWidth: 0,
        borderBottomWidth: 0
    },
    cameraCover: {
        height: 60,
        width: 60,
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 30
    },
    avatarOverlay: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        // backgroundColor:"rgba(0,0,0,0.4)",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center"
    },
    avatarUser: {
        height: 50,
        width: 70,
        borderRadius: 5,
        elevation: 5
    },
    logoContainer: {
        alignItems: "center",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        width: 200,
        height: 200
    },
    input: {
        height: 40,
        marginBottom: 10,
        // backgroundColor: "rgba(255,255,255,0.2)",
        color: "#fff",
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderColor: "gray",
        borderRadius: 10
    },
    buttonContainer: {
        backgroundColor: "#333333",
        paddingVertical: 15,
        borderWidth: 0.2,
        borderColor: "white",
        borderRadius: 10,
        elevation: 5
    },
    buttonText: {
        textAlign: "center",
        color: "#FFF",
        fontWeight: "700"
    },
    header: {
        zIndex: -1,
        height: 60,
        width: "100%",
        paddingLeft: 55,
        justifyContent: "center",
        elevation: 10,
    },
    headerText: {
        fontSize: 25,
        color: "#fff"
    },
    createTeamContainer: {
        width: "90%",
        padding: 20,
        margin: 20,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: "#40404c",
        elevation: 5
    },
    product: {
        flexDirection: "row"
    },
    addBtn: {
        width: "20%",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "#333333",
        height: 40,
        marginLeft: 7,
        borderRadius: 10,
        borderWidth: 0.2,
        borderColor: "#fff"
    },
    addBtnText: {
        fontSize: 16,
        color: "#fff"
    },
    overlay: {
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)"
    }
})