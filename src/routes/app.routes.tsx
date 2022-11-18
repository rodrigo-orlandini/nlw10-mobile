import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PlusCircle, SoccerBall } from 'phosphor-react-native';
import { useTheme } from 'native-base';
import { Platform } from 'react-native';

import NewPool from "../screens/NewPool";
import FindPool from "../screens/FindPool";
import Pools from "../screens/Pools";
import PoolDetails from "../screens/PoolDetails";

const { Navigator, Screen } = createBottomTabNavigator();

const AppRoutes = () => {

    const { colors, sizes } = useTheme();

    const size = sizes[6];

    return (
        <Navigator screenOptions={{ 
            headerShown: false, 
            tabBarActiveTintColor: colors.yellow[500],
            tabBarInactiveTintColor: colors.gray[300],
            tabBarLabelPosition: 'beside-icon',
            tabBarStyle: {
                position: 'absolute',
                height: sizes[22],
                borderTopWidth: 0,
                backgroundColor: colors.gray[800]
            },
            tabBarItemStyle: {
                position: 'relative',
                top: Platform.OS === 'android' ? -10 : 0
            }
        }}>
            <Screen name="NewPool" component={NewPool} options={{
                tabBarIcon: ({ color }) => <PlusCircle color={color} size={size} />,
                tabBarLabel: 'Novo bolão'
            }}/>

            <Screen name="Pools" component={Pools} options={{
                tabBarIcon: ({ color }) => <SoccerBall color={color} size={size} />,
                tabBarLabel: 'Meus bolões'
            }}/>

            <Screen name="FindPool" component={FindPool} options={{ tabBarButton: () => null }}/>
            <Screen name="PoolDetails" component={PoolDetails} options={{ tabBarButton: () => null }}/>
        </Navigator>
    );
}

export default AppRoutes;