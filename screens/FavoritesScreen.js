import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Container, Content, Icon, Header, Item, Input, Button, Text } from 'native-base';
import DiscoveriesComponent from '../components/DiscoveriesComponent';
import * as firebase from "firebase";

export default class FavoritesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: 'Favoris'
      };
    };

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

    // componentWillMount() {
    //     this.load()
    //     this.props.navigation.addListener('willFocus', this.load)
    // }
    
    // load = () => {
    //     this.getFavorites();
    // }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
          this._interval = setInterval(() => {
            this.getFavorites();
          }, 2000);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
      
        if (this._isMounted == false) {
          clearInterval(this._interval);
        }
    }

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