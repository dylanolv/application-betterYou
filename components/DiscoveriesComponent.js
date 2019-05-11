import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import PropTypes from 'prop-types';
import ReadMore from 'react-native-read-more-text';
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

    _renderTruncatedFooter = (handlePress) => {
      return (
        <TouchableOpacity style={[styles.more]} onPress={handlePress}>
          <Text style={[styles.moreTxt]}>En savoir plus..</Text>
        </TouchableOpacity>
      );
    }
  
    _renderRevealedFooter = (handlePress) => {
      return (
        <TouchableOpacity style={[styles.more]} onPress={handlePress}>
          <Text style={[styles.moreTxt]}>Réduire</Text>
        </TouchableOpacity>
      );
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
                          <Image source={{ uri: discovery.image }} style={[styles.img]}/>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <ReadMore numberOfLines={3} renderTruncatedFooter={this._renderTruncatedFooter} renderRevealedFooter={this._renderRevealedFooter} >
                                  <Text style={[styles.txt]}>
                                    {discovery.content}
                                  </Text>
                                </ReadMore>
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
                            <Button style={[styles.btnShareComment]} onPress={()=>this.onShare(discovery.title, discovery.content)}>
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
      elevation: 0,
      borderRadius:15
    },
    btnNotSelected: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#67BBF2',
      height: '84%',
      width: '35%',
      justifyContent: 'center',
      elevation: 0,
      borderRadius:15
    },
    btnShareComment: {
      backgroundColor: '#67BBF2',
      borderWidth: 1,
      borderColor: '#67BBF2',
      height: '84%',
      width: '50%',
      justifyContent: 'center',
      borderRadius:15
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