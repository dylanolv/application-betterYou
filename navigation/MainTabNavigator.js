import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import DiscoveriesScreen from '../screens/DiscoveriesScreen';
import QuoteScreen from '../screens/QuoteScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import AccountScreen from '../screens/AccountScreen';
import DiscoveryScreen from '../screens/DiscoveryScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryScreen from '../screens/CategoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const AuthenticationStack = createStackNavigator({
  Login: LoginScreen,
  Signup: SignupScreen
});

AuthenticationStack.navigationOptions = {
  tabBarLabel: 'Connexion',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};
const DiscoveriesStack = createStackNavigator({
  Discoveries: DiscoveriesScreen,
  Discovery: DiscoveryScreen,
  Account: AccountScreen
});

DiscoveriesStack.navigationOptions = {
  tabBarLabel: 'Accueil',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const CategoriesStack = createStackNavigator({
  Categories: CategoriesScreen,
  Category: CategoryScreen
});

CategoriesStack.navigationOptions = {
  tabBarLabel: 'Categories',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const FavoritesStack = createStackNavigator({
  Favorites: FavoritesScreen
});

FavoritesStack.navigationOptions = {
  tabBarLabel: 'Favoris',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const QuoteStack = createStackNavigator({
  Quotes: QuoteScreen
});

QuoteStack.navigationOptions = {
  tabBarLabel: 'Quotes',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

export default createBottomTabNavigator(
  {
    AuthenticationStack,
    DiscoveriesStack,
    CategoriesStack,
    FavoritesStack,
    QuoteStack
  },
  {
    initialRouteName: 'DiscoveriesStack'
  }
);
