import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import MapView from 'react-native-maps';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ImageMetadata, ImageData } from '../../interfaces';
import { Marker } from 'react-native-maps';



const imgDir = FileSystem.documentDirectory + 'images/';

const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
    }
};


const Map = () => {

    const bioLab =
    {
        latitude: -13.000665409127777,
        longitude: -38.508360453981446,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    }

    const mapRef = useRef<any>();

    const [images, setImages] = useState<any[]>([]);
    const [infos, setInfos] = useState<any[]>([]);



    const Focusme = () => {
        mapRef.current?.animateCamera({ center: bioLab, zoom: 17 });
    }

    // Load images from file system
    const loadImages = async () => {
        await ensureDirExists();
        const files = await FileSystem.readDirectoryAsync(imgDir);

        if (files.length > 0) {
            let _imgs: any[] = [];
            let _infos: any[] = [];
            files.forEach(async (file) => {
                if (file.includes('.jpeg')) {
                    console.log("file: ", file);
                    _imgs.push(imgDir + file);
                    setInfos([...infos, { uri: imgDir + file, metadata: await loadInfo(imgDir + file) }]);
                }
            });
            console.log("info size: ", infos.length)
            setImages(_imgs);
        }

    };

    const loadInfo = async (uri: string) => {
        let data: ImageMetadata = {
            latitude: 0,
            longitude: 0,
            altitude: 0,
            date: '',
            author: '',
            uploaded: false
        };
        await FileSystem.readAsStringAsync(uri.replace('.jpeg', '.json')).then((read) => {
            data = JSON.parse(read);
        }).catch((error) => {
            console.log("error loading image data: ", error);
        });

        return data;
    }

    const permissions = async () => {
        await Location.requestForegroundPermissionsAsync();
    }


    useEffect(() => {
        loadImages();
        permissions();
    }, []);


    return (
        <View style={styles.container}>
            <View>
                <Button title='Lab' onPress={Focusme} />
                <Text>{infos.length}</Text>
            </View>
            <MapView style={styles.map}
                ref={mapRef}
                showsMyLocationButton >
                {infos.map((info, index) => {
                    return (
                        <Marker
                            key={index}
                            coordinate={{ latitude: info.metadata.latitude, longitude: info.metadata.longitude }}
                            title={info.metadata.author}
                            description={info.metadata.date}
                        />

                    );
                })
                }
            </MapView>
        </View >
    );
};

export default Map;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    map:
    {
        width: "95%",
        height: "95%",
        padding: 5,
    }
});