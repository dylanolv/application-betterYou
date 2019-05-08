import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Container, Content } from 'native-base';
import DiscoveryComponent from '../components/DiscoveryComponent';
import * as firebase from "firebase";

export default class DiscoveryScreen extends Component {
    static navigationOptions = ({ navigation }) => {
      return {
        title: navigation.getParam('title')
      };
    };

    _isMounted = false;

    constructor(props) {
      super(props);
  
      this.state = {
        discovery: [],
        isFavorite: false,
        favorites: [],
        loading: true
      };
    }

    componentDidMount() {
      this._isMounted = true;
      this.getDiscovery();
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    getDiscovery() {
		  const { navigation } = this.props;
      const index = navigation.getParam('index');
      const favorites = navigation.getParam('favorites');

      firebase.database().ref("discoveries/").on('value', (snapshot) => {
        let data = snapshot.val();
        let fav = this.state.isFavorite;
        let discoveries = Object.values(data);
        let discovery = []
        discovery.push(discoveries[index]);

        if (!favorites.includes(index)) {
          fav = false;
        }
        else {
          fav = true
        }

        if (this._isMounted) {
          this.setState({ discovery: discovery, isFavorite: fav, favorites: favorites, loading: false });
        }
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
              <DiscoveryComponent favorites={this.state.favorites} isFavorite={this.state.isFavorite} discovery={this.state.discovery} />
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