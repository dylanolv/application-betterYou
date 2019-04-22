import React from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from "react-native";

export default class QuotesScreen extends React.Component {
  static navigationOptions = {
    title: "Quotes"
  };

  //Define your state for your component.
  state = {
    //Assing a array to your quoteList state
    quoteList: [],
    //Have a loading state where when data retrieve returns data.
    loading: true
  };

  //Define your componentDidMount lifecycle hook that will retrieve data.
  //Also have the async keyword to indicate that it is asynchronous.
  async componentDidMount() {
    //Have a try and catch block for catching errors.
    try {
      //Assign the promise unresolved first then get the data using the json method.
      const quoteapiCall = await fetch("http://192.168.56.1:6578/api/quotes/random");
      const quote = await quoteapiCall.json();
      this.setState({ quoteList: quote, loading: false });
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }

  //Define your renderItem method the callback for the FlatList for rendering each item, and pass data as a argument.
  renderItem(data) {
    return data.map(function(data, i) {
      return (
        <View key={i}>
          <Text>{data.author}</Text>
        </View>
      );
    });
  }

  render() {
    //Destruct quoteList and Loading from state.
    const { quoteList, loading } = this.state;

    //If loading to false, return a FlatList which will have data, rednerItem, and keyExtractor props used.
    //Data contains the data being  mapped over.
    //RenderItem a callback return UI for each item.
    //keyExtractor used for giving a unique identifier for each item.
    if (!loading) {
      return (
        <View
          data={quoteList}
          renderItem={this.renderItem}
        />
      );
    } else {
      return <ActivityIndicator />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});