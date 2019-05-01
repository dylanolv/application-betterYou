import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Container, Content, Icon } from 'native-base';
import DiscoveriesComponent from '../components/DiscoveriesComponent';
import * as firebase from "firebase";

export default class DiscoveriesScreen extends Component {
    static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state
      return {
        headerTitle: 'Better You',
        headerRight: (
          <TouchableOpacity style={[styles.star]}>
            <Icon name='person' style={{fontSize: 40, color: '#67BBF2', paddingRight: 20}} onPress={() => params.handleNavigation()}/>
          </TouchableOpacity>
        ),
      };
    };
  
    constructor(props) {
      super(props);
  
      this.state = {
        discoveries: [],
        loading: true
      };
    }

    componentDidMount() {
      this.props.navigation.setParams({ handleNavigation: this.goToAccount })

      firebase.database().ref("discoveries/").on('value', (snapshot) => {
        let data = snapshot.val();
        let discoveries = Object.values(data);
        this.setState({discoveries: discoveries, loading: false});
      });
    }
    
    goToAccount = () => {
      this.props.navigation.navigate('AccountStack')
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