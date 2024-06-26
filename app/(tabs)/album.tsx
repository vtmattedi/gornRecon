import React, { useState, useEffect } from 'react';
import {
    Button,
    Image,
    View,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    Text,
    FlatList,
    Alert,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Device from 'expo-device';
import InfoModal from '../../infoModal';
import ResultModal from '../../resultModal';
import * as SplashScreen from 'expo-splash-screen';
import { Dimensions } from 'react-native';
import { ImageMetadata, ImageData } from '../../interfaces';




const windowSize = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        borderWidth: 1,
        width: windowSize > 800 ? 800 : windowSize,
    },
    border: {
        borderBlockColor: '#000',
        borderWidth: 1,
    },
    innerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {

        fontSize: 40,
        fontFamily: 'Inter',

    },
    DevicesContainer: {
        backgroundColor: '#ccc',
        flexDirection: 'row',
        margin: 10,
        paddingHorizontal: 5,
        borderRadius: 10,
        borderBlockColor: 'black',
        borderWidth: 1,

    },
    bigCointainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    AcSideBtn: {
        width: 120,
        height: 80,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'black',
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    btnText:
    {
        fontSize: 24,
        fontWeight: "bold",
    },
    DevicesTitle: {
        marginLeft: 10,
        bottom: 0,
        fontSize: 16,
        alignSelf: 'flex-start',
    },
    ActionsContainer: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        columnGap: 10,
        padding: 10,
        marginTop: 10,
    },
    modalContainer: {

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        height: 100,
    },

    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        width: windowSize * 0.9,

        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 50,

    },
});


const imgDir = FileSystem.documentDirectory + 'images/';



const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
    }
};





