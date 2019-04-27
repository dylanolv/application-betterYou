import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container, Content, Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import * as firebase from "firebase";

// To hide the yellowbox
import { YellowBox } from 'react-native';
import _ from 'lodash';
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Discoveries"
  };

  constructor(props) {
    super(props)
    this.state = {
      upBtnSelected: false,
      downBtnSelected: false,
      starSelected: false,
      loading: true, 
      discoveries: []
    };
  }

  onPressStar() {
    this.setState({ starSelected: !this.state.starSelected })
  }

  onPressUp() {
    this.setState({ upBtnSelected: !this.state.upBtnSelected, downBtnSelected: false })
  }

  onPressDown() {
    this.setState({ downBtnSelected: !this.state.downBtnSelected, upBtnSelected: false })
  }

  getDiscoveries() {
    firebase
      .database()
      .ref("discoveries/")
      .on("value", snapshot => {
        let childData = [];

        snapshot.forEach(function(childSnapshot) {
          childData.push(childSnapshot)
        });
        
        this.setState({ loading: false });
      });
  }

  componentDidMount() {
    this.getDiscoveries();
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
            <Card style={{flex: 0}}>
              <CardItem>
                <Left>
                  <Body>
                    <Text note>Minimalisme</Text>
                    <Text style={[styles.title]}>Vivre mieux avec moins</Text>
                  </Body>
                </Left>
                <TouchableOpacity style={[styles.star]}>
                  <Icon style={[styles.iconStar]} name={(this.state.starSelected == true)?'star':'star-outline'} onPress={this.onPressStar.bind(this)}/>
                </TouchableOpacity>
              </CardItem>
              <CardItem>
                <Body>
                  <Image source={require('../assets/images/minimalism1.jpg')} style={[styles.img]}/>
                  <Text style={[styles.txt]}>
                    Dans notre société où la consommation domine, un nombre croissant de personnes vont à l'encontre de ces principes et décide de posséder eet consommer moins. 
                    Le minimalisme est une manière de se libérer de ses possessions. Nous accordons trop d'importance aux choses que nous possèdons, à tel point que nous nous sentons pièger.
                  </Text>
                  <TouchableOpacity style={[styles.more]}>
                    <Text style={[styles.moreTxt]}>En savoir plus..</Text>
                  </TouchableOpacity>
                </Body>
              </CardItem>
              <CardItem style={{justifyContent: 'center'}}>
                  <Button style={[(this.state.upBtnSelected == true)?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={this.onPressUp.bind(this)}>
                    <Icon style={(this.state.upBtnSelected == true)?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-up'/>
                    <Text style={(this.state.upBtnSelected == true)?styles.txtBtnSelected:styles.txtBtnNotSelected}>470</Text>
                  </Button>
                  <Button style={[(this.state.downBtnSelected == true)?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={this.onPressDown.bind(this)}>
                    <Icon style={(this.state.downBtnSelected == true)?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-down'/>
                    <Text style={(this.state.downBtnSelected == true)?styles.txtBtnSelected:styles.txtBtnNotSelected}>20</Text>
                  </Button>
              </CardItem>
              <CardItem style={{justifyContent: 'center'}}>
                <Button style={[styles.btnSelected, styles.marginShareCommentButtons]}>
                  <Icon name='share' style={[styles.iconBtnSelected]}/>
                  <Text style={[styles.txtBtnSelected]}>Partager</Text>
                </Button>
                <Button style={[styles.btnSelected, styles.marginShareCommentButtons]}>
                  <Icon name='chatboxes' style={[styles.iconBtnSelected]}/>
                  <Text style={[styles.txtBtnSelected]}>Commenter</Text>
                </Button>
              </CardItem>
            </Card>
          </Content>
        </Container>
      );
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
  title: {
    fontWeight: 'bold'
  },
  more: {
    alignSelf: 'flex-end'
  },
  moreTxt: {
    textDecorationLine: 'underline'
  },
  img: {
    flex: 1, 
    resizeMode: 'cover', 
    height: 200, 
    width: 370
  },
  txt: {
    paddingTop: 10
  },
  star: {
    alignSelf: 'flex-end'
  },
  iconStar: {
    fontSize: 40,
    color: '#67BBF2'
  },
  btnSelected: {
    backgroundColor: '#67BBF2',
    borderWidth: 1,
    borderColor: '#67BBF2'
  },
  btnNotSelected: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#67BBF2'
  },
  iconBtnSelected: {
    fontSize: 40,
    color: '#FFFFFF'
  },
  iconBtnNotSelected: {
    fontSize: 40,
    color: '#67BBF2'
  },
  txtBtnSelected: {
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  txtBtnNotSelected: {
    fontWeight: 'bold',
    color: '#67BBF2'
  },
  marginShareCommentButtons: {
    marginHorizontal: 5
  },
  marginUpDownButtons: {
    marginHorizontal: 7
  },
});