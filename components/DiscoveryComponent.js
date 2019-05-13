import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import PropTypes from 'prop-types';
import * as firebase from "firebase";

export default class DiscoveryComponent extends Component {
    
    _isMounted = false;

    constructor(props) {
        super(props)
        this.state = {
            tabStarSelected: [],
            tabUpBtnSelected: [],
            tabDownBtnSelected: [],
            isUp: false,
            isDown: false,
            currentUserId: undefined
        };
    }

    static propTypes = {
        discovery: PropTypes.array.isRequired,
        isFavorite: PropTypes.bool.isRequired,
        favorites: PropTypes.array.isRequired,
        isUp: PropTypes.bool.isRequired,
        btnUp: PropTypes.array.isRequired,
        isDown: PropTypes.bool.isRequired,
        btnDown: PropTypes.array.isRequired
    };

    componentDidMount() {
        this._isMounted = true;

        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            if (this._isMounted) {
              this.setState({ isUp: this.props.isUp, isDown: this.props.isDown, tabStarSelected: this.props.favorites, tabUpBtnSelected: this.props.btnUp, tabDownBtnSelected: this.props.btnDown, currentUserId: user.uid });
            }
          }
          else {
            if (this._isMounted) {
              this.setState({ currentUserId: undefined });
            }
          }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onPressStar(discoveryId) {
        let tabStar = this.state.tabStarSelected;
        let uid = this.state.currentUserId;

        if (tabStar.includes(discoveryId)) { 
          tabStar.splice( tabStar.indexOf(discoveryId), 1 );
          
          if (uid != undefined) {
            tabStarString = JSON.stringify(tabStar)
            firebase.database().ref("favorites/").child(uid).update({'tabId': tabStarString })
          }
        }
        else {
          tabStar.push(discoveryId); 

          if (uid != undefined) {
            tabStarString = JSON.stringify(tabStar)
            firebase.database().ref("favorites/").child(uid).update({'tabId': tabStarString })
          }
        }

        if (this._isMounted) {
          this.setState({ tabStarSelected: tabStar })
        }
    }

    addUpvoteInDiscovery(up, discoveryId) {
        firebase.database().ref("discoveries/").once('value', (snapshot) => {
          let data = snapshot.val();
          let discoveries = Object.values(data);
          discoveries.map((item, index) => {
            if (item.discoveryId == discoveryId) {
              firebase.database().ref("discoveries/").child(index).update({'upvotes': up })
            }
          })
        });
    }

    addDownvoteInDiscovery(down, discoveryId) {
        firebase.database().ref("discoveries/").once('value', (snapshot) => {
          let data = snapshot.val();
          let discoveries = Object.values(data);
          discoveries.map((item, index) => {
            if (item.discoveryId == discoveryId) {
              firebase.database().ref("discoveries/").child(index).update({'downvotes': down })
            }
          })
        });
    }
    
    onPressUp(discoveryId, upvotes, downvotes) {
        let tabUp = this.state.tabUpBtnSelected;
        let tabDown = this.state.tabDownBtnSelected;
        let uid = this.state.currentUserId;
      
        if (this._isMounted) {
          this.setState({ isUp: false, isDown: false })
        }

        if (!tabUp.includes(discoveryId)) {
          let upPlus = upvotes + 1
          this.addUpvoteInDiscovery(upPlus, discoveryId);
          tabUp.push(discoveryId); 
          if (uid != undefined) {
            tabUpString = JSON.stringify(tabUp)
            firebase.database().ref("upvotes/").child(uid).update({'tabId': tabUpString })
          }
        }
        else {
          let upMinus = upvotes - 1
          this.addUpvoteInDiscovery(upMinus, discoveryId);
          tabUp.splice( tabUp.indexOf(discoveryId), 1 );
          if (uid != undefined) {
            tabUpString = JSON.stringify(tabUp)
            firebase.database().ref("upvotes/").child(uid).update({'tabId': tabUpString })
          }
        }
        if (tabDown.includes(discoveryId)) { 
          let downMinus = downvotes - 1
          this.addDownvoteInDiscovery(downMinus, discoveryId);
          tabDown.splice( tabDown.indexOf(discoveryId), 1 );
          if (uid != undefined) {
            tabDownString = JSON.stringify(tabDown)
            firebase.database().ref("downvotes/").child(uid).update({'tabId': tabDownString })
          }
        }
        if (this._isMounted) {
          this.setState({ tabUpBtnSelected: tabUp, tabDownBtnSelected: tabDown })
        }
    }
    
