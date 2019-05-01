import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
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
    
    goToCategory(index, title) {
      this.props.navigation.navigate('Discovery', {
        index: index,
        title: title
      })
    }
    
    render() {
        return (
            this.props.categories.map((category, index) => {
                return (
                    <ListItem key={index}>
                        <Left>
                            <Text>{category.category}</Text>
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