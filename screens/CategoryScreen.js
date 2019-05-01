import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Container, Header, Content, List, ListItem, Text, Left, Right, Icon } from 'native-base';
import * as firebase from "firebase";

export default class CategoryScreen extends Component {
    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: 'Catégorie'
      };
    };
  
    constructor(props) {
      super(props);
  
      this.state = {
        loading: true
      };
    }

    componentDidMount() {
    }
    
    render() {   
        return (
            <View style={[styles.container, styles.horizontal]}>
            </View>
        )
    } 
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
});