    onPressDown(discoveryId, upvotes, downvotes) {
        let tabUp = this.state.tabUpBtnSelected;
        let tabDown = this.state.tabDownBtnSelected;
        let uid = this.state.currentUserId;
      
        if (this._isMounted) {
          this.setState({ isUp: false, isDown: false })
        }

        if (tabDown.includes(discoveryId)) { 
          let downMinus = downvotes - 1
          this.addDownvoteInDiscovery(downMinus, discoveryId);
          tabDown.splice( tabDown.indexOf(discoveryId), 1 );
          if (uid != undefined) {
            tabDownString = JSON.stringify(tabDown)
            firebase.database().ref("downvotes/").child(uid).update({'tabId': tabDownString })
          }
        }
        else {
          let downPlus = downvotes + 1
          this.addDownvoteInDiscovery(downPlus, discoveryId);
          tabDown.push(discoveryId); 
          if (uid != undefined) {
            tabDownString = JSON.stringify(tabDown)
            firebase.database().ref("downvotes/").child(uid).update({'tabId': tabDownString })
          }
        }
        if (tabUp.includes(discoveryId)) { 
          let upMinus = upvotes - 1
          this.addUpvoteInDiscovery(upMinus, discoveryId);
          tabUp.splice( tabUp.indexOf(discoveryId), 1 );
          if (uid != undefined) {
            tabUpString = JSON.stringify(tabUp)
            firebase.database().ref("upvotes/").child(uid).update({'tabId': tabUpString })
          }
        }
        if (this._isMounted) {
          this.setState({ tabUpBtnSelected: tabUp, tabDownBtnSelected: tabDown })
        }
    }
    
    onShare = async (title, content) => {
      try {
        const result = await Share.share({
          title : title,
          message: content
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {}
          else {}
        } 
        else if (result.action === Share.dismissedAction) {}
      } 
      catch (error) {
        alert(error.message);
      }
    };
    
    render() {
        return (
            this.props.discovery.map((item, index) => {
                return (
                    <Card key={index} style={{flex: 0}}>
                        <CardItem>
                            <Left>
                                <Body>
                                    <Text style={[styles.title]}>{item.title}</Text>
                                </Body>
                            </Left>
                            <TouchableOpacity style={[styles.star]} onPress={()=>this.onPressStar(item.discoveryId)}>
                                <Icon style={[styles.iconStar]} name={(this.props.isFavorite) || (this.state.tabStarSelected.includes(item.discoveryId))?'star':'star-outline'}/>
                            </TouchableOpacity>
                        </CardItem>
                        <CardItem>
                          <Image source={{ uri: item.image }} style={[styles.img]}/>
                        </CardItem>
                        <CardItem>
                          <Body>
                            <Text style={[styles.txt]}>
                              {item.content2}
                            </Text>
                          </Body>
                        </CardItem>
                        <CardItem style={{justifyContent: 'center'}}>
                            <Button rounded style={[(this.state.isUp) || (this.state.tabUpBtnSelected.includes(item.discoveryId))?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={()=>this.onPressUp(item.discoveryId, item.upvotes, item.downvotes)}>
                                <Icon style={(this.state.isUp) || (this.state.tabUpBtnSelected.includes(item.discoveryId))?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-up'/>
                                <Text style={(this.state.isUp) || (this.state.tabUpBtnSelected.includes(item.discoveryId))?styles.txtBtnSelected:styles.txtBtnNotSelected}>{item.upvotes}</Text>
                            </Button>
                            <Button rounded style={[(this.state.isDown) || (this.state.tabDownBtnSelected.includes(item.discoveryId))?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={()=>this.onPressDown(item.discoveryId, item.upvotes, item.downvotes)}>
                                <Icon style={(this.state.isDown) || (this.state.tabDownBtnSelected.includes(item.discoveryId))?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-down'/>
                                <Text style={(this.state.isDown) || (this.state.tabDownBtnSelected.includes(item.discoveryId))?styles.txtBtnSelected:styles.txtBtnNotSelected}>{item.downvotes}</Text>
                            </Button>
                        </CardItem>
                        <CardItem style={{justifyContent: 'center'}}>
                            <Button rounded style={[styles.btnShareComment]} onPress={()=>this.onShare(item.title, item.content1)}>
                                <Icon name='share' style={[styles.iconBtnSelected]}/>
                                <Text style={[styles.txtBtnSelected]}>Partager</Text>
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
    hidden: {
      display:'none'
    },
    title: {
      fontWeight: 'bold',
      width:'80%'
    },
    more: {
      alignSelf: 'flex-end'
    },
    moreTxt: {
      textDecorationLine: 'underline'
    },
    category: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    img: {
      flex: 1, 
      resizeMode: 'cover', 
      height: 200, 
      width: 320,
      alignSelf: 'center'
    },
    txt: {
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
    marginUpDownButtons: {
      marginHorizontal: 7
    },
});