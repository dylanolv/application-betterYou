import React from "react";
import { View, Button, Text } from "react-native";
import * as firebase from 'firebase';
import { Container, Header, Content, Form, Item, Input, Label } from 'native-base';


firebase.initializeApp({
    apiKey: "AIzaSyC5eEj4GDdNByeljnixIhkfE2iKKfQBEeI",
    authDomain: "betteryou-5e5bb.firebaseapp.com",
    databaseURL: "https://betteryou-5e5bb.firebaseio.com",
    projectId: "betteryou-5e5bb",
    storageBucket: "betteryou-5e5bb.appspot.com",
    messagingSenderId: "916847466152"
})

export default class LoginScreen extends React.Component {
  constructor(props){
      super(props);
      this.state = {email:'', password:'', error:'', loading:false};
  }

  onLoginPress() {
    this.setState({error:'', loading:true});

    const{email, password} = this.state;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
        this.setState({error:'',loading:false});
        this.props.navigation.navigate('Main');
    })
    .catch(() => {
        this.setState({error:'Authentication failed',loading:false});
    })
  }

  onSignUpPress() {
    this.setState({error:'', loading:true});

    const{email, password} = this.state;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
        this.setState({error:'',loading:false});
        this.props.navigation.navigate('Main');
    })
    .catch(() => {
        this.setState({error:'Inscription failed',loading:false});
    })
  }

  renderButtonOrLoading(){
      if(this.state.loading){
          return <Text>Loading...</Text>
      }
      return <View>
          <Button onPress={this.onLoginPress.bind(this)} title="Login"/>
          <Button onPress={this.onSignUpPress.bind(this)} title="Signup"/>
      </View>
  }

  render(){
      return( 
        <Container>
            <Header />
            <Content>
            <Form>

                <Item stackedLabel>
                    <Label>Email</Label>
                    <Input onChangeText={email => this.setState({email})} />
                </Item>

                <Item stackedLabel last>
                    <Label>Password</Label>
                    <Input onChangeText={password => this.setState({password})} />
                </Item>

                {this.renderButtonOrLoading()}

            </Form>
            </Content>
        </Container>
      )
  }

}
