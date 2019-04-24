import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Center, Right, Body, Fab } from 'native-base';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Home"
  };

  constructor(props) {
    super(props)
    this.state = {
      active: 'false'
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
                <Image source={require('../assets/images/discovery-image1.jpg')} style={{height: 200, width: 370, flex: 1}}/>
                <Text>
                  Nulla tempus ac urna vel pellentesque. Nullam imperdiet dictum ultricies. 
                  Suspendisse in nisl nec orci accumsan tincidunt. Nullam at erat lacus. 
                  In in lectus in libero ornare consequat. Phasellus tempor nisl vulputate urna ullamcorper.
                </Text>
              </Body>
            </CardItem>
            <CardItem >
              <Right>
                <TouchableOpacity>
                  <Text>En savoir plus..</Text>
                </TouchableOpacity>
              </Right>
            </CardItem>
            <CardItem style={{justifyContent: 'center'}}>
                <Button style={{margin: 10}}>
                  <Icon name='ios-trending-up' style={{fontSize: 40}}/>
                  <Text>470</Text>
                </Button>
                <Button style={{margin: 10}}>
                  <Icon name='ios-trending-down' style={{fontSize: 40}}/>
                  <Text>20</Text>
                </Button>
            </CardItem>
            <CardItem>
                <Fab
                active={!this.state.active}
                direction="up"
                containerStyle={{ }}
                style={{ backgroundColor: '#5067FF' }}
                position="bottomRight"
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
                <Button transparent bordered>
                  <Icon name='md-chatboxes' style={{fontSize: 40}}/>
                  <Text>Commenter</Text>
                </Button>
            </CardItem>
          </Card>

          
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
                <Image source={require('../assets/images/discovery-image2.png')} style={{height: 200, width: 370, flex: 1}}/>
                <Text>
                  Nulla tempus ac urna vel pellentesque. Nullam imperdiet dictum ultricies. 
                  Suspendisse in nisl nec orci accumsan tincidunt. Nullam at erat lacus. 
                  In in lectus in libero ornare consequat. Phasellus tempor nisl vulputate urna ullamcorper.
                </Text>
              </Body>
            </CardItem>
            <CardItem >
              <Right>
                <TouchableOpacity>
                  <Text>En savoir plus..</Text>
                </TouchableOpacity>
              </Right>
            </CardItem>
            <CardItem style={{justifyContent: 'center'}}>
                <Button style={{margin: 10}}>
                  <Icon name='ios-trending-up' style={{fontSize: 40}}/>
                  <Text>470</Text>
                </Button>
                <Button style={{margin: 10}}>
                  <Icon name='ios-trending-down' style={{fontSize: 40}}/>
                  <Text>20</Text>
                </Button>
            </CardItem>
            <CardItem style={{justifyContent: 'center'}}>
                <Button transparent bordered>
                  <Icon name='md-share' style={{fontSize: 40}}/>
                  <Text>Partager</Text>
                </Button>
                <Button transparent bordered>
                  <Icon name='md-chatboxes' style={{fontSize: 40}}/>
                  <Text>Commenter</Text>
                </Button>
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
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30
  }
});