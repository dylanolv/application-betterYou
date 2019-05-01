import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Container, Content, List } from 'native-base';
import CategoriesComponent from '../components/CategoriesComponent';
import * as firebase from "firebase";

// To hide the yellowbox
import { YellowBox } from 'react-native';
import _ from 'lodash';
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class CategoriesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: 'Catégories'
      };
    };
  
    constructor(props) {
      super(props);
  
      this.state = {
        categories: [],
        loading: true
      };
    }

    componentDidMount() {
      firebase.database().ref("discoveries/").orderByChild('category').on('value', (snapshot) => {
        let childData = [];
        snapshot.forEach(function(childSnapshot) {
          childData.push(childSnapshot.val());
        });
        this.setState({ loading: false, categories: childData });
      });
    }
    
    render() {   
        if (this.state.loading) {
            return (
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#67BBF2" />
                </View>
            )
        }
        else {
            return (
                <Container>
                    <Content>
                        <List>
                            <CategoriesComponent navigation={this.props.navigation} categories={this.state.categories} />
                        </List>
                    </Content>
                </Container>
            )
        }  
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