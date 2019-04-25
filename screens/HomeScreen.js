import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Center, Right, Body, Fab } from 'native-base';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Discoveries"
  };

  constructor(props) {
    super(props)
    this.state = {
      active: 'false',
      upBtnSelected: false,
      downBtnSelected: false
    };
  }

  render() {
    return (
      <Container>
        <Content>
          <Card style={{flex: 0}}>
            <CardItem>
              <Left>
                <Body>
                  <Text note>Catégorie</Text>
                  <Text>Titre Découverte</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Image source={require('../assets/images/discovery-image1.jpg')} style={{flex: 1, resizeMode: 'cover', height: 200, width: 370}}/>
                <Text style={{paddingTop: 10}}>
                  Nulla tempus ac urna vel pellentesque. Nullam imperdiet dictum ultricies. 
                  Suspendisse in nisl nec orci accumsan tincidunt. Nullam at erat lacus. 
                  In in lectus in libero ornare consequat. Phasellus tempor nisl vulputate urna ullamcorper.
                </Text>
                <TouchableOpacity style={[styles.more]}>
                  <Text>En savoir plus..</Text>
                </TouchableOpacity>
              </Body>
            </CardItem>
            <CardItem style={{justifyContent: 'center'}}>
                <Button style={[(this.state.upBtnSelected == true)?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={() => this.setState({ upBtnSelected: !this.state.upBtnSelected })}>
                  <Icon style={(this.state.upBtnSelected == true)?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-up'/>
                  <Text style={(this.state.upBtnSelected == true)?styles.txtBtnSelected:styles.txtBtnNotSelected}>470</Text>
                </Button>
                <Button style={[(this.state.downBtnSelected == true)?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={() => this.setState({ downBtnSelected: !this.state.downBtnSelected })}>
                  <Icon style={(this.state.downBtnSelected == true)?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-up'/>
                  <Text style={(this.state.downBtnSelected == true)?styles.txtBtnSelected:styles.txtBtnNotSelected}>470</Text>
                </Button>
            </CardItem>
            <CardItem style={{justifyContent: 'center'}}>
              <Button style={[styles.btnSelected, styles.margin5]}>
                <Icon name='share' style={[styles.iconBtnSelected]}/>
                <Text style={[styles.txtBtnSelected]}>Partager</Text>
              </Button>
              <Button style={[styles.btnSelected, styles.margin5]}>
                <Icon name='chatboxes' style={[styles.iconBtnSelected]}/>
                <Text style={[styles.txtBtnSelected]}>Commenter</Text>
              </Button>
                {/* <Fab
                active={!this.state.active}
                direction="up"
                position='bottomLeft'
                containerStyle={{ }}
                style={{ backgroundColor: '#67BBF2' }}
                onPress={() => this.setState({ active: !this.state.active })}>
                  <Icon name="share" />
                  <Button style={{ backgroundColor: '#34A34F' }}>
                    <Icon name="logo-whatsapp" />
                  </Button>
                  <Button style={{ backgroundColor: '#3B5998' }}>
                    <Icon name="logo-facebook" />
                  </Button>
                  <Button disabled style={{ backgroundColor: '#DD5144' }}>
                    <Icon name="mail" />
                  </Button>
                </Fab>
                
                <Fab 
                position='bottomRight'
                style={{ backgroundColor: '#67BBF2' }}>
                  <Icon name='chatboxes' />
                </Fab> */}
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  more: {
    alignSelf: 'flex-end'
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
  margin5: {
    margin: 5
  },
  marginUpDownButtons: {
    marginHorizontal: 7
  },
});