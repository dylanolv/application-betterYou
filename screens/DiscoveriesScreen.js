import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Container, Content } from 'native-base';
import DiscoveriesComponent from '../components/DiscoveriesComponent';
import * as firebase from "firebase";

export default class DiscoveriesScreen extends Component {
    static navigationOptions = {
      title: "Better You"
    };

    constructor(props) {
      super(props);
  
      this.state = {
        discoveries: [],
        loading: true
      };
    }

    componentDidMount() {
      firebase.database().ref("discoveries/").on('value', (snapshot) => {
        let data = snapshot.val();
        let discoveries = Object.values(data);
        this.setState({discoveries: discoveries, loading: false});
      });
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
              <DiscoveriesComponent navigation={this.props.navigation} discoveries={this.state.discoveries} />
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