import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Container, Content, List } from 'native-base';
import CategoriesComponent from '../components/CategoriesComponent';
import * as firebase from "firebase";

export default class CategoriesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: 'Catégories'
      };
    };

    // Utilisation de isMounted pour éviter l'erreur "Can't call setState (or forceUpdate) on an unmounted component"
    _isMounted = false;
  
    constructor(props) {
      super(props);
  
      this.state = {
        categories: [],
        loading: true
      };
    }

    componentDidMount() {
      // isMounted à true pour notifier que le component est monté
      this._isMounted = true;

      // On récupère les discoveries de firebase ordonnée par la catégorie
      firebase.database().ref("discoveries/").orderByChild('category').on('value', (snapshot) => {
        let childData = [];
        let i = -1;
        let categoriesData = [];
        let categorieDataFiltered = [];

        // On parcours avec un foreach pour ne pas perdre l'ordre alphabétique
        snapshot.forEach(function(childSnapshot) {
          childData.push(childSnapshot.val());
          i++;
          categoriesData.push(childData[i].category);
        });
        
        // On filtre pour ne pas garder les catégories apparraissant deux fois en double dans la liste des catégories montrées à l'utilisateur
        categorieDataFiltered = categoriesData.filter(function(item, index){
          return categoriesData.indexOf(item) >= index;
        });

        if (this._isMounted) {
          this.setState({ loading: false, categories: categorieDataFiltered  });
        }
      });
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