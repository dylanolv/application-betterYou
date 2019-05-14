import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Container, Content } from 'native-base';
import DiscoveriesComponent from '../components/DiscoveriesComponent';
import * as firebase from "firebase";

export default class CategoryScreen extends Component {
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
        discoveries: [],
        currentUserId: undefined,
        loading: true
      };
      this.getDiscoveries();
    }

    componentDidMount() {
      // isMounted à true pour notifier que le component est monté
      this._isMounted = true;
    }

    getDiscoveries() {
		  const { navigation } = this.props;
      const category = navigation.getParam('category');

      // On récupère les découvertes de la catégories sur laquelle on a cliqué pour les mettre dans le composant DiscoveriesComponent
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          let uid = user.uid;
          firebase.database().ref("discoveries/").on('value', (snapshot) => {
            let childData = [];
            let i = -1;
            let categoriesData = [];

            snapshot.forEach(function(childSnapshot) {
              childData.push(childSnapshot.val());
              i++;
              // Si la catégorie est égale à la catégorie reçue en param on la met dans le tableau
              if (childData[i].category == category) {
                categoriesData.push(childData[i]);
              }
            });
            
            if (this._isMounted) {
              this.setState({ currentUserId: uid, discoveries: categoriesData, loading: false});
            }
          });
        }
      })
    }
    
    componentWillUnmount() {
      // isMounted à false pour notifier que le component est démonté
      this._isMounted = false;
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
              <DiscoveriesComponent currentUserId={this.state.currentUserId} navigation={this.props.navigation} discoveries={this.state.discoveries} />
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