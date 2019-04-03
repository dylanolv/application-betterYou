import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";

export default class QuoteScreen extends React.Component {
  static navigationOptions = {
    title: "Quotes"
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
