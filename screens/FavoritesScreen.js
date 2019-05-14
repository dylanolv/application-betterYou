import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Container, Content } from 'native-base';
import DiscoveriesComponent from '../components/DiscoveriesComponent';
import * as firebase from "firebase";

export default class FavoritesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: 'Favoris'
      };
    };

    // Utilisation de isMounted pour éviter l'erreur "Can't call setState (or forceUpdate) on an unmounted component"
    _isMounted = false;
  
    constructor(props) {
      super(props);
  
      this.state = {
        favorites: [],
        tabUserFavorites: [],
        currentUserId: undefined,
        loading: true
      };

      this.getFavorites();
    }

    componentDidMount() {
      // isMounted à true pour notifier que le component est monté
        this._isMounted = true;

        this.getUserId();
        
      // Si le composant est monté on exécute les fonctions suivantes toutes les deux secondes
        if (this._isMounted) {
          this._interval = setInterval(() => {
            this.getFavorites();
          }, 2000);
        }
    }

    componentWillUnmount() {
        // isMounted à false pour notifier que le component est démonté
        this._isMounted = false;
      
        // Quand le composant est démonté on supprime tous les interval
        if (this._isMounted == false) {
          clearInterval(this._interval);
        }
    }

    // Fonction qui récupère le userid
    getUserId() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
              if (this._isMounted) {
                this.setState({ currentUserId: user.uid });
              }
            }
            else {
              if (this._isMounted) {
                this.setState({ currentUserId: undefined });
              }
            }
        })
    }

    // Fonction qui récupère les favoris du user pour les mette ensuite dans DiscoveriesComponent 
    getFavorites() {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            let uid = user.uid;
            firebase.database().ref("favorites/").child(uid).on('value', (snapshot) => {
                let data = snapshot.val();
                let fav = Object(data);
                let tabStarFav = this.state.tabStarSelected;
                tabStarFav = JSON.parse(fav.tabId);
                if (this._isMounted) {
                    this.setState({ currentUserId: uid, tabUserFavorites: tabStarFav })
                }
            })

            firebase.database().ref("discoveries/").on('value', (snapshot) => {
                let data = snapshot.val();
                let favorites = Object.values(data);
                let fav = []
                let tabUserFav = this.state.tabUserFavorites;

                favorites.map((item) => {
                  if (tabUserFav.includes(item.discoveryId)) {
                    fav.push(item);
                  }
                })

                if (this._isMounted) {
                    this.setState({ favorites: fav, loading: false });
                }
            });
          }
          else {
            let favorites = [];
            if (this._isMounted) {
              this.setState({ tabUserFavorites: favorites })
            }
          }
        })
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
              <DiscoveriesComponent navigation={this.props.navigation} currentUserId={this.state.currentUserId} discoveries={this.state.favorites} />
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