import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';

const GetStartedScreen = ({ navigation }) => {

    const backgroundImage = require("../assets/backgroundImage.jpg");

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/gif3.gif')} // Replace with your image
        style={styles.image}
      />
      <Text style={styles.title}>Welcome to Own Chat!</Text>
      <Text style={styles.subtitle}>Connect with friends anytime, anywhere.</Text>

      <Pressable 
        style={styles.button}
        onPress={
            () => router.push("/")

        } // Navigate to the SignIn screen
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor:  "#469489",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GetStartedScreen;
