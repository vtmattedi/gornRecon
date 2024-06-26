import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import styles from '../../assets/Styles/mystyles';
import { CameraType } from 'expo-camera/build/legacy/Camera.types';

const Photo = () => {

    const [facing, setFacing] = React.useState<CameraType>(CameraType.back);
    const toggleCameraFacing = () => {
        setFacing(facing === CameraType.back ? CameraType.front : CameraType.back);
    }
    const takePicture = async () => {

    }
    return (
        <View style={morestyles.container}>
            <Text>Photo Component</Text>
            <CameraView style={morestyles.camera} facing={facing}
            >

                <View style={morestyles.buttonContainer}>
                    <TouchableOpacity style={morestyles.button} onPress={toggleCameraFacing}>
                        <Text style={morestyles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
};

const morestyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default Photo;