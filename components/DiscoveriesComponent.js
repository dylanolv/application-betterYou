import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
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
            tabDownBtnSelected: []
        };
    }

    static propTypes = {
      discoveries: PropTypes.array.isRequired,
      currentUserId: PropTypes.string.isRequired
    };

    // componentWillMount() {
    //   this.load()
    //   this.props.navigation.addListener('willFocus', this.load)
    // }
    
    // load = () => {
    //   this.getFavorites();
    //   this.getUpvotes();
    //   this.getDownvotes();
    // }

    componentDidMount() {
      this._isMounted = true;
      if (this._isMounted) {
        this._interval = setInterval(() => {
          this.getFavorites();
          this.getUpvotes();
          this.getDownvotes();
        }, 2000);
      }
    }

    componentWillUnmount() {
      this._isMounted = false;
      
      if (this._isMounted == false) {
        clearInterval(this._interval);
      }
    }

    getFavorites() {
      let uid = this.props.currentUserId;

      if (uid != undefined) {
        firebase.database().ref("favorites/").child(uid).on('value', (snapshot) => {
          if (snapshot != []) {
            let data = snapshot.val();
            let fav = Object(data);
            let tabStarFav = this.state.tabStarSelected;
            tabStarFav = JSON.parse(fav.tabId);
  
            if (this._isMounted) {
              this.setState({ tabStarSelected: tabStarFav })
            }
          }
          else {
            let favorites = [];
            if (this._isMounted) {
              this.setState({ tabStarSelected: favorites })
            }
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

    getUpvotes() {
      let uid = this.props.currentUserId;

      if (uid != undefined) {
        firebase.database().ref("upvotes/").child(uid).on('value', (snapshot) => {
          if (snapshot != []) {
            let data = snapshot.val();
            let up = Object(data);
            let tabUp = this.state.tabUpBtnSelected;
            tabUp = JSON.parse(up.tabId);
  
            if (this._isMounted) {
              this.setState({ tabUpBtnSelected: tabUp })
            }
          }
          else {
            let ups = [];
            if (this._isMounted) {
              this.setState({ tabUpBtnSelected: ups })
            }
          }
        })
      }
      else {
        let ups = [];
        if (this._isMounted) {
          this.setState({ tabUpBtnSelected: ups })
        }
      }
    }

    getDownvotes() {
      let uid = this.props.currentUserId;

      if (uid != undefined) {
        firebase.database().ref("downvotes/").child(uid).on('value', (snapshot) => {
          if (snapshot != []) {
            let data = snapshot.val();
            let down = Object(data);
            let tabDown = this.state.tabDownBtnSelected;
            tabDown = JSON.parse(down.tabId);
  
            if (this._isMounted) {
              this.setState({ tabDownBtnSelected: tabDown })
            }
          }
          else {
            let downs = [];
            if (this._isMounted) {
              this.setState({ tabDownBtnSelected: downs })
            }
          }
        })
      }
      else {
        let downs = [];
        if (this._isMounted) {
          this.setState({ tabDownBtnSelected: downs })
        }
      }
    }

    onPressStar(discoveryId) {
        let tabStar = this.state.tabStarSelected;
        let uid = this.props.currentUserId;

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
        let uid = this.props.currentUserId;
      
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
        let uid = this.props.currentUserId;
      
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
    
    goToDiscovery = (discoveryId, category) => {
      this.props.navigation.navigate('Discovery', {
        discoveryId: discoveryId,
        category: category,
        favorites: this.state.tabStarSelected,
        btnUp: this.state.tabUpBtnSelected,
        btnDown: this.state.tabDownBtnSelected
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
                                    <Text style={[styles.title]}>{discovery.title}</Text>
                                </Body>
                            </Left>
                            <TouchableOpacity style={[styles.star]} onPress={()=>this.onPressStar(discovery.discoveryId)}>
                                <Icon style={[styles.iconStar]} name={(this.state.tabStarSelected && this.state.tabStarSelected.includes(discovery.discoveryId))?'star':'star-outline'}/>
                            </TouchableOpacity>
                        </CardItem>
                        <CardItem>
                          <TouchableOpacity onPress={()=>this.goToDiscovery(discovery.discoveryId, discovery.category)}>
                            <Image source={{ uri: discovery.image }} style={[styles.img]}/>
                          </TouchableOpacity>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text style={[styles.txt]} button onPress={()=>this.goToDiscovery(discovery.discoveryId, discovery.category)}>
                                    {discovery.content1}
                                </Text>
                                <TouchableOpacity style={[styles.more]} onPress={()=>this.goToDiscovery(discovery.discoveryId, discovery.category)}>
                                    <Text style={[styles.moreTxt]}>En savoir plus..</Text>
                                </TouchableOpacity>
                            </Body>
                        </CardItem>
                        <CardItem style={{justifyContent: 'center'}}>
                            <Button rounded style={[(this.state.tabUpBtnSelected && this.state.tabUpBtnSelected.includes(discovery.discoveryId))?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={()=>this.onPressUp(discovery.discoveryId, discovery.upvotes, discovery.downvotes)}>
                                <Icon style={(this.state.tabUpBtnSelected && this.state.tabUpBtnSelected.includes(discovery.discoveryId))?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-up'/>
                                <Text style={(this.state.tabUpBtnSelected && this.state.tabUpBtnSelected.includes(discovery.discoveryId))?styles.txtBtnSelected:styles.txtBtnNotSelected}>{discovery.upvotes}</Text>
                            </Button>
                            <Button rounded style={[(this.state.tabDownBtnSelected && this.state.tabDownBtnSelected.includes(discovery.discoveryId))?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={()=>this.onPressDown(discovery.discoveryId, discovery.upvotes, discovery.downvotes)}>
                                <Icon style={(this.state.tabDownBtnSelected && this.state.tabDownBtnSelected.includes(discovery.discoveryId))?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-down'/>
                                <Text style={(this.state.tabDownBtnSelected && this.state.tabDownBtnSelected.includes(discovery.discoveryId))?styles.txtBtnSelected:styles.txtBtnNotSelected}>{discovery.downvotes}</Text>
                            </Button>
                        </CardItem>
                        <CardItem style={{justifyContent: 'center'}}>
                            <Button rounded style={[styles.btnShareComment]} onPress={()=>this.onShare(discovery.title, discovery.content1)}>
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