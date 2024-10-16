import { LinearGradient } from "expo-linear-gradient";
import { Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";

export default function home() {

    const [getChatArray, setChatArray] = useState([]);
    const [getSearchQuery, setSearchQuery] = useState(''); // State for search query
    const [getFilteredChatArray, setFilteredChatArray] = useState([]); // State for filtered chat data
    const [getSearchVisible, setSearchVisible] = useState(false);

    const [loaded, error] = useFonts(
        {
            "Fredoka-Bold": require("../assets/fonts/Fredoka-Bold.ttf"),
            "Fredoka-Light": require("../assets/fonts/Fredoka-Light.ttf"),
            "Fredoka-Medium": require("../assets/fonts/Fredoka-Medium.ttf"),
            "Fredoka-Regular": require("../assets/fonts/Fredoka-Regular.ttf"),
            "Fredoka-SemiBold": require("../assets/fonts/Fredoka-SemiBold.ttf"),
        }
    );

    const parseDateTime = (dateTimeString) => {
        const [year, month, day, time, period] = dateTimeString.split(/[ ,]+/);

        let [hours, minutes] = time.split(':');

        if (period === 'PM' && hours !== '12') {
            hours = parseInt(hours, 10) + 12;
        } else if (period === 'AM' && hours === '12') {
            hours = '00';
        }

        return new Date(year, month - 1, day, hours, minutes);
    };
    useEffect(
        () => {
            async function fetchData() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                let response = await fetch(process.env.EXPO_PUBLIC_URL_ + "/OwnChat/LoadHomeData?id=" + user.id);


                if (response.ok) {
                    let json = await response.json();
                    // console.log(json);

                    if (json.success) {
                        let chatArray = json.jsonChatArray;

                        chatArray.sort((a, b) => parseDateTime(b.dateTime) - parseDateTime(a.dateTime));
                        // console.log(chatArray);
                        setChatArray(chatArray);
                        //FlashList
                    }
                }

            }

            fetchData();
        }, []
    );


    // Search handler to filter chatArray based on search query
    useEffect(() => {
        const filtered = getChatArray.filter(item =>
            item.other_user_name.toLowerCase().includes(getSearchQuery.toLowerCase())
        );

        filtered.sort((a, b) => parseDateTime(b.dateTime) - parseDateTime(a.dateTime));

        setFilteredChatArray(filtered);
    }, [getSearchQuery, getChatArray]);


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


    const toggleSearchBar = () => {
        setSearchVisible(!getSearchVisible);
    }
    return (
        <View style={stylesheet.view1}>

            <StatusBar
                animated={true}
                translucent={true}
                backgroundColor="transparent"
            />
            <View style={stylesheet.header}>

                <Text style={stylesheet.headerTitle}>OwnChat</Text>
                <View style={{ flexDirection: "row", columnGap: 30 }}>
                    <Pressable onPress={toggleSearchBar}>
                        <FontAwesome6 name={"magnifying-glass"} color={"black"} size={24} />
                    </Pressable>
                    <Pressable onPress={
                        () => {
                            // router.push("/profileUpdate");
                        }
                    }>
                        <FontAwesome6 name={"bars"} color={"black"} size={24} />
                    </Pressable>

                </View>
            </View>
            {getSearchVisible && (
                <View style={{ backgroundColor: "#469489" }}>
                    <TextInput
                        style={stylesheet.searchBar}
                        placeholder="Search..."
                        value={getSearchQuery}
                        onChangeText={setSearchQuery}
                        selectionColor="#469489"
                    />
                </View>

            )}
            {/* <TextInput
                style={stylesheet.searchBar}
                placeholder="Search..."
                value={getSearchQuery}
                onChangeText={setSearchQuery}
            /> */}

            <FlashList

                data={getFilteredChatArray}
                renderItem={
                    ({ item }) =>

                        <Pressable style={stylesheet.view5} onPress={
                            () => {
                                // Alert.alert("View CHat", "User:" + item.other_user_id);

                                router.push(
                                    {
                                        pathname: "/chat",
                                        params: item
                                    }
                                );
                            }
                        }>
                            {/* <View style={stylesheet.avatarContainer} > */}
                            <View style={item.other_user_status == 1 ? stylesheet.view6_2 : stylesheet.view6_1}>
                                {
                                    item.avatar_image_found ?
                                        <Image
                                            style={stylesheet.image1}
                                            contentFit="contain"
                                            source={process.env.EXPO_PUBLIC_URL_ + "/OwnChat/AvatarImages/" + item.other_user_mobile + ".png"} />
                                        :
                                        <Text style={stylesheet.text6}>{item.other_user_avatar_letters}</Text>
                                }

                                <View style={item.other_user_status == 1 ? stylesheet.rightDot : stylesheet.topDot} />
                                {/* Dot on the right */}

                            </View>
                            {/* <View style={stylesheet.avatarContainerOnline}>
                             
                            </View>
                           </View> */}


                            <View style={stylesheet.view4}>
                                <Text style={stylesheet.text1}>{item.other_user_name}</Text>
                                <Text style={stylesheet.text4} numberOfLines={1}>{item.message}</Text>

                                <View style={stylesheet.view7}>
                                    <Text style={stylesheet.text5}>{item.dateTime}</Text>
                                    <FontAwesome6 name={"check-double"} color={item.chat_status_id == 1 ? "green" : "gray"} size={20} />
                                </View>

                            </View>

                        </Pressable>

                }
                estimatedItemSize={200}
            />
            <View style={stylesheet.header}>


                <View style={stylesheet.icons}>
                    <Pressable onPress={
                        () => {
                        router.push("/text")
                        }
                    }>
                        <FontAwesome6 name={"house"} color={"black"} size={24} />
                    </Pressable>
                    <Pressable onPress={
                        () => {
                            router.push("/profile");
                        }
                    }>
                        <FontAwesome6 name={"circle-user"} color={"black"} size={24} />
                    </Pressable>

                </View>
            </View>

        </View>
    );
}

