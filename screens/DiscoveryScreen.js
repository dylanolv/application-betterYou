import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Container, Content } from 'native-base';
import DiscoveryComponent from '../components/DiscoveryComponent';
import * as firebase from "firebase";

export default class DiscoveryScreen extends Component {
    static navigationOptions = ({ navigation }) => {
      return {
        title: navigation.getParam('category')
      };
    };

    // Utilisation de isMounted pour éviter l'erreur "Can't call setState (or forceUpdate) on an unmounted component"
    _isMounted = false;

    constructor(props) {
      super(props);
  
      this.state = {
        discovery: [],
        isFavorite: false,
        isUp: false,
        isDown: false,
        favorites: [],
        btnUp: [],
        btnDown: [],
        loading: true
      };
    }

    componentDidMount() {
      // isMounted à true pour notifier que le component est monté
      this._isMounted = true;

      this.getDiscovery();
    }

    componentWillUnmount() {
      // isMounted à false pour notifier que le component est démonté
      this._isMounted = false;
    }

    // Fonction qui récupère la discovery sur laquelle on à cliqué et qui vérifie quels boutons (favoris, upvote ou downvote) doivent rester cochés
    getDiscovery() {
		  const { navigation } = this.props;
      const indexDiscovery = navigation.getParam('discoveryId');
      const favorites = navigation.getParam('favorites');
      const btnUp = navigation.getParam('btnUp');
      const btnDown = navigation.getParam('btnDown');

      firebase.database().ref("discoveries/").on('value', (snapshot) => {
        let data = snapshot.val();
        let fav = this.state.isFavorite;
        let up = this.state.isUp;
        let down = this.state.isDown;
        let discoveries = Object.values(data);
        
        let discovery = []

        discoveries.map((item, i) => {
          if (item.discoveryId == indexDiscovery) {
            discovery.push(item);
          }
        })
        
        if (!favorites.includes(indexDiscovery)) {
          fav = false;
        }
        else {
          fav = true
        }
        
        if (!btnUp.includes(indexDiscovery)) {
          up = false;
        }
        else {
          up = true
        }
        
        if (!btnDown.includes(indexDiscovery)) {
          down = false;
        }
        else {
          down = true
        }

        if (this._isMounted) {
          this.setState({ discovery: discovery, isFavorite: fav, isUp: up, isDown: down, favorites: favorites, btnUp: btnUp, btnDown: btnDown, loading: false });
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
              <DiscoveryComponent favorites={this.state.favorites} isFavorite={this.state.isFavorite} btnUp={this.state.btnUp} isUp={this.state.isUp} btnDown={this.state.btnDown} isDown={this.state.isDown} discovery={this.state.discovery} />
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