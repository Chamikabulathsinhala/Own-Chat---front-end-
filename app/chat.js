import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const backgroundImage = require("../assets/backgroundImage.jpg");
export default function chat() {

    //get parameter
    const item = useLocalSearchParams();
    // console.log(item.other_user_id);


    //store chat array
    const [getChatArray, setChatArray] = useState([]);

    const [getChatText, setChatText] = useState([]);


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
            if (loaded || error) {
                SplashScreen.hideAsync();
            }
        }, [loaded, error]
    );

    //fetch chat array from server
    useEffect(
        () => {

            let intervalId;
            async function fetchChatArray() {
                try {
                    let userJson = await AsyncStorage.getItem("user");
                    let user = JSON.parse(userJson);

                    if (user) {
                        let response = await fetch(
                            process.env.EXPO_PUBLIC_URL_ +
                            "/OwnChat/LoadChat?logged_user_id=" +
                            user.id +
                            "&other_user_id=" +
                            item.other_user_id
                        );

                        if (response.ok) {
                            let ChatArray = await response.json();
                            setChatArray(ChatArray);
                        }
                    } else {
                        // If user is null, stop the interval and do nothing
                        clearInterval(intervalId);
                    }
                } catch (error) {
                    console.log("Error fetching chat:", error);
                }

                // let userJson = await AsyncStorage.getItem("user");

                // let user = JSON.parse(userJson); 
                // // console.log(user.id);

                // let response = await fetch(process.env.EXPO_PUBLIC_URL_+"/OwnChat/LoadChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id);
                // if (response.ok) {
                //     //console.log("aaaaaaaa");
                //     let chatArray = await response.json();
                //     //console.log(chatArray);
                //     setChatArray(chatArray);
                // }
            }
            fetchChatArray();

            setInterval(() => {
                fetchChatArray();
            }, 5000);
            return () => {
                clearInterval(intervalId);
            };

        }, []
    );

    if (!loaded && !error) {
        return null;
    }

    return (

        <SafeAreaView style={stylesheet.view1}>
            <StatusBar hidden={false} />
            {/* <Image source={backgroundImage} style={stylesheet.backgroundImage} /> */}

            <View style={stylesheet.view2}>
                <View style={stylesheet.view3}>
                    {
                        item.avatar_image_found == "true"
                            ? <Image style={stylesheet.image1}
                                source={process.env.EXPO_PUBLIC_URL_ + "/OwnChat/AvatarImages/" + item.other_user_mobile + ".png"}
                                contentFit={"contain"} />
                            : <Text style={stylesheet.text1}>{item.other_user_avatar_letters}</Text>
                    }


                </View>
                <View style={stylesheet.view4}>
                    <Text style={stylesheet.text2}>{item.other_user_name}</Text>
                    <Text style={stylesheet.text3}>{item.other_user_status == 1 ? "Online" : "Offline"}</Text>
                </View>
            </View>

            <View style={stylesheet.center_view}>

                <FlashList

                    data={getChatArray}
                    renderItem={
                        ({ item }) =>

                            <View style={item.side == "right" ? stylesheet.view5_1 : stylesheet.view5_2}>
                                <Text style={stylesheet.text3}>{item.message}</Text>
                                <View style={stylesheet.view6}>
                                    <Text style={stylesheet.text4}>{item.datetime}</Text>
                                    {
                                        item.side == "right" ?
                                            <FontAwesome6 name={"check-double"} color={item.status == 1 ? "green" : "gray"} size={18} />
                                            :
                                            null
                                    }
                                </View>
                            </View>

                    }
                    estimatedItemSize={200}

                />

            </View>

            <View style={stylesheet.view7}>
                <Pressable style={stylesheet.pressable1}>
                    <FontAwesome6 name={"microphone"} color={"white"} size={18} />
                </Pressable>
                <TextInput style={stylesheet.input1} placeholder='message' value={getChatText} onChangeText={
                    (text) => {
                        setChatText(text);
                    }
                }
                />
                <Pressable style={stylesheet.pressable1} onPress={
                    async () => {
                        // Alert.alert("hi");

                        if (getChatText.length == 0) {
                            Alert.alert("Error", "Please enter your message");
                        } else {
                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);

                            let response = await fetch(process.env.EXPO_PUBLIC_URL_ + "/OwnChat/SendChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id + "&message=" + getChatText);

                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    console.log("Message Sent");
                                    setChatText("");
                                }
                            }
                        }
                    }
                }>
                    {/* <FontAwesome6 name={"paper-plane"} color={"white"} size={18} /> */}
                    <Text style={stylesheet.send}>Send</Text>
                </Pressable>
                <Pressable style={stylesheet.pressable1}>
                    <FontAwesome6 name={"face-laugh-wink"} color={"white"} size={18} />
                </Pressable>
            </View>

        </SafeAreaView>
    );
}

const stylesheet = StyleSheet.create(
    {
        view1: {
            flex: 1,
            // backgroundColor: "white",
        },
        view2: {
            // backgroundColor: "yellow",
            // marginTop: 20,
            paddingHorizontal: 20,
            flexDirection: "row",
            // columnGap: 20,
            justifyContent: "flex-start",
            alignItems: "flex-start",
            backgroundColor: "#469489",
            padding: 8,
        },
        view3: {
            backgroundColor: "white",
            width: 50,
            height: 50,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            borderStyle: "solid",
            borderColor: "#388cd6",
            borderWidth: 2,

        },
        backgroundImage: {
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
        },
        image1: {
            width: 40,
            height: 40,
            borderRadius: 40,
            // backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            // padding: 100,
        },
        text1: {
            fontSize: 35,
            fontFamily: "Fredoka-Bold",
            color: "#388cd6"
            // backgroundColor:"black"

        },
        view4: {
            rowGap: 4,
            padding: 5
        },
        text2: {
            fontSize: 20,
            fontFamily: "Fredoka-Bold"
        },
        text3: {
            fontSize: 16,
            fontFamily: "Fredoka-SemiBold"
        },
        view5_1: {
            backgroundColor: "#348a7d",
            borderRadius: 10,
            marginHorizontal: 20,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignSelf: "flex-end",
            rowGap: 5,
            width: "auto",

        },
        view5_2: {
            backgroundColor: "#ada813",
            borderRadius: 10,
            marginHorizontal: 20,
            marginVertical: 5,
            padding: 10,
            justifyContent: "center",
            alignSelf: "flex-start",
            rowGap: 5,
            width: "auto",

        },
        view6: {
            flexDirection: "row",
            columnGap: 10,
        },
        text4: {
            fontSize: 12,
            fontFamily: "Fredoka-Regular"
        },
        view7: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            columnGap: 10,
            paddingHorizontal: 5,
            margin: 10,
        },
        input1: {
            height: 30,
            // width:100,
            borderRadius: 10,
            borderStyle: "solid",
            borderWidth: 2,
            fontFamily: "Fredoka-Regular",
            fontSize: 20,
            flex: 1,
            paddingStart: 10,
            paddingEnd: 10,
        },
        pressable1: {
            backgroundColor: "black",
            borderRadius: 20,
            padding: 10,
            justifyContent: "center",
            alignItems: "center"
        },
        center_view: {
            flex: 1,
            marginVertical: 20
        },
        send: {
            color: "white",
        }
    }
)