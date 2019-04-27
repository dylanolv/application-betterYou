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
      loading: false, 
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
        // let childData = [];
        // snapshot.forEach(function(childSnapshot) {
        //   childData.push(childSnapshot.val())
        // });
        // childData.map((discoverie, index) => (
        //   console.log(discoverie.category)  
        // ));
        // console.log(childData)
        // this.setState({ loading: false });
        
        let data = snapshot.val();
        let keys = Object.keys(data);
        return keys.forEach((key) => { 
          // console.log(data[key].category);
          <CardItem>
            <Body>
              <Text>{data[key].category}</Text>
            </Body>
          </CardItem>   
        });

      });
  }

  // componentDidMount() {
  //   this.getDiscoveries();
  // }

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
				    <Card>{this.getDiscoveries()}</Card>
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