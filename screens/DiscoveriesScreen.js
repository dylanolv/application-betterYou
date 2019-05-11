import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Container, Content, Icon } from 'native-base';
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

    // getFavorites() {

    //   if (uid != undefined) {
    //     firebase.database().ref("favorites/").child(uid).on('value', (snapshot) => {
    //       if (snapshot != []) {
    //         let data = snapshot.val();
    //         let fav = Object(data);
    //         let tabStarFav = this.state.tabStarSelected;
    //         tabStarFav = JSON.parse(fav.tabId);
  
    //         if (this._isMounted) {
    //           this.setState({ tabStarSelected: tabStarFav })
    //         }
    //       }
    //       else {
    //         let favorites = [];
    //         if (this._isMounted) {
    //           this.setState({ tabStarSelected: favorites })
    //         }
    //       }
    //     })
    //   }
    //   else {
    //     let favorites = [];
    //     if (this._isMounted) {
    //       this.setState({ tabStarSelected: favorites })
    //     }
    //   }
    // }
    
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

    // searchFilterFunction = text => {    
    //   let tabDiscoveries = this.state.discoveries;
    //   let newTabDiscoveries = [];
    //   const textData = text.toUpperCase();

    //   tabDiscoveries.filter((discovery) => {
    //     const titleDiscovery = discovery.title.toUpperCase();

    //     if (titleDiscovery == textData) {
    //       newTabDiscoveries.push(discovery)
    //       this.setState({ discoveries: newTabDiscoveries });  
    //     }
    //   })
    // };
      
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
              {/* <Header searchBar>
                <Item>
                  <Icon name="search" />
                  <Input placeholder="Search" onChangeText={text => this.searchFilterFunction(text)} />
                </Item>
                <Button transparent>
                  <Text>Search</Text>
                </Button>
              </Header> */}
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
  }
});