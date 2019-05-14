import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import DiscoveriesScreen from '../screens/DiscoveriesScreen';
import QuoteScreen from '../screens/QuoteScreen';
import AccountScreen from '../screens/AccountScreen';
import DiscoveryScreen from '../screens/DiscoveryScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryScreen from '../screens/CategoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

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
      name={`md-home`}
    />
  ),
};

const CategoriesStack = createStackNavigator({
  Categories: CategoriesScreen,
  Category: CategoryScreen
});

CategoriesStack.navigationOptions = {
  tabBarLabel: 'Catégories',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={`md-list`}
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
      name={`md-star`}
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
      name={`md-quote`}
    />
  ),
};

export default createBottomTabNavigator(
  {
    DiscoveriesStack,
    CategoriesStack,
    FavoritesStack,
    QuoteStack
  },
  {
    initialRouteName: 'DiscoveriesStack'
  }
);
