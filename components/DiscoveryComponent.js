import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import PropTypes from 'prop-types';
import * as firebase from "firebase";

export default class DiscoveryComponent extends Component {
    
    // Utilisation de isMounted pour éviter l'erreur "Can't call setState (or forceUpdate) on an unmounted component"
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
      // On récupère  des éléments via les props
        discovery: PropTypes.array.isRequired,
        isFavorite: PropTypes.bool.isRequired,
        favorites: PropTypes.array.isRequired,
        isUp: PropTypes.bool.isRequired,
        btnUp: PropTypes.array.isRequired,
        isDown: PropTypes.bool.isRequired,
        btnDown: PropTypes.array.isRequired
    };

    componentDidMount() {
        // isMounted à true pour notifier que le component est monté
        this._isMounted = true;

        // On vérifie que le user est connecté
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            // Si le user est connecté et que le component est monté on met à jour les state avec les props et le id du usrr qu'on vient de récupérer
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
      // isMounted à false pour notifier que le component est démonté
        this._isMounted = false;
    }

    // Fonction qui met en favoris une discovery au clique sur l'icone star
    onPressStar(discoveryId) {
      // On récupère le tableau de favoris et le user id
        let tabStar = this.state.tabStarSelected;
        let uid = this.state.currentUserId;

        // Si le tableau des favoris inclus l'id de la discovery
        if (tabStar.includes(discoveryId)) { 
          // On supprime l'id du tableau
          tabStar.splice( tabStar.indexOf(discoveryId), 1 );
          
          if (uid != undefined) {
            // On stringify le tableau et update les favoris avec dans firebase pour l'utilisateur en cours
            tabStarString = JSON.stringify(tabStar)
            firebase.database().ref("favorites/").child(uid).update({'tabId': tabStarString })
          }
        }
        else {
          // On ajout l'id au tableau
          tabStar.push(discoveryId); 

          if (uid != undefined) {
            // On stringify le tableau et update les favoris avec dans firebase pour l'utilisateur en cours
            tabStarString = JSON.stringify(tabStar)
            firebase.database().ref("favorites/").child(uid).update({'tabId': tabStarString })
          }
        }

        // Si le composant est monté on met à jour le state
        if (this._isMounted) {
          this.setState({ tabStarSelected: tabStar })
        }
    }

    // Fonction qui update le nombre de upvotes dans les discovery sur firebase, prend en paramètre le nombre de upvotes et l'id de la discovery en question
    addUpvoteInDiscovery(up, discoveryId) {
      // On récupère les discoveries
        firebase.database().ref("discoveries/").once('value', (snapshot) => {
          let data = snapshot.val();
          let discoveries = Object.values(data);
          // On map les discoveries et si un id match on update les upvotes
          discoveries.map((item, index) => {
            if (item.discoveryId == discoveryId) {
              firebase.database().ref("discoveries/").child(index).update({'upvotes': up })
            }
          })
        });
    }

    // Fonction qui update le nombre de downvotes dans les discovery sur firebase, prend en paramètre le nombre de upvotes et l'id de la discovery en question
    addDownvoteInDiscovery(down, discoveryId) {
      // On récupère les discoveries
        firebase.database().ref("discoveries/").once('value', (snapshot) => {
          let data = snapshot.val();
          let discoveries = Object.values(data);
          // On map les discoveries et si un id match on update les downvotes
          discoveries.map((item, index) => {
            if (item.discoveryId == discoveryId) {
              firebase.database().ref("discoveries/").child(index).update({'downvotes': down })
            }
          })
        });
    }
    
    // Fonction qui update les upvotes et les places dans firebase pour l'utilisateur au clique sur le bouton upvotes
    onPressUp(discoveryId, upvotes, downvotes) {
      // On récupère le tableau de upvotes, downvotes et le user id
        let tabUp = this.state.tabUpBtnSelected;
        let tabDown = this.state.tabDownBtnSelected;
        let uid = this.state.currentUserId;
      
        // On met à jour isUp et isDown à false, lorsque l'on clique pour annuler l'état récupèré de discoveries
        if (this._isMounted) {
          this.setState({ isUp: false, isDown: false })
        }

        // Si le tableau de upvotes n'inclus pas l'id de la discovery 
        if (!tabUp.includes(discoveryId)) {
          // On ajoute 1
          let upPlus = upvotes + 1
          
          // On appelle la fonction qui update le nombre de upvotes dans la discovery
          this.addUpvoteInDiscovery(upPlus, discoveryId);

          // On ajoute l'id au tableau
          tabUp.push(discoveryId); 
          
          // On stringify le tableau et update les upvotes avec dans firebase pour l'utilisateur en cours
          if (uid != undefined) {
            tabUpString = JSON.stringify(tabUp)
            firebase.database().ref("upvotes/").child(uid).update({'tabId': tabUpString })
          }
        }
        else {
          // On soustrait 1
          let upMinus = upvotes - 1

          // On appelle la fonction qui update le nombre de upvotes dans la discovery
          this.addUpvoteInDiscovery(upMinus, discoveryId);
          
          // On retire l'id du tableau
          tabUp.splice( tabUp.indexOf(discoveryId), 1 );

          // On stringify le tableau et update les upvotes avec dans firebase pour l'utilisateur en cours
          if (uid != undefined) {
            tabUpString = JSON.stringify(tabUp)
            firebase.database().ref("upvotes/").child(uid).update({'tabId': tabUpString })
          }
        }

        // Si le bouton downvotes est déja selectionné
        if (tabDown.includes(discoveryId)) { 
          // On soustrait 1
          let downMinus = downvotes - 1

          // On appelle la fonction qui update le nombre de downvotes dans la discovery
          this.addDownvoteInDiscovery(downMinus, discoveryId);

          // On retire l'id du tableau
          tabDown.splice( tabDown.indexOf(discoveryId), 1 );

          // On stringify le tableau et update les downvotes avec dans firebase pour l'utilisateur en cours
          if (uid != undefined) {
            tabDownString = JSON.stringify(tabDown)
            firebase.database().ref("downvotes/").child(uid).update({'tabId': tabDownString })
          }
        }

        // Si le component est monté on met à jour le state des upvotes et downvotes
        if (this._isMounted) {
          this.setState({ tabUpBtnSelected: tabUp, tabDownBtnSelected: tabDown })
        }
    }
    
    // Fonction qui update les downvotes et les places dans firebase pour l'utilisateur au clique sur le bouton downvotes
    onPressDown(discoveryId, upvotes, downvotes) {
        // On récupère le tableau de upvotes, downvotes et le user id
        let tabUp = this.state.tabUpBtnSelected;
        let tabDown = this.state.tabDownBtnSelected;
        let uid = this.state.currentUserId;

        // On met à jour isUp et isDown à false, lorsque l'on clique pour annuler l'état récupèré de discoveries
        if (this._isMounted) {
          this.setState({ isUp: false, isDown: false })
        }

        // Si le tableau de downvotes n'inclus pas l'id de la discovery 
        if (tabDown.includes(discoveryId)) { 
          // On soustrait 1 
          let downMinus = downvotes - 1

          // On appelle la fonction qui update le nombre de downvotes dans la discovery
          this.addDownvoteInDiscovery(downMinus, discoveryId);

          // On retire l'id du tableau
          tabDown.splice( tabDown.indexOf(discoveryId), 1 );

          // On stringify le tableau et update les downvotes avec dans firebase pour l'utilisateur en cours
          if (uid != undefined) {
            tabDownString = JSON.stringify(tabDown)
            firebase.database().ref("downvotes/").child(uid).update({'tabId': tabDownString })
          }
        }
        else {
          // On ajoute 1 
          let downPlus = downvotes + 1

          // On appelle la fonction qui update le nombre de downvotes dans la discovery
          this.addDownvoteInDiscovery(downPlus, discoveryId);

          // On ajoute l'id au tableau
          tabDown.push(discoveryId); 

          // On stringify le tableau et update les downvotes avec dans firebase pour l'utilisateur en cours
          if (uid != undefined) {
            tabDownString = JSON.stringify(tabDown)
            firebase.database().ref("downvotes/").child(uid).update({'tabId': tabDownString })
          }
        }

        // Si le bouton upvotes est déja selectionné
        if (tabUp.includes(discoveryId)) { 
          // On soustrait 1 
          let upMinus = upvotes - 1
          
          // On appelle la fonction qui update le nombre de upvotes dans la discovery
          this.addUpvoteInDiscovery(upMinus, discoveryId);

          // On retire l'id du tableau
          tabUp.splice( tabUp.indexOf(discoveryId), 1 );

          // On stringify le tableau et update les upvotes avec dans firebase pour l'utilisateur en cours
          if (uid != undefined) {
            tabUpString = JSON.stringify(tabUp)
            firebase.database().ref("upvotes/").child(uid).update({'tabId': tabUpString })
          }
        }

        // Si le component est monté on met à jour le state des upvotes et downvotes
        if (this._isMounted) {
          this.setState({ tabUpBtnSelected: tabUp, tabDownBtnSelected: tabDown })
        }
    }

    // Fonction qui permet de partager le titre et le contenu d'une discovery au clique sur le bouton share
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
          // Map sur le tableau discovery
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
                          {/* uri pour récupèrer l'image de firebase storage via le lien stocké dans firebase database */}
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
                            <Button rounded style={[styles.btnShare]} onPress={()=>this.onShare(item.title, item.content1)}>
                                <Icon name='share' style={[styles.iconBtnShare]}/>
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
      width:'80%',
      fontSize: 20
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
      backgroundColor: '#288bbf',
      borderWidth: 1,
      borderColor: '#288bbf',
      height: '84%',
      width: '35%',
      justifyContent: 'center',
      elevation: 0,
      textAlign: 'center'
    },
    btnNotSelected: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#288bbf',
      height: '84%',
      width: '35%',
      justifyContent: 'center',
      elevation: 0,
      textAlign: 'center'
    },
    btnShare: {
      backgroundColor: '#288bbf',
      borderWidth: 1,
      borderColor: '#288bbf',
      height: '84%',
      width: '50%',
      justifyContent: 'center',
      textAlign: 'center'
    },
    iconBtnShare: {
      fontSize: 35,
      color: '#FFFFFF'
    },
    iconBtnSelected: {
      fontSize: 35,
      color: '#FFFFFF'
    },
    iconBtnNotSelected: {
      fontSize: 35,
      color: '#288bbf'
    },
    txtBtnSelected: {
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    txtBtnNotSelected: {
      fontWeight: 'bold',
      color: '#288bbf'
    },
    marginUpDownButtons: {
      marginHorizontal: 7
    },
});