import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import PropTypes from 'prop-types';

export default class DiscoveryComponent extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            upBtnSelected: false,
            downBtnSelected: false,
            starSelected: false,
            loading: true, 
            discoveries: []
        };
    }

    static propTypes = {
        discoveries: PropTypes.array.isRequired
    };

    onPressStar() {
        this.setState({ starSelected: !this.state.starSelected })
    }
    
    onPressUp() {
        this.setState({ upBtnSelected: !this.state.upBtnSelected, downBtnSelected: false })
    }
    
    onPressDown() {
        this.setState({ downBtnSelected: !this.state.downBtnSelected, upBtnSelected: false })
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
                            <TouchableOpacity style={[styles.star]}>
                                <Icon style={[styles.iconStar]} name={(this.state.starSelected == true)?'star':'star-outline'} onPress={this.onPressStar.bind(this)}/>
                            </TouchableOpacity>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Image source={require('../assets/images/minimalism1.jpg')} style={[styles.img]}/>
                                <Text style={[styles.txt]}>
                                    {discovery.content}
                                </Text>
                                <TouchableOpacity style={[styles.more]}>
                                    <Text style={[styles.moreTxt]}>En savoir plus..</Text>
                                </TouchableOpacity>
                            </Body>
                        </CardItem>
                        <CardItem style={{justifyContent: 'center'}}>
                            <Button style={[(this.state.upBtnSelected == true)?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={this.onPressUp.bind(this)}>
                                <Icon style={(this.state.upBtnSelected == true)?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-up'/>
                                <Text style={(this.state.upBtnSelected == true)?styles.txtBtnSelected:styles.txtBtnNotSelected}>{discovery.upvotes}</Text>
                            </Button>
                            <Button style={[(this.state.downBtnSelected == true)?styles.btnSelected:styles.btnNotSelected, styles.marginUpDownButtons]} onPress={this.onPressDown.bind(this)}>
                                <Icon style={(this.state.downBtnSelected == true)?styles.iconBtnSelected:styles.iconBtnNotSelected} name='trending-down'/>
                                <Text style={(this.state.downBtnSelected == true)?styles.txtBtnSelected:styles.txtBtnNotSelected}>{discovery.downvotes}</Text>
                            </Button>
                        </CardItem>
                        <CardItem style={{justifyContent: 'center'}}>
                            <Button style={[styles.btnSelected, styles.marginShareCommentButtons]}>
                                <Icon name='share' style={[styles.iconBtnSelected]}/>
                                <Text style={[styles.txtBtnSelected]}>Partager</Text>
                            </Button>
                            <Button style={[styles.btnSelected, styles.marginShareCommentButtons]}>
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
      padding: 10
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