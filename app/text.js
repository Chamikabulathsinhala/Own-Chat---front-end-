import { View, StyleSheet, Button, Alert, Text, TextInput } from "react-native";
import { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
//import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";

export default function text() {

    const [getUseState, setUseState] = useState([]);

    const [getTextInput, setTextInput] = useState();

    const [getData, setData] = useState();
    useEffect(
        () => {
            function useEffectFunction() {
                setUseState(["Sahan", "chamika", "Gemdi"]);

                //    let name = getUseState()
            }
            useEffectFunction();
        }, []
    );

    useEffect(
        ()=>{
           async function setAsyncStorage(){
                const dataArray = ["shaan","chamika"];

                await AsyncStorage.setItem("item 1","Data 1");
                await AsyncStorage.setItem("item 2",JSON.stringify(dataArray));
                await AsyncStorage.setItem("item 3","Data 3");
            }
            setAsyncStorage();
        },[]
    );
    useEffect(
        ()=>{
            async function getAsyncStorage(){
                let data = await AsyncStorage.getItem("item 3");
                console.log(data);
            }
            getAsyncStorage();
        },[]
        
    );
    useEffect(
        ()=>{
            async function DeleteAsyncStorage(){
                await AsyncStorage.removeItem("item 3")
                let data2 = await AsyncStorage.getItem("item 3");
                console.log(data2);
            }
            DeleteAsyncStorage();
        },[]
        
    );

    useEffect(
        ()=>{
            function FlashList(){
            const FlashList = ["data 1","data 2","data 3"];
            setData(FlashList);
            }
            FlashList();
        },[]
    );
    return (


        <View style={stylesheet.view1}>

           
               <Button title="title" onPress={
                () => {
                    Alert.alert("success", "ok");//alert
                }

            } />
            <Text>{getUseState}</Text>
            <TextInput style={stylesheet.input1} onChangeText={
                (text) => {
                    setTextInput(text);
                    //console.log(setTextInput);
                }
            } />
            <Text style={stylesheet.text1}>{getTextInput}</Text>

            {/* <Button title="router" onPress={
                ()=>{
                    router.push("/text2");
                }
            }/> */}
            <Button title="router-param pass" onPress={
                ()=>{
                    router.push({
                        pathname : "/text2",
                        params: { name:"chamika", age:"23" }
                       
                    });
                     console.log("ok");
                }
            }
            
            /> 
            <FlashList data={getData} renderItem={
                ({item})=>(
                    <View style={stylesheet.view2}>
                        <Text style={stylesheet.text1}>{item}</Text>
                    </View>
                )
            }
            estimatedItemSize={200}
            />
            {/* <FlashList
                data={getData}
                renderItem={
                    ({ item }) => (
                        <View style={{ height: 40, width: 400 }}>
                            <Text>{item}</Text>
                        </View>
                    )
                }

                estimatedItemSize={200}
            /> */}

            <Button title="get Req" onPress={
                ()=>{
                    fetch(
                        process.env.EXPO_PUBLIC_URL_ + "/OwnChat/Test?name=Sahan"
                    );
                }
            }/>

           <Button title="post req" onPress={
            ()=>{
                let formData = new formData();
                formData.append("fname","Sahan");
                formData.append("lname","Pahan");

                fetch(
                    process.env.EXPO_PUBLIC_URL_ + "/OwnChat/Test",
                    {
                        method:"POST",
                        body: formData,
                    }
                );
            }
           }/>

            <StatusBar hidden={false} backgroundColor={"red"} />
            
        </View>


    );
}


const stylesheet = StyleSheet.create(
    {
        view1: {
            flex: 1,
            backgroundColor: "yellow",
            padding: 20,
            rowGap: 20,
        },
        input1: {
            width: "100%",
            backgroundColor: "white",
            borderRadius: 10,
            paddingStart: 10,
        },
        text1: {
            backgroundColor: "black",
            color: "white",
            height: 20,
            borderRadius: 30,
            paddingStart: 10,
        },
        view2: {
            height:"100%",
            width:"100%",
            backgroundColor: "green",
            padding: 20,
            rowGap: 20,
        },
    }
);