import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Header, Item, Input, Container, Content, Icon } from 'native-base';
import DiscoveriesComponent from '../components/DiscoveriesComponent';
import * as firebase from "firebase";

export default class DiscoveriesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerTitle: 'Better You',
        headerRight: (
          <TouchableOpacity onPress={() => params.handleNavigation()}>
            <Icon name='person' style={{fontSize: 35, color: '#288bbf', paddingRight: 20}}/>
          </TouchableOpacity>
        ),
        headerLeft: (
          <TouchableOpacity onPress={() => params.handleSearchDisplay()}>
            <Icon name='search' style={{fontSize: 35, color: '#288bbf', paddingLeft: 20}}/>
          </TouchableOpacity>
        )
      };
    };

    // Utilisation de isMounted pour éviter l'erreur "Can't call setState (or forceUpdate) on an unmounted component"
    _isMounted = false;
  
    constructor(props) {
      super(props);
  
      this.state = {
        discoveries: [],
        currentUserId: undefined,
        displaySearchBar: false,
        loading: true
      };

      this.getDiscoveries();
    }

    componentDidMount() {
      // isMounted à true pour notifier que le component est monté
      this._isMounted = true;
    }

    componentWillUnmount() {
      // isMounted à false pour notifier que le component est démonté
      this._isMounted = false;
    }
    
    // Focntion qui récupère toutes les découvertes pour les donner au composant DiscoveriesComponent
    getDiscoveries() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          let uid = user.uid;
          
          // Afin de pouvoir executer une fonction depuis le header il faut la passser en param dans navigation
          this.props.navigation.setParams({ handleNavigation: this.goToAccount })
          this.props.navigation.setParams({ handleSearchDisplay: this.displaySearch })

          firebase.database().ref("discoveries/").on('value', (snapshot) => {
            let data = snapshot.val();
            let discoveries = Object.values(data);
        
            if (this._isMounted) {
              this.setState({ currentUserId: uid, discoveries: discoveries, loading: false });
            }
          });
        }
        else {
          if (this._isMounted) {
            this.setState({ currentUserId: undefined, loading: false });
          }
        }
      })
    }

    // Fonction de recherche parmis les découvertes
    searchFilterFunction(text) {
      let text1 = text.toLowerCase();
      let newTabDiscoveries = this.state.discoveries
    
      const newData = newTabDiscoveries.filter((item) => {
        let result = item.title.toLowerCase();
        return result.search(text1) !== -1;
      });

      // Si il n'y a pas de correspondance on remet les découvertes dans le tableau
      if (!(newData.length > 0) || !(text1.length > 0)) {
        firebase.database().ref("discoveries/").on('value', (snapshot) => {
          let data = snapshot.val();
          let discoveries = Object.values(data);
      
          if (this._isMounted) {
            this.setState({ discoveries: discoveries });
          }
        });
      } else {
        if (this._isMounted) {
          this.setState({
            discoveries: newData
          })
        }
      }
    }
    
    // Fonction qui envoie au screen account
    goToAccount = () => {
      this.props.navigation.navigate('Account')
    }
    
    // Fonction qui affiche ou non la barre de recherche en jouant sur le state displaySearchBar
    displaySearch = () => {
      valueDisplay = !this.state.displaySearchBar;

      if (this._isMounted) {
        this.setState({ displaySearchBar: valueDisplay });
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
              <Header searchBar style={[(!this.state.displaySearchBar)?styles.hidden:'', styles.header]}>
                <Item>
                  <Input style={[styles.inputHeader]} placeholder="Rechercher" onChangeText={text => this.searchFilterFunction(text)} />
                </Item>
              </Header>
              <DiscoveriesComponent navigation={this.props.navigation} currentUserId={this.state.currentUserId} discoveries={this.state.discoveries} />
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
  },
  header: {
    backgroundColor: 'transparent',
    marginTop: 7,
    width: '85%',
    alignSelf: 'center'
  },
  hidden: {
    display: 'none'
  },
  inputHeader: {
    borderRadius: 25
  }
});