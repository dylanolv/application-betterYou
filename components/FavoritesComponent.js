import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import PropTypes from 'prop-types';
import ReadMore from 'react-native-read-more-text';
import * as firebase from "firebase";

export default class FavoritesComponent extends Component {
    
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
        favorites: PropTypes.array.isRequired
    };

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onPressStar(index) {
        let tabStar = this.state.tabStarSelected;

        if (tabStar.includes(index)) { 
          tabStar.splice( tabStar.indexOf(index), 1 );
        }
        else {
          tabStar.push(index); 
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
    
    render() {
        return (
            this.props.favorites.map((discovery, index) => {
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
                            <Button style={[styles.btnShareComment, styles.marginShareCommentButtons]}>
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