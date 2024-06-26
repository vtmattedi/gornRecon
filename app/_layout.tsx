import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native';

const StackLayout = () => {
    return (
       
            <Stack>
                <Stack.Screen name="(tabs)"
                    options={
                        {
                            headerShown: false
                        }
                    }

                />
            </Stack>
     
    )
}

export default StackLayout;