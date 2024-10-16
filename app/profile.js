import { View, StyleSheet, Text, SafeAreaView, Pressable, TextInput, ScrollView, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Image } from 'expo-image';
import { FontAwesome6 } from "@expo/vector-icons";
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';

SplashScreen.preventAutoHideAsync();

export default function profile() {

    const avatarImage = require("../assets/images/user.png");

    const [getImage, setImage] = useState("");
    const [imageExists, setImageExists] = useState(false);

    const [getUserId, setUserId] = useState();
    const [getFirstName, setFirstName] = useState();
    const [getLastName, setLastName] = useState();
    const [getMobile, setMobile] = useState();
    const [getPassword, setPassword] = useState();

    const [getResponse, setResponse] = useState();

    const defaultImageUrl = `${process.env.EXPO_PUBLIC_URL_}/OwnChat/AvatarImages/${getMobile}.png`;
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loaded, error] = useFonts({
        "Fredoka-Bold": require("../assets/fonts/Fredoka-Bold.ttf"),
        "Fredoka-Light": require("../assets/fonts/Fredoka-Light.ttf"),
        "Fredoka-Medium": require("../assets/fonts/Fredoka-Medium.ttf"),
        "Fredoka-Regular": require("../assets/fonts/Fredoka-Regular.ttf"),
        "Fredoka-SemiBold": require("../assets/fonts/Fredoka-SemiBold.ttf"),
    });

    useEffect(() => {
        const checkImageExists = async () => {
            try {
                const response = await fetch(defaultImageUrl);
                setImageExists(response.ok);
            } catch (error) {
                setImageExists(false);
            }
        };

        checkImageExists();
    }, [getMobile]);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    useEffect(() => {
        async function checkUserInAsyncStorage() {
            let userJson = await AsyncStorage.getItem("user");
            let user = JSON.parse(userJson);
            if (user) {
                setUserId(user.id);
                setFirstName(user.first_name);
                setLastName(user.last_name);
                setMobile(user.mobile);
                setPassword(user.password);
            } else {
                router.replace("/welcome");
            }
        }
        checkUserInAsyncStorage();
    }, []);

    async function profileUpdate() {
        console.log(getMobile, getFirstName, getLastName, getPassword);

        let formData = new FormData();
        formData.append("mobile", getMobile);
        formData.append("firstName", getFirstName);
        formData.append("lastName", getLastName);
        formData.append("password", getPassword);

        if (getImage) {
            formData.append("avatarImage", {
                name: "avatar.png",
                type: "image/png",
                uri: getImage,
            });
        }

        try {
            let response = await fetch(
                process.env.EXPO_PUBLIC_URL_ + "/OwnChat/UserUpdate",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                let json = await response.json();
                console.log(json);
                if (json.success) {
                    Alert.alert("Success", json.message);

                    let updatedUser = {
                        id: getUserId,
                        first_name: getFirstName,
                        last_name: getLastName,
                        mobile: getMobile,
                        password: getPassword,
                    };
                    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

                    const updatedImageUrl = `${process.env.EXPO_PUBLIC_URL_}/OwnChat/AvatarImages/${getMobile}.png?timestamp=${new Date().getTime()}`;
                    setImage(updatedImageUrl);
                } else {
                    setResponse(json.message);
                }
            } else {
                console.log("Error in response: ", await response.text());
            }
        } catch (error) {
            Alert.alert("Error", "There was an issue with the update process. Please try again.");
            console.log("Error:", error.message);
        }
    }

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <SafeAreaView style={stylesheet.container}>
            <StatusBar hidden={false} />

            <View style={stylesheet.view1}>
                <Pressable style={stylesheet.pressable} onPress={
                    ()=>{
                        router.push("/home");
                    }
                }>
                    <FontAwesome6 name={"arrow-left"} color={"black"} size={18} style={stylesheet.icon} />
                    <Text style={stylesheet.text1}>Profile</Text>
                    {/* <Text style={stylesheet.text1}>Profile</Text>
                    <FontAwesome6 name={"magnifying-glass"} color={"black"} size={18} /> */}
                </Pressable>
                
            </View>
            <ScrollView>
                <Pressable style={stylesheet.avatar1} onPress={handleImagePick}>
                    {getImage ? (
                        <Image style={stylesheet.image1} contentFit="fit" source={{ uri: getImage }} />
                    ) : imageExists ? (
                        <Image style={stylesheet.image1} contentFit="fit" source={{ uri: `${defaultImageUrl}?timestamp=${new Date().getTime()}` }} />
                        //<FontAwesome6 name={"user"} color={"white"} size={50}/>
                    ) : (
                        <FontAwesome6 name={"user"} color={"white"} size={50} />
                        //<Image style={stylesheet.image1} contentFit="fit" source={{ uri: `${defaultImageUrl}?timestamp=${new Date().getTime()}` }}/>
                    )}
                    <View style={stylesheet.view5}>
                        <FontAwesome6 name={"camera"} color={"white"} size={30} />
                    </View>
                </Pressable>

                <View style={stylesheet.view2}>
                    <Text style={{ color: 'red', fontSize: 14, fontFamily: "Fredoka-Regular", alignSelf: 'center', marginBottom: 5 }}>{getResponse}</Text>

                    <Text style={stylesheet.text2}>Mobile</Text>
                    <TextInput
                        style={stylesheet.input}
                        keyboardType='phone-pad'
                        maxLength={10}
                        value={getMobile}
                        editable={false}
                    />

                    <Text style={stylesheet.text2}>First Name</Text>
                    <TextInput
                        style={stylesheet.input}
                        keyboardType='default'
                        value={getFirstName}
                        onChangeText={(text) => setFirstName(text)}
                    />

                    <Text style={stylesheet.text2}>Last Name</Text>
                    <TextInput
                        style={stylesheet.input}
                        keyboardType='default'
                        value={getLastName}
                        onChangeText={(text) => setLastName(text)}
                    />

                    <Text style={stylesheet.text2}>Password</Text>
                    <View style={stylesheet.textView}>
                        <TextInput
                            selectionColor="#f57c00"
                            style={[stylesheet.input, { paddingRight: 40 }]}
                            placeholder='Enter Password'
                            keyboardType='default'
                            secureTextEntry={!passwordVisible}
                            value={getPassword}
                            onChangeText={(text) => setPassword(text)}
                        />

                        <Pressable
                            onPress={() => setPasswordVisible(!passwordVisible)}
                            style={stylesheet.eyeIconContainer}
                        >
                            <FontAwesome6
                                name={passwordVisible ? "eye" : "eye-slash"}
                                size={20}
                                color="gray"
                            />
                        </Pressable>
                    </View>
                </View>

                <View style={stylesheet.view2}>
                    <Pressable style={stylesheet.button} onPress={profileUpdate}>
                        <Text style={stylesheet.send}>Save Changes</Text>
                    </Pressable>
                    <Pressable
                        style={stylesheet.button}
                        onPress={async () => {
                            try {

                                let response = await fetch(
                                    process.env.EXPO_PUBLIC_URL_ + "/OwnChat/SignOut?id=" + getUserId

                                );

                                if (response.ok) {
                                    await AsyncStorage.removeItem("user");
                                    router.replace("/welcome");
                                    Alert.alert("Signed Out", "You have signed Out Profile Successfully");
                                }




                            } catch (error) {
                                Alert.alert("Error", "Failed to Sign Out")
                            }

                        }}
                    >
                        <Text style={stylesheet.send}>Sign Out</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const stylesheet = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    view1: {
        backgroundColor: "#469489",
        flexDirection: "row",
        // height:50,
        // alignItems:"center",
        // justifyContent:"center",
        padding: 20,
        columnGap: 10,


    },
    text1: {
        fontFamily: "Fredoka-Regular",
        fontSize: 30,
        flexDirection: "row",
        // marginBottom:20,
    },
    avatar1: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 20,

    },
    image1: {


        width: 150,
        height: 150,
        borderStyle: 'solid',
        borderColor: '#ada813',
        borderWidth: 5,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        backgroundColor: "#F6F7FB",
        height: 58,
        marginBottom: 10,
        fontSize: 16,
        borderRadius: 10,
        padding: 12,
        fontFamily: "Fredoka-Light",

    },
    view2: {
        padding: 20, //now
    },
    button: {
        backgroundColor: "black",
        height: 58,
        borderRadius: 20,
        justifyContent: 'center',
        Color: "#0c0d0d",
        alignItems: 'center',
        marginTop: 30,
        borderStyle: "solid"

    },
    send: {
        color: "white",
        // backgroundColor:"white"
        fontFamily: "Fredoka-SemiBold",
        fontSize: 25,
    },
    view5: {
        position: "absolute",
        backgroundColor: "gray",
        padding: 10,
        borderRadius: 50,
        bottom: 0,
        right: 0
    },
    text2: {
        fontFamily: "Fredoka-SemiBold",
        fontSize: 18
    },

    textView: {
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    eyeIconContainer: {
        position: 'absolute',
        right: 10,  
        padding: 5,
    },
    icon: {
        marginRight: 8, 
    },
    pressable: {
        flexDirection: 'row', // Align items horizontally
        alignItems: 'center',  // Center vertically
        // Other styles as needed
    },

}
);
