import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import ChatScreen from './screens/ChatScreen';
import SplashScreen from './screens/SplashScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#0A0014' },
                    cardStyleInterpolator: ({ current, layouts }) => ({
                        cardStyle: {
                            opacity: current.progress,
                            transform: [
                                {
                                    scale: current.progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.92, 1],
                                    }),
                                },
                            ],
                        },
                    }),
                    transitionSpec: {
                        open: { animation: 'timing', config: { duration: 600 } },
                        close: { animation: 'timing', config: { duration: 400 } },
                    },
                }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
