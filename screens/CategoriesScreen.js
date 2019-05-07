import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Container, Content, List } from 'native-base';
import CategoriesComponent from '../components/CategoriesComponent';
import * as firebase from "firebase";

export default class CategoriesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
      return {
        headerTitle: 'Catégories'
      };
    };

    _isMounted = false;
  
    constructor(props) {
      super(props);
  
      this.state = {
        categories: [],
        loading: true
      };
    }

    componentDidMount() {
      this._isMounted = true;

      firebase.database().ref("discoveries/").orderByChild('category').on('value', (snapshot) => {
        let childData = [];
        let i = -1;
        let categoriesData = [];
        let categorieDataFiltered = [];

        snapshot.forEach(function(childSnapshot) {
          childData.push(childSnapshot.val());
          i++;
          categoriesData.push(childData[i].category);
        });
        
        categorieDataFiltered = categoriesData.filter(function(item, index){
          return categoriesData.indexOf(item) >= index;
        });

        if (this._isMounted) {
          this.setState({ loading: false, categories: categorieDataFiltered  });
        }
      });
    }

    componentWillUnmount() {
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