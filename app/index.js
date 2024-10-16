import { StatusBar } from "expo-status-bar";
import { Alert, Button, Pressable, StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';


const backgroundImage = require("../assets/backgroundImage.jpg");
const avatarImage = require("../assets/images/user.png");

SplashScreen.preventAutoHideAsync();

export default function signin() {
    const [getMobile, setMobile] = useState("");
    const [getPassword, setPassword] = useState("");
    const [getName, setName] = useState("");
    const [getResponse, setResponse] = useState("");

    const [loaded, error] = useFonts(
        {
            "Fredoka-Bold": require("../assets/fonts/Fredoka-Bold.ttf"),
            "Fredoka-Light": require("../assets/fonts/Fredoka-Light.ttf"),
            "Fredoka-Medium": require("../assets/fonts/Fredoka-Medium.ttf"),
            "Fredoka-Regular": require("../assets/fonts/Fredoka-Regular.ttf"),
            "Fredoka-SemiBold": require("../assets/fonts/Fredoka-SemiBold.ttf"),

        }
    );
    useEffect(
        () => {
    
          async function checkUserInAsyncStorage() {
            try {
              let userJson = await AsyncStorage.getItem("user");
              if (userJson != null) {
                router.replace("/home");
                // Alert.alert(userJson);
              }
            } catch (e) {
              console.log(e);
            }
          }
          checkUserInAsyncStorage();
        }, []
      );
    useEffect(
        () => {
            if (loaded || error) {
                SplashScreen.hideAsync();
            }
        }, [loaded, error]
    );
    if (!loaded && !error) {
        return null;
    }
    return (


        <View style={stylesheet.container}>

            <StatusBar
                animated={true}
                translucent={true}
                backgroundColor="transparent"
            />


            <Image source={backgroundImage} style={stylesheet.backgroundImage} />

            
            <View style={stylesheet.whiteSheet}>
                <View style={stylesheet.subWhiteSheet}>
                    <ScrollView>
                    <View style={stylesheet.view1}>
                        <Text style={stylesheet.title}>Log In</Text>


                        {/* <View style={stylesheet.image1} >
                            <Image source={avatarImage}  contentFit={"contain"} />
                            <Text style={stylesheet.textLetters}>{getName}</Text>
                        </View> */}

                        <View style={stylesheet.image1}>
                            {
                                getName == ""?
                                <Image source={avatarImage} style={stylesheet.image1} contentFit={"contain"} />
                                :
                                <Text style={stylesheet.textLetters}>{getName}</Text>
                            }
                        </View>

                    </View>
                    <View>
                        <Text style={{ color: "red", fontSize: 14, fontFamily: "Fredoka-Regular", alignSelf: "center", marginBottom: 5 }}>{getResponse}</Text>
                        <TextInput style={stylesheet.input} placeholder="Enter Mobile Number" keyboardType="phone-pad" maxLength={10} onChangeText={
                            (text) => {
                                setMobile(text)
                            }
                        } onEndEditing={
                            async () => {
                                if (getMobile.length == 10) {
                                    //Alert.alert(getMobile);

                                    let response = await fetch(process.env.EXPO_PUBLIC_URL_+"/OwnChat/GetLetters?mobile=" + getMobile);

                                    if (response.ok) {
                                        let json = await response.json();
                                        setName(json.letters);
                                    }

                                }
                            }
                        } />
                        <TextInput style={stylesheet.input} placeholder="Enter Your Password" keyboardType="default" secureTextEntry={true} onChangeText={
                            (text) => {
                                setPassword(text);
                            }
                        } />
                    </View>

                    <Pressable style={stylesheet.button} onPress={
                        async () => {
                            // Alert.alert("Data", getMobile + "" + getPassword);

                            // let formData = new FormData();

                            // formData.append("mobile", getMobile);
                            // formData.append("password", getPassword);

                            let response = await fetch(
                                process.env.EXPO_PUBLIC_URL_+"/OwnChat/SignIn",

                                {
                                    method: "POST",
                                    body: JSON.stringify(
                                        {
                                            mobile: getMobile,
                                            password: getPassword,
                                        }
                                    ),
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }
                            );
                            if (response.ok) {
                                let json = await response.json();
                               // Alert.alert("Response", json.message);

                                if (json.success) {


                                    let user = json.user;
                                    //Alert.alert("Success", "Hi " + user.first_name + ", " + json.last_name);

                                    try {

                                        await AsyncStorage.setItem("user", JSON.stringify(user));
                                    

                                        router.replace("/home");


                                    } catch (e) {

                                        Alert.alert("Error", "Something went wrong");

                                    }

                                } else {
                                    //problem occured
                                    // Alert.alert("Error", json.message);
                                    setResponse(json.message);

                                }

                            }
                        }
                    }>

                        <Text style={{ color: "#fff", fontSize: 20, fontFamily: "Fredoka-SemiBold" }}> Log In</Text>
                    </Pressable>

                    
                    <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center", alignSelf: "center" }}>
                        <Text style={{ color: "gray", fontSize: 14, fontFamily: "Fredoka-Regular" }}>Don't have any account yet? </Text>
                        <Pressable onPress={
                            () => {
                                router.replace("/signup");
                            }
                        }>
                            <Text style={{ color: "#ada813", fontSize: 14, fontFamily: "Fredoka-SemiBold" }}> Register Now</Text>
                        </Pressable>
                    </View>
                    </ScrollView>
                </View>
            </View>
        </View>

    );
}

const stylesheet = StyleSheet.create({
    container: {
        flex: 1,

    },
    avatar1: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },
    input1: {
        width: "100%",
        height: 50,
        borderStyle: "solid",
        borderWidth: 2,
        borderRadius: 15,
        paddingStart: 10
    },
    backgroundImage: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
    },
    view1: {
        flexDirection: "row",
        columnGap: 20,
        marginBottom: 55,
        alignItems: "center",
    },
    image1: {
        width: 150,
        height: 150,
        borderStyle: "solid",
        borderColor: "#ada813",
        borderWidth: 5,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    whiteSheet: {
        width: "100%",
        height: "80%",
        position: "absolute",
        bottom: 0,
        backgroundColor: "black",
        borderTopRightRadius: 90,
        borderBottomLeftRadius: 90,
    },
    subWhiteSheet: {
        padding: 32
    },
    title: {
        fontSize: 40,
        color: "#469489",
        alignSelf: "center",
        fontFamily: "Fredoka-Regular",
        marginRight: 40
    },
    input: {
        backgroundColor: "#F6F7FB",
        height: 58,
        marginBottom: 25,
        fontSize: 16,
        borderRadius: 10,
        padding: 12,
        fontFamily: "Fredoka-Light",

    },
    button: {
        backgroundColor: "#469489",
        height: 58,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },
    textLetters: {
        fontSize: 60,
        fontFamily: "Fredoka-Bold",
        color: "#388cd6"
    },
    appName: {
        fontSize: 45,
        color: "#469489",
        // alignSelf: "center",
        fontFamily: "Fredoka-SemiBold",
        padding: 15,
    
      },
});