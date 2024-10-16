import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from "react";
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from "@expo/vector-icons";


SplashScreen.preventAutoHideAsync();

export default function signup() {

  const backgroundImage = require("../assets/backgroundImage.jpg");
  const avatarImage = require("../assets/images/user.png");

  const [getImage, setImage] = useState(avatarImage);

  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getResponse, setResponse] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [loaded, error] = useFonts(
    {
      "Fredoka-Bold": require('../assets/fonts/Fredoka-Bold.ttf'),
      "Fredoka-Light": require('../assets/fonts/Fredoka-Light.ttf'),
      "Fredoka-Medium": require('../assets/fonts/Fredoka-Medium.ttf'),
      "Fredoka-Regular": require('../assets/fonts/Fredoka-Regular.ttf'),
      "Fredoka-SemiBold": require('../assets/fonts/Fredoka-SemiBold.ttf'),
    }
  );

  useEffect(
    () => {

      async function checkUserInAsyncStorage() {
        try {
          let userJson = await AsyncStorage.getItem("user");
          if (userJson != null) {
            router.replace("/home");
            Alert.alert(userJson);
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

      <View style={{ justifyContent: "center", alignItems: "center", alignSelf: "center", width: "100%", height: 200, flexDirection: "row" }}>
        <View style={{ backgroundColor: "rgba(255, 255, 255, 0.5)", flexDirection: "row", justifyContent: "center", alignItems: "center", flex: 1 }}>
          <Text style={stylesheet.appName}>Own Chat</Text>

        </View>
      </View>

      <View style={stylesheet.whiteSheet}>
        <ScrollView><View style={stylesheet.subWhiteSheet}>

          <View style={stylesheet.view1}>
            <Text style={stylesheet.title}>Register</Text>
            <Pressable onPress={
              async () => {
                let result = await ImagePicker.launchImageLibraryAsync(
                  {
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1
                  }
                );

                if (!result.canceled) {
                  setImage(result.assets[0].uri);
                }

              }
            } style={stylesheet.avatar1} >
              <Image source={getImage} style={stylesheet.image1} contentFit={"contain"} />
            </Pressable>

          </View>

          <View >
            <Text style={{ color: 'red', fontSize: 14, fontFamily: "Fredoka-Regular", alignSelf: 'center', marginBottom: 5 }}>{getResponse}</Text>
            <TextInput style={stylesheet.input} placeholder='Enter Mobile Number' keyboardType='phone-pad' maxLength={10} onChangeText={
              (text) => {
                setMobile(text);
              }
            } />

            <TextInput style={stylesheet.input} placeholder='Enter First Name' keyboardType='default' onChangeText={
              (text) => {
                setFirstName(text);
              }
            } />
            <TextInput style={stylesheet.input} placeholder='Enter Last Name' keyboardType='default' onChangeText={
              (text) => {
                setLastName(text);
              }
            } />
            <View style={stylesheet.inputContainer}>
              <TextInput
                style={[stylesheet.input, { paddingRight: 40 }]} // Add padding to avoid overlap with the icon
                placeholder='Enter Password'
                keyboardType='default'
                secureTextEntry={!passwordVisible}
                onChangeText={(text) => setPassword(text)}
                value={getPassword}
              />

              <Pressable
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={stylesheet.eyeIconContainer}  // This will position the icon within the input
              >
                <FontAwesome6
                  name={passwordVisible ? "eye" : "eye-slash"}
                  size={20}
                  color="gray"
                />
              </Pressable>
            </View>

          </View>

          <Pressable style={stylesheet.button} onPress={
            async () => {
              // Alert.alert("Data", getMobile + "" + getFirstName + "" + getLastName + "" + getPassword);

              let formData = new FormData();

              formData.append("mobile", getMobile);
              formData.append("firstName", getFirstName);
              formData.append("lastName", getLastName);
              formData.append("password", getPassword);

              if (getImage != avatarImage) {
                formData.append("avatarImage",
                  {
                    name: "avatar.png",
                    type: "image/png",
                    uri: getImage
                  }
                );
              }

              let response = await fetch(
                process.env.EXPO_PUBLIC_URL_ + "/OwnChat/SignUp",

                {
                  method: "POST",
                  body: formData
                }
              );

              if (response.ok) {
                let json = await response.json();

                if (json.success) {

                  // Alert.alert("Success", json.message);
                  router.replace("/");

                } else {

                  // Alert.alert("Error", json.message);
                  setResponse(json.message);

                }

              }

            }
          }>
            <Text style={{ color: '#fff', fontSize: 20, fontFamily: "Fredoka-SemiBold" }}>Sign Up</Text>
          </Pressable>
          <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
            <Text style={{ color: 'gray', fontSize: 14, fontFamily: "Fredoka-Regular" }}>Already have an account? </Text>
            <Pressable onPress={
              () => {
                router.replace("/");
              }
            }>
              <Text style={{ color: '#ada813', fontSize: 14, fontFamily: "Fredoka-SemiBold" }}> Sign In</Text>
            </Pressable>
          </View>

        </View>
        </ScrollView>
      </View>


    </View>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
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
    columnGap: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
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
  whiteSheet: {
    width: '100%',
    height: '80%',
    position: "absolute",
    bottom: 0,
    backgroundColor: 'black',
    borderTopRightRadius: 90,
    borderBottomLeftRadius: 90,

  },
  subWhiteSheet: {
    padding: 10,
  },
  title: {
    fontSize: 40,
    color: "#469489",
    alignSelf: "center",
    fontFamily: "Fredoka-Regular",
    marginRight: 55
  },
  // title2: {
  //   fontSize: 10,
  //   color: "#469489",
  //   alignItems:"flex-end",
  //   fontFamily: "Fredoka-Regular",
  //   marginRight: 300
  // },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 10,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    fontFamily: "Fredoka-Light",

  },
  button: {
    backgroundColor: '#469489',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,  // Align to the end of the TextInput
    padding: 5,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  // input: {
  //   height: 50,
  //   borderColor: '#ccc',
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   paddingHorizontal: 10,
  //   fontSize: 16,
  // },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,   // Position the icon to the right inside the TextInput
    top: 15,     // Adjust based on icon size and input height
    padding: 5,
  },
  appName: {
    fontSize: 45,
    color: "#469489",
    // alignSelf: "center",
    fontFamily: "Fredoka-SemiBold",
    padding: 15,
    // borderColor:"black"

  },
});
