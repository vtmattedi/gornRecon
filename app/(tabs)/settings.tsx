import React, { useEffect } from 'react';
import { View, Text, SafeAreaView, Image, TextInput, ImageBackground, Dimensions, Switch, StyleSheet } from 'react-native';
import styles from '../../assets/Styles/mystyles';
import * as  Device from 'expo-device';
const windowSize = Math.round(Dimensions.get('window').width);

const Settings = () => {
    const deviceName = Device.deviceName;
    const inputRef = React.useRef<TextInput>(null);
    const [tos, setTos] = React.useState<boolean>(false);



    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../../assets/images/logo-inverted-nobg.png')}
                resizeMethod='scale'
                resizeMode='center'
                style={styles.backgroundImage} >
                <View style={morestyles.titleContainer} >
                    <Text style={morestyles.title}>Settings Page</Text>
                </View>
                <View style={styles.fieldContainer}>
                    <Text>Name:</Text>
                    <TextInput
                        style={{ width: windowSize / 2, borderColor: 'gray', borderWidth: 1, height: 40, backgroundColor: '#fff' }}
                        ref={inputRef}
                        placeholder={deviceName ? deviceName : "Anonimous"}
                    />
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={{fontSize:16}}>{"Mock app for the croc app project. The app will help to identify crocodilians on the field."}</Text>

                </View>
                <View style={morestyles.titleContainer} >
                    <Text style={morestyles.title}>Terms of Service:</Text>
                </View>
                <View style={styles.fieldContainer}>
                    <Text>{"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet tellus vel lorem faucibus suscipit tincidunt eget justo. Praesent vitae ipsum purus. Curabitur eget magna arcu. Quisque ut tortor molestie, convallis tellus a, tincidunt ex. Nulla consequat ex nec porttitor mattis. Integer et urna mollis, fermentum sapien id, malesuada libero. Vestibulum volutpat, nulla sed ullamcorper porttitor, orci odio volutpat ante, vel efficitur metus ligula aliquam mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc quis diam in orci cursus blandit. Phasellus mollis vestibulum augue, et sodales dui vulputate nec. Proin id fringilla nibh. Curabitur at mattis ligula, vitae efficitur enim. Etiam non eleifend augue. Sed ultrices libero quis orci malesuada, sit amet porttitor nisl pellentesque. Proin varius velit ac quam placerat placerat. Ut viverra volutpat sapien, sed porttitor nulla tincidunt et."}</Text>
                </View>
                <View style={styles.fieldContainer}>
                    <Text>{"Agree to terms of service: "}</Text>
                    <Switch
                        value={tos}
                        onValueChange={setTos}
                        
                        style={{ padding: 5, margin: 5}}
                     />
                </View>
                <View style={styles.fieldContainer}>
                    <Text>{"Developed by Vitor Mattedi Carvalho"}</Text>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

const morestyles = StyleSheet.create(
    {
        titleContainer:
        {
            alignItems: 'center'
        },
        title:
        {
            fontSize: 24,
            padding: 5,
            justifyContent: 'center',
        }
    }
)

export default Settings;