const stylesheet = StyleSheet.create(
    {
        view1: {
            flex: 1,
            // paddingVertical: 60,
            paddingHorizontal: 10,
            backgroundColor: "#F6F7FB",

        },
        searchBar: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingHorizontal: 10,
            borderRadius: 50,
        },
        header: {
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#469489",
            // color: "#469489",
            position: "static",
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
        },
        headerTitle: {
            fontFamily: "Fredoka-SemiBold",
            fontSize: 30,
        },
        view2: {
            flexDirection: "row",
            columnGap: 20,
            padding: 10,
            backgroundColor: "#5dade2",
            borderBottomColor: "black",
            borderBottomWidth: 2,
            borderRadius: 10,
        },
        view3: {
            width: 80,
            height: 80,
            backgroundColor: "white",
            borderRadius: 40,
        },
        view4: {
            flex: 1,
            // backgroundColor:"yellow",
        },
        text1: {
            fontFamily: "Fredoka-Bold",
            fontSize: 22,
        },
        text2: {
            fontFamily: "Fredoka-Regular",
            fontSize: 16,
        },
        text3: {
            fontFamily: "Fredoka-Regular",
            fontSize: 14,
            alignSelf: "flex-end",
        },
        view5: {
            flexDirection: "row",
            marginVertical: 10,
            columnGap: 20,
        },
        view6_1: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "white",
            borderStyle: "solid",
            borderWidth: 5,
            borderColor: "gray",
            justifyContent: "center",
            alignItems: "center"
        },
        view6_2: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "white",
            borderStyle: "solid",
            borderWidth: 5,
            borderColor: "#469489",
            justifyContent: "center",
            alignItems: "center"
        },
        text4: {
            fontFamily: "Fredoka-Regular",
            fontSize: 20,
            // overflow:"hidden",
            // height:24,
        },
        text5: {
            fontFamily: "Fredoka-Regular",
            fontSize: 14,
            alignSelf: "flex-end",
        },
        text6: {
            fontFamily: "Fredoka-Bold",
            fontSize: 24,
        },
        scrollview1: {
            marginTop: 20,

        },
        view7: {
            flexDirection: "row",
            columnGap: 20,
            alignSelf: "flex-end",
            alignItems: "center",
        },
        //35
        image1: {
            width: 70,
            height: 70,
            borderRadius: 40,
            // backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center"
        },
        icons: {
            flexDirection: "row",
            columnGap: 30,
            alignSelf: "center",
            //  justifyContent: "center",
            alignSelf: "flex-end",
            marginLeft: "40%",
            marginRight: "40%",
        },
        topDot: {
            position: "absolute",
            top: 15,
            // Place the dot slightly above the border
            left: "100%",
            transform: [{ translateX: -5 }], // Center the dot horizontally
            width: 15,
            height: 15,
            borderRadius: 10,
            backgroundColor: "gray", // Default color, change dynamically
        },
        rightDot: {
            position: "absolute",
            top: 15,
            // Place the dot slightly above the border
            left: "100%",
            transform: [{ translateX: -5 }], // Center the dot horizontally
            width: 15,
            height: 15,
            borderRadius: 10,
            backgroundColor: "#469489", // Default color, change dynamically
        },
    }
);