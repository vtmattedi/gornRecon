import {Tabs} from  'expo-router'
import { Header } from 'react-native/Libraries/NewAppScreen';

const TabsLayout = () => {
    return (
        <Tabs >
            <Tabs.Screen name="album" options={{headerShown: false}}/>
            <Tabs.Screen name="photo" options={{headerShown: false}}/>
            <Tabs.Screen name="settings" options={{headerShown: false}}/>
            <Tabs.Screen name="map" options={{headerShown: false}} />
        </Tabs>
    )
}

export default TabsLayout;