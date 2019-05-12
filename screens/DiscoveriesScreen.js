import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Header, Button, Text, Item, Input, Container, Content, Icon } from 'native-base';
import DiscoveriesComponent from '../components/DiscoveriesComponent';
import * as firebase from "firebase";

export default class DiscoveriesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      return {
        headerTitle: 'Better You',
        headerRight: (
          <TouchableOpacity onPress={() => params.handleNavigation()}>
            <Icon name='person' style={{fontSize: 40, color: '#67BBF2', paddingRight: 20}}/>
          </TouchableOpacity>
        ),
      };
    };

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
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }
    
    getDiscoveries() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          let uid = user.uid;
          this.props.navigation.setParams({ handleNavigation: this.goToAccount })
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

    searchFilterFunction(text) {
      let text1 = text.toLowerCase();
      let newTabDiscoveries = this.state.discoveries
    
      const newData = newTabDiscoveries.filter((item) => {
        let result = item.title.toLowerCase();
        return result.search(text1) !== -1;
      });

      if (!(newData.length > 0) || !(text1.length > 0)) {
        firebase.database().ref("discoveries/").on('value', (snapshot) => {
          let data = snapshot.val();
          let discoveries = Object.values(data);
      
          if (this._isMounted) {
            this.setState({ discoveries: discoveries });
          }
        });
      } else {
        this.setState({
          discoveries: newData
        })
      }
    }
    
    goToAccount = () => {
      this.props.navigation.navigate('Account')
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
              <Header searchBar style={[styles.header]}>
                <Item>
                  <Icon name="search" />
                  <Input placeholder="Rechercher" onChangeText={text => this.searchFilterFunction(text)} />
                </Item>
                <Button transparent>
                  <Text>Rechercher</Text>
                </Button>
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
    backgroundColor: 'transparent'
  }
});