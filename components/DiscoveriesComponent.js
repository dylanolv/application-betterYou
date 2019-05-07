import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import PropTypes from 'prop-types';
import * as firebase from "firebase";
export default class DiscoveriesComponent extends Component {
    
    _isMounted = false;

    constructor(props) {
        super(props)
        this.state = {
            tabStarSelected: [],
            tabUpBtnSelected: [],
            tabDownBtnSelected: [],
            currentUserId: undefined
        };
    }

    static propTypes = {
        discoveries: PropTypes.array.isRequired
    };

    componentWillMount() {
      this.load()
      this.props.navigation.addListener('willFocus', this.load)
    }
    
    load = () => {
      this.getFavorites();
    }

    componentDidMount() {
      this._isMounted = true;
      if (this._isMounted) {
        this._interval = setInterval(() => {
          this.getFavorites();
        }, 2000);
      }

      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.setState({ currentUserId: user.uid });
        }
        else {
          this.setState({ currentUserId: undefined });
        }
      })

    }

    componentWillUnmount() {
      this._isMounted = false;
      
      if (this._isMounted == false) {
        clearInterval(this._interval);
      }
    }

    getFavorites() {
      let uid = this.state.currentUserId;

      if (uid != undefined) {
        firebase.database().ref("favorites/").child(uid).on('value', (snapshot) => {
          let data = snapshot.val();
          let fav = Object(data);
          let tabStarFav = this.state.tabStarSelected;
          tabStarFav = JSON.parse(fav.tabId);

          if (this._isMounted) {
            this.setState({ tabStarSelected: tabStarFav })
          }
        })
      }
      else {
        let favorites = [];
        if (this._isMounted) {
          this.setState({ tabStarSelected: favorites })
        }
      }
    }

    onPressStar(index) {
        let tabStar = this.state.tabStarSelected;    
        let uid = this.state.currentUserId;

        if (tabStar.includes(index)) { 
          tabStar.splice( tabStar.indexOf(index), 1 );
          
          if (uid != undefined) {
            tabStarString = JSON.stringify(tabStar)
            firebase.database().ref("favorites/").child(uid).update({'tabId': tabStarString })
          }
        }
        else {
          tabStar.push(index); 

          if (uid != undefined) {
            tabStarString = JSON.stringify(tabStar)
            firebase.database().ref("favorites/").child(uid).update({'tabId': tabStarString })
          }
        }

        if (this._isMounted) {
          this.setState({ tabStarSelected: tabStar })
        }
    }
    
    onPressUp(index, upvotes, downvotes) {
      let tabUp = this.state.tabUpBtnSelected;
      let tabDown = this.state.tabDownBtnSelected;
      
        if (tabUp.includes(index)) { 
          firebase.database().ref("discoveries/").child(index).update({'upvotes': (upvotes-=1) })
          tabUp.splice( tabUp.indexOf(index), 1 );
        }
        else {
          firebase.database().ref("discoveries/").child(index).update({'upvotes': (upvotes+=1) })
          tabUp.push(index); 
        }
  
        if (tabDown.includes(index)) { 
          firebase.database().ref("discoveries/").child(index).update({'downvotes': (downvotes-=1) })
          tabDown.splice( tabDown.indexOf(index), 1 );
        }
  
        if (this._isMounted) {
          this.setState({ tabUpBtnSelected: tabUp, tabDownBtnSelected: tabDown })
        }
    }
    
    onPressDown(index, upvotes, downvotes) {
      let tabUp = this.state.tabUpBtnSelected;
      let tabDown = this.state.tabDownBtnSelected;

      if (tabDown.includes(index)) {
        firebase.database().ref("discoveries/").child(index).update({'downvotes': (downvotes-=1) })
        tabDown.splice( tabDown.indexOf(index), 1 );
      }
      else {
        firebase.database().ref("discoveries/").child(index).update({'downvotes': (downvotes+=1) })
        tabDown.push(index); 
      }

      if (tabUp.includes(index)) { 
        firebase.database().ref("discoveries/").child(index).update({'upvotes': (upvotes-=1) })
        tabUp.splice( tabUp.indexOf(index), 1 );
      }

      if (this._isMounted) {
        this.setState({ tabUpBtnSelected: tabUp, tabDownBtnSelected: tabDown })
      }
    }
    
    goToDiscovery = (index, title) => {
      this.props.navigation.navigate('Discovery', {
        index: index,
        title: title
      })
    }
    
    render() {
        return (
            this.props.discoveries.map((discovery, index) => {
                return (
                    <Card key={index} style={{flex: 0}}>
                        <CardItem>
                            <Left>
                                <Body>
                                    <Text note>{discovery.category}</Text>
                                    <Text style={[styles.title]} button onPress={()=>this.goToDiscovery(index, discovery.title)}>{discovery.title}</Text>
                                </Body>
                            </Left>
                            <TouchableOpacity style={[styles.star]} onPress={()=>this.onPressStar(index)}>
                                <Icon style={[styles.iconStar]} name={(this.state.tabStarSelected && this.state.tabStarSelected.includes(index))?'star':'star-outline'}/>
                            </TouchableOpacity>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Image source={require('../assets/images/minimalism1.jpg')} style={[styles.img]}/>
                                <Text style={[styles.txt]} button onPress={()=>this.goToDiscovery(index, discovery.title)}>
                                    {discovery.content1}
                                </Text>
                                <TouchableOpacity style={[styles.more]} onPress={()=>this.goToDiscovery(index, discovery.title)}>
                                    <Text style={[styles.moreTxt]}>En savoir plus..</Text>
                                </TouchableOpacity>
                            </Body>
                        </CardItem>
                        <CardItem style={{justifyContent: 'center'}}>
                            <Button style={[(this.state.tabUpBtnSelected && this.state.tabUpBtnSelected.includes(index))?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={()=>this.onPressUp(index, discovery.upvotes, discovery.downvotes)}>
                                <Icon style={(this.state.tabUpBtnSelected && this.state.tabUpBtnSelected.includes(index))?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-up'/>
                                <Text style={(this.state.tabUpBtnSelected && this.state.tabUpBtnSelected.includes(index))?styles.txtBtnSelected:styles.txtBtnNotSelected}>{discovery.upvotes}</Text>
                            </Button>
                            <Button style={[(this.state.tabDownBtnSelected && this.state.tabDownBtnSelected.includes(index))?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={()=>this.onPressDown(index, discovery.upvotes, discovery.downvotes)}>
                                <Icon style={(this.state.tabDownBtnSelected && this.state.tabDownBtnSelected.includes(index))?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-down'/>
                                <Text style={(this.state.tabDownBtnSelected && this.state.tabDownBtnSelected.includes(index))?styles.txtBtnSelected:styles.txtBtnNotSelected}>{discovery.downvotes}</Text>
                            </Button>
                        </CardItem>
                        <CardItem style={{justifyContent: 'center'}}>
                            <Button style={[styles.btnShareComment, styles.marginShareCommentButtons]}>
                                <Icon name='share' style={[styles.iconBtnSelected]}/>
                                <Text style={[styles.txtBtnSelected]}>Partager</Text>
                            </Button>
                            <Button style={[styles.btnShareComment, styles.marginShareCommentButtons]}>
                                <Icon name='chatboxes' style={[styles.iconBtnSelected]}/>
                                <Text style={[styles.txtBtnSelected]}>Commenter</Text>
                            </Button>
                        </CardItem>
                    </Card>
                )
            })
        );
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
      padding: 15
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
      width: 320,
      alignSelf: 'center'
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
      borderColor: '#67BBF2',
      height: '84%',
      width: '35%',
      justifyContent: 'center',
      elevation: 0
    },
    btnNotSelected: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#67BBF2',
      height: '84%',
      width: '35%',
      justifyContent: 'center',
      elevation: 0
    },
    btnShareComment: {
      backgroundColor: '#67BBF2',
      borderWidth: 1,
      borderColor: '#67BBF2',
      height: '84%',
      width: '50%',
      justifyContent: 'center'
    },
    iconBtnSelected: {
      fontSize: 35,
      color: '#FFFFFF'
    },
    iconBtnNotSelected: {
      fontSize: 35,
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