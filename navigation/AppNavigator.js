import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen'

const AuthenticationStack = createStackNavigator({
  Login: LoginScreen,
  Signup: SignupScreen
});

const switchNavigator = createSwitchNavigator(
	{
		Main: MainTabNavigator,
		Auth: AuthenticationStack,
		AuthLoading: AuthLoadingScreen,
	},
	{
		initialRouteName: 'AuthLoading'
	}
);

export default createAppContainer(switchNavigator)
