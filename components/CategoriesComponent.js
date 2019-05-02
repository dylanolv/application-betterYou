import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem, Text, Left, Right, Icon } from 'native-base';
import PropTypes from 'prop-types';

export default class CategoriesComponent extends Component {
    
    constructor(props) {
        super(props)
        this.state = {};
    }

    static propTypes = {
        categories: PropTypes.array.isRequired
    };
    
    goToCategory(category) {
      this.props.navigation.navigate('Category', {
        category: category
      })
    }
    
    render() {
        return (
            this.props.categories.map((category, index) => {
                return (
                    <ListItem key={index}>
                        <Left>
                            <TouchableOpacity onPress={()=>this.goToCategory(category)}>
                                <Text>{category}</Text>
                            </TouchableOpacity>
                        </Left>
                        <Right>
                            <Icon name="arrow-forward" />
                        </Right>
                    </ListItem>
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
    }
});