export default function Album() {
    const [showInfo, setShowInfo] = useState({ info: false, result: false });
    const [images, setImages] = useState<any[]>([]);
    const [currentImage, setCurrentImage] = useState<string>('');
    const [currentInfo, setCurrentInfo] = useState<string>('');
    const [infos, setInfos] = useState<any[]>([]);
    const deviceName = Device.deviceName;

    // Load images on startup
    useEffect(() => {
        permissions();
        loadImages();
    }, []);

    const permissions = async () => {
        await ImagePicker.requestCameraPermissionsAsync();
        await Location.requestForegroundPermissionsAsync();
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
                    _imgs.push(imgDir + file);
                    _infos.push({ uri: imgDir + file, metadata: await loadInfo(imgDir + file) });
                }
            });
            setInfos(_infos);
            setImages(_imgs);
        }
        console.log(images);
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

    const loadData = async (uri: string) => {
        let data: ImageMetadata = {
            latitude: 0,
            longitude: 0,
            altitude: 0,
            date: '',
            author: '',
            uploaded: false
        };
        await FileSystem.readAsStringAsync(uri.replace('.jpeg', '.json')).then((data) => {
            data = JSON.parse(data);
        }).catch((error) => {
            console.log("error loading image data: ", error);
        });

        return {
            uri: uri,
            metadata: data
        }
    }

    // Select image from library or camera
    const selectImage = async (useLibrary: boolean) => {
        let result;
        const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.75
        };

        if (useLibrary) {
            result = await ImagePicker.launchImageLibraryAsync(options);
        } else {

            result = await ImagePicker.launchCameraAsync(options);
        }

        // Save image if not cancelled
        if (!result.canceled) {
            console.log(result);


            // var data = Buffer.from(newValue.base64, 'base64').toString("binary");
            // var exifObj = piexif.load(data);

            // exifObj.GPS[piexif.GPSIFD.GPSLatitude] = degToDmsRational(location.coords.latitude);
            // exifObj.GPS[piexif.GPSIFD.GPSLatitudeRef] = "N";
            // exifObj.GPS[piexif.GPSIFD.GPSLongitude] = degToDmsRational(location.coords.longitude);
            // exifObj.GPS[piexif.GPSIFD.GPSLongitudeRef] = "W";

            saveImage(result.assets[0].uri);

        }
    };

    // Save image to file system
    const saveImage = async (uri: string,) => {
        await ensureDirExists();
        const filename = new Date().getTime();
        const dest = imgDir + filename + '.jpeg';
        const info = imgDir + filename + '.json';
        await FileSystem.copyAsync({ from: uri, to: dest });
        const location = await Location.getCurrentPositionAsync();

        const infoData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude,
            date: new Date().toISOString(),
            author: deviceName,
            uploaded: false,
        }
        FileSystem.writeAsStringAsync(info, JSON.stringify(infoData));
        setImages([...images, dest]);
        setInfos([...infos, { uri: dest, metadata: infoData }]);
    };

    // Upload image to server
    const uploadImage = async (uri: string) => {
        const info = uri.replace('.jpeg', '.json');
        const name = uri.split('/').pop();
        let metadata = '';
        await FileSystem.readAsStringAsync(info).then((data) => {
            metadata = data;
        });
        let metadataObj = JSON.parse(metadata);
        if (metadataObj.uploaded) {
            Alert.alert("Image Upload", "Image already uploaded");

        }
        else {
            Alert.alert("Image Upload", "Do you want to upload: '" + name + "' ?", [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Confirm", onPress: async () => {
                        metadataObj.uploaded = true;
                        setInfos(infos.map((i) => i.uri === uri ? { uri: i.uri, metadata: metadataObj } : i));
                        await FileSystem.writeAsStringAsync(info, JSON.stringify(metadataObj), { encoding: FileSystem.EncodingType.UTF8 });
                    }
                }
            ]);


        }

        // await FileSystem.uploadAsync('http://192.168.1.52:8888/upload.php', uri, {
        //   httpMethod: 'POST',
        //   uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        //   fieldName: 'file'
        // });

        // setShowInfo(false);
    };
    
    const resultImage = async (uri: string) => {
        setCurrentImage(uri)
        setShowInfo(prevState => ({ ...prevState, result: true }));
    }
    const infoImage = async (uri: string) => {
        const info = uri.replace('.jpeg', '.json');
        console.log(info);
        await FileSystem.readAsStringAsync(info).then((data) => {
            setCurrentInfo(data);
        });
        setCurrentImage(uri);
        setShowInfo(prevState => ({ ...prevState, info: true }));


        // await FileSystem.uploadAsync('http://192.168.1.52:8888/upload.php', uri, {
        //   httpMethod: 'POST',
        //   uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        //   fieldName: 'file'
        // });

        // setShowInfo(false);
    };

    // Delete image from file system
    const deleteImage = async (uri: string) => {

        Alert.alert("Delete Image", "Do you want to delete: '" + uri.split('/').pop() + "' ?", [
            {
                text: "Cancel",
                onPress: () => console.log("Delete cancelled"),
                style: "cancel"
            },
            {
                text: "Confirm", onPress: async () => {
                    await FileSystem.deleteAsync(uri);
                    setImages(images.filter((i) => i !== uri));

                    await FileSystem.deleteAsync(uri.replace('.jpeg', '.json'));
                    setInfos(infos.filter((i) => i.uri !== uri));
                }
            }
        ]);

    };



    // Render image list item
    const renderItem = ({ item }: { item: any }) => {
        const filename = item.split('/').pop();
        const upload = infos.find((i) => i.uri === item)?.metadata.uploaded;
        // console.log(infos);
        return (
            <TouchableOpacity onPress={() => resultImage(item)} >
                <View style={{ flexDirection: 'row', margin: 1, alignItems: 'center', gap: 5 }}>

                    <Image style={{ width: 80, height: 80 }} source={{ uri: item }} />
                    <Text style={{ flex: 1 }}>{filename}</Text>
                    <Ionicons.Button name="information-circle" onPress={() => infoImage(item)} />
                    <Ionicons.Button style={upload ? { backgroundColor: "green" } : {}} name="cloud-upload-outline" onPress={() => uploadImage(item)} />
                    <Ionicons.Button name="trash" onPress={() => deleteImage(item)} />

                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ marginTop: 40, gap: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '500' }}>My Images</Text>

            {/* <TouchableOpacity onPress={() => {

  setShowInfo(false);
      }} disabled={!showInfo} > */}
            <FlatList style={{ marginHorizontal: 5, height: '80%' }} data={images} renderItem={renderItem} />
            {/* </TouchableOpacity> */}


            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', }}>
        <Button title="Photo Library" onPress={() => selectImage(true)} />
        <Button title="Capture Image" onPress={() => selectImage(false)} />
      </View> */}
            {showInfo.result && (
                <View style={{ position: 'absolute', top: 20 }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <ResultModal image={currentImage} title={"sample title"} text={"sample text"} onClose={() => { setShowInfo(prevState => ({ ...prevState, result: false })); }} />
                        </View>
                    </View>
                </View>
            )}
            {showInfo.info && (
                <View style={{ position: 'absolute', top: 20 }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <InfoModal image={currentImage} infoData={currentInfo} onClose={() => { setShowInfo(prevState => ({ ...prevState, info: false })); }} />
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

