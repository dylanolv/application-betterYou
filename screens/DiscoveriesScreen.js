import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Container, Content, Icon, Header, Item, Input, Button, Text } from 'native-base';
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
        currentUserId: '',
        loading: true
      };
    }

    componentDidMount() {
      this._isMounted = true;
      this.getDiscoveries();
      this.getUserId();
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    getDiscoveries() {
      this.props.navigation.setParams({ handleNavigation: this.goToAccount })

      firebase.database().ref("discoveries/").on('value', (snapshot) => {
        let data = snapshot.val();
        let discoveries = Object.values(data);
    
        if (this._isMounted) {
          this.setState({discoveries: discoveries, loading: false });
        }
      });
    }

    getUserId() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var uid = user.uid;
          this.setState({currentUserId: uid });
        }
      });
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