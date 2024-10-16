import {  useLocalSearchParams } from "expo-router";
import { View, Button, StyleSheet , Text } from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";

export default function text2(){


    const {name, age} = useLocalSearchParams();

    useEffect (
        ()=>{
            console.log(name);
            console.log(age);
        }
    );

    return(
        <View style={stylesheet.view1}>
            <Text>Text 2</Text>
            <Text>{name}</Text>
            <Text>{age}</Text>
        </View>
    );
}

const stylesheet = StyleSheet.create(
    {
        view1:{
          flex:1,
          backgroundColor:"yellow",
          padding:20,
          rowGap:20
        }
    }
);