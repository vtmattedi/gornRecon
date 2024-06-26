import React, { useEffect, useState, useRef } from 'react';
import { Image } from 'react-native';
import { View, TouchableOpacity, Text } from 'react-native';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
 
const windowSize = Math.round(Dimensions.get('window').width) * 0.9;

const InfoModal = ({ image, infoData, onClose }) => {

    const [fontsLoaded, fontError] = useFonts({
        'FontAwesome': require('./fonts/fa6-free-solid.otf'),
        'Inter': require('./fonts/Inter-variable.ttf'),
    });
    console.log(infoData);
    const info = JSON.parse(infoData);

    const parsedInfo = "Lati: " + info.latitude + "\n" + "Long: " + info.longitude + "\n" + "Altitude: " + info.altitude + "\n" + "Date: " + info.date + "\n" + "Author: " + info.author;


    return (
        fontsLoaded &&
        <View style={styles.centeredView}>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => {
                        onClose();
                    }} >
                    <Text style={{
                        fontFamily: 'FontAwesome',
                    }}>{'\uF177' + " BACK"} </Text>
                </TouchableOpacity>
                <Text style={styles.title}>{image.split("/").pop()}</Text>
            </View> 
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {/* <Text style={styles.title}>{image.split("/").pop()}</Text> */}
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',

            }}>
                <Image source={{uri: image}}  style={{ width: windowSize, height: windowSize }}/>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',

            }}>
                <Text style={styles.phrase}>{parsedInfo}</Text>
            </View>


        </View>
    );
};

export default InfoModal;

const styles = ({
    centeredView: {
        flexdirection: 'column',
        justifyContent: 'center',

    },
    phrase:
    {
        fontSize: 20,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        textAlign: 'justify',
    },
    buttons:
    {
        backgroundColor: 'lightblue',
        padding: 10,
        margin: 10,
        borderRadius: 10,
        width: 100,
        alignItems: 'center',
    },
    buttonsContainer:
    {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    title:
    {
        fontFamily: 'Inter',
        fontSize: 22,

    }

}
)