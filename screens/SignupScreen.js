import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Header, Title, Container, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button } from 'native-base';
import React, {Component} from 'react';
import * as firebase from 'firebase';

export default class SignupScreen extends Component {
    static navigationOptions = {
      title: "Signup"
    };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      loading: false
    }
  }

  signup() {
    const { username } = this.state;

    this.setState({ loading: true });

    firebase.auth().createUserWithEmailAndPassword( this.state.email, this.state.password)
        .then(() => {
            alert('Your account was created!');
            this.setState({ email: '', password: '', loading: false });
            this.props.navigation.navigate("HomeStack");
        })
        .catch((error) => {
            this.setState({ loading: false });
            alert("Account creation failed: " + error.message );
    });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
           // Updates the user attributes:
          user.updateProfile({ // <-- Update Method here
            displayName: username
          }).then(function() {
            // Profile updated successfully!
            var displayName = user.displayName;
            console.log(displayName);
          }, function(error) {
            // An error happened.
            console.log(error);
          });     
        }
    });
  }

    render() {
        const content = this.state.loading ? (<ActivityIndicator size="large"/>) 
            : (
            <Content>
                    <List>
                        <ListItem>
                            <InputGroup>
                            <Icon name="ios-person" style={{ color: '#67BBF2' }} />
                            <Input
                            onChangeText={(text) => this.setState({username: text})}
                            value={this.state.username}
                            placeholder={"Username"} />
                            </InputGroup>
                        </ListItem>

                        <ListItem>
                            <InputGroup>
                            <Icon name="ios-mail" style={{ color: '#67BBF2' }} />
                            <Input
                            onChangeText={(text) => this.setState({email: text})}
                            value={this.state.email}
                            placeholder={"Email Address"} />
                            </InputGroup>
                        </ListItem>

                        <ListItem>
                            <InputGroup>
                            <Icon name="ios-unlock" style={{ color: '#67BBF2' }} />
                            <Input
                            onChangeText={(text) => this.setState({password: text})}
                            value={this.state.password}
                            secureTextEntry={true}
                            placeholder={"Password"} />
                            </InputGroup>
                        </ListItem>
                    </List>

                    <Button rounded style={styles.primaryButton} onPress={this.signup.bind(this)}>
                        <Text>Signup</Text>
                    </Button>

                    <Button rounded style={styles.primaryButton} onPress={this.goToLogin.bind(this)}>
                        <Text>Go to Login</Text>
                    </Button>
                </Content>
            );
            return (
                <Container>
                    {content}
                </Container>
            );
    }

    goToLogin(){
        this.props.navigation.navigate("LoginStack");
    }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    flex: 1
  },
  body: {
    flex: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCFF"
  },
  primaryButton: {
    margin: 10,
    padding: 15,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#67BBF2",
    width: 150
  }
});
