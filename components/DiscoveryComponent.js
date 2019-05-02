import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import PropTypes from 'prop-types';

export default class DiscoveryComponent extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            tabStarSelected: [],
            tabUpBtnSelected: [],
            tabDownBtnSelected: []
        };
    }

    static propTypes = {
        discovery: PropTypes.array.isRequired
    };

    onPressStar(index) {
        let tabStar = this.state.tabStarSelected;

        if (tabStar.includes(index)) { 
          tabStar.splice( tabStar.indexOf(index), 1 );
        }
        else {
          tabStar.push(index); 
        }

        this.setState({ tabStarSelected: tabStar })
    }
    
    onPressUp(index) {
        let tabUp = this.state.tabUpBtnSelected;
        let tabDown = this.state.tabDownBtnSelected;

        if (tabUp.includes(index)) { 
          tabUp.splice( tabUp.indexOf(index), 1 );
        }
        else {
          tabUp.push(index); 
        }
  
        if (tabDown.includes(index)) { 
          tabDown.splice( tabDown.indexOf(index), 1 );
        }
  
        this.setState({ tabUpBtnSelected: tabUp, tabDownBtnSelected: tabDown })
    }
    
    onPressDown(index) {
      let tabUp = this.state.tabUpBtnSelected;
      let tabDown = this.state.tabDownBtnSelected;

      if (tabDown.includes(index)) { 
        tabDown.splice( tabDown.indexOf(index), 1 );
      }
      else {
        tabDown.push(index); 
      }

      if (tabUp.includes(index)) { 
        tabUp.splice( tabUp.indexOf(index), 1 );
      }

      this.setState({ tabUpBtnSelected: tabUp, tabDownBtnSelected: tabDown })
    }
    
    render() {
        return (
            this.props.discovery.map((item, index) => {
                return (
                    <Card key={index} style={{flex: 0}}>
                        <CardItem>
                            <Left>
                                <Body>
                                    <Text note style={[styles.category]}>{item.category}</Text>
                                </Body>
                            </Left>
                            <TouchableOpacity style={[styles.star]} onPress={()=>this.onPressStar(index)}>
                                <Icon style={[styles.iconStar]} name={(this.state.tabStarSelected.includes(index))?'star':'star-outline'}/>
                            </TouchableOpacity>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Image source={require('../assets/images/minimalism1.jpg')} style={[styles.img]}/>
                                <Text style={[styles.txt]}>
                                    {item.content2}
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem style={{justifyContent: 'center'}}>
                            <Button style={[(this.state.tabUpBtnSelected.includes(index))?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={()=>this.onPressUp(index)}>
                                <Icon style={(this.state.tabUpBtnSelected.includes(index))?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-up'/>
                                <Text style={(this.state.tabUpBtnSelected.includes(index))?styles.txtBtnSelected:styles.txtBtnNotSelected}>{item.upvotes}</Text>
                            </Button>
                            <Button style={[(this.state.tabDownBtnSelected.includes(index))?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={()=>this.onPressDown(index)}>
                                <Icon style={(this.state.tabDownBtnSelected.includes(index))?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-down'/>
                                <Text style={(this.state.tabDownBtnSelected.includes(index))?styles.txtBtnSelected:styles.txtBtnNotSelected}>{item.downvotes}</Text>
                            </Button>
                        </CardItem>
                        <CardItem style={{justifyContent: 'center'}}>
                            <Button style={[styles.btnSelected, styles.marginShareCommentButtons]}>
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
      padding: 10
    },
    category: {
      fontSize: 18,
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