import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Card, CardItem, Text, Button, Icon, Left, Body } from 'native-base';
import PropTypes from 'prop-types';
import * as firebase from "firebase";

export default class DiscoveriesComponent extends Component {
    
    // Utilisation de isMounted pour éviter l'erreur "Can't call setState (or forceUpdate) on an unmounted component"
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
      // Récupère via les props le tableau de discoveries et le currentUserId de DiscoveriesScreen
      discoveries: PropTypes.array.isRequired,
      currentUserId: PropTypes.string.isRequired
    };

    componentDidMount() {
      // isMounted à true pour notifier que le component est monté
      this._isMounted = true;

      // Si le composant est monté on exécute les fonctions suivantes toutes les deux secondes
      if (this._isMounted) {
        this._interval = setInterval(() => {
          this.getFavorites();
          this.getUpvotes();
          this.getDownvotes();
        }, 2000);
      }
    }

    componentWillUnmount() {
      // isMounted à false pour notifier que le component est démonté
      this._isMounted = false;
      
      // Quand le composant est démonté on supprime tous les interval
      if (this._isMounted == false) {
        clearInterval(this._interval);
      }
    }

    // Fonction qui récupère les favoris de l'utilisateur
    getFavorites() {
      // On récupère le userId
      let uid = this.props.currentUserId;

      // Si l'utilisateur est bien connecté on récupère le tableau de ses favoris dans firebase qui a été stringify, 
      // on le parse et on le met dans le state tabStarSelected sinon on y met un tableau vie
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

    // Fonction qui récupère les upvotes de l'utilisateur
    getUpvotes() {
      // On récupère le userId
      let uid = this.props.currentUserId;

      // Si l'utilisateur est bien connecté on récupère le tableau de ses upvotes dans firebase qui a été stringify, 
      //on le parse et on le met dans le state tabUpBtnSelected sinon on y met un tableau vie
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

    // Fonction qui récupère les downvotes de l'utilisateur
    getDownvotes() {
      // On récupère le userId
      let uid = this.props.currentUserId;

      // Si l'utilisateur est bien connecté on récupère le tableau de ses downvotes dans firebase qui a été stringify, 
      // on le parse et on le met dans le state tabDownBtnSelected sinon on y met un tableau vie
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

    // Fonction qui met en favoris une discovery au clique sur l'icone star
    onPressStar(discoveryId) {
        // On récupère le tableau de favoris et le user id
        let tabStar = this.state.tabStarSelected;
        let uid = this.props.currentUserId;

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
        let uid = this.props.currentUserId;
      
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
        let uid = this.props.currentUserId;
      
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
    
    // Fonction renvoie à la page d'une discovery sur laquelle on clique, prend en pramètre l'id de la discovery et la catégorie
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
          // Map sur le tableau discoveries
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
                        <CardItem style={{justifyContent: 'center'}}>
                          <TouchableOpacity onPress={()=>this.goToDiscovery(discovery.discoveryId, discovery.category)}>
                            {/* uri pour récupèrer l'image de firebase storage via le lien stocké dans firebase database */}
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
                            <Button rounded style={[styles.btnShare]} onPress={()=>this.onShare(discovery.title, discovery.content1)}>
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
      alignSelf: 'center',
      justifyContent: 'center'
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