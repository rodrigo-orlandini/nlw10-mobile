import { Box } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../hooks/useAuth';

import AppRoutes from './app.routes';
import SignIn from '../screens/SignIn';

const Routes = () => {

    const { user } = useAuth();

    return (
        <Box flex={1} bg="gray.900">
            <NavigationContainer>
                { user.name ? <SignIn /> : <AppRoutes /> }
            </NavigationContainer>
        </Box>
    )
}

export default Routes;