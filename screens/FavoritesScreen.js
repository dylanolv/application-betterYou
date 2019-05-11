import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Container, Content, Icon, Header, Item, Input, Button, Text } from 'native-base';
import FavoritesComponent from '../components/FavoritesComponent';
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
    }

    componentWillMount() {
        this.load()
        this.props.navigation.addListener('willFocus', this.load)
    }
    
    load = () => {
        this.getFavorites();
    }

    componentDidMount() {
        this._isMounted = true;

        this.getUserId();
        setTimeout(() => {this.getFavorites();}, 500)
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

    componentWillUnmount() {
        this._isMounted = false;
    }

    getFavorites() {
        let uid = this.state.currentUserId;
  
        if (uid != undefined) {
            firebase.database().ref("favorites/").child(uid).on('value', (snapshot) => {
                let data = snapshot.val();
                let fav = Object(data);
                let tabStarFav = this.state.tabStarSelected;
                tabStarFav = JSON.parse(fav.tabId);
                if (this._isMounted) {
                    this.setState({ tabUserFavorites: tabStarFav })
                }
            })

            firebase.database().ref("discoveries/").on('value', (snapshot) => {
                let data = snapshot.val();
                let favorites = Object.values(data);
                let fav = []
                let tabUserFav = this.state.tabUserFavorites;

                tabUserFav.map((item) => {
                    fav.push(favorites[item]);
                })

                if (this._isMounted) {
                    this.setState({favorites: fav, loading: false });
                }
            });
        }
        else {
          let favorites = [];
          if (this._isMounted) {
            this.setState({ tabUserFavorites: favorites })
          }
        }
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
              <FavoritesComponent favorites={this.state.favorites} />
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