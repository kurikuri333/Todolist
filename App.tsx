import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
 
export default class App extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {
    }
  }
 
  render() {
    return (
      <View style={styles.container}>
        {/* ボタン1 */}
        <TouchableHighlight style = {styles.button1} 
                            onPress= {() => console.log("press1")}
                            activeOpacity={0.6}
                            underlayColor="gray"
        >
          <Text style = {styles.fontStyle}>button1</Text>
        </TouchableHighlight>
 
        {/* ボタン3 */}
        <TouchableHighlight style = {styles.button3} 
                    onPress= {() => console.log("press3")}
                    activeOpacity={0.6}
                    underlayColor="lightgray"
        >
          <Text style = {[styles.fontStyle, {color: "black"}]}>button3</Text>
        </TouchableHighlight>
        
        {/* ボタン4 */}
        <TouchableHighlight style = {styles.button4} 
                    onPress= {() => console.log("press4")}
                    activeOpacity={0.6}
                    underlayColor="pink"
        >
          <Text style = {styles.fontStyle}>button4</Text>
        </TouchableHighlight>
 
        {/* ボタン5 */}
        <TouchableHighlight style = {styles.button5}
                    onPress= {() => console.log("press4")}
                    activeOpacity={0.6}
                    underlayColor="gray"
        >
          <Text style = {styles.fontStyle}>button5</Text>
        </TouchableHighlight>
 
        {/* ボタン6 */}
        <TouchableHighlight style = {styles.button6}
                    onPress= {() => console.log("press4")}
                    activeOpacity={0.6}
                    underlayColor="lightgray"
        >
          <Text style = {[styles.fontStyle, {fontSize: 40}]}>+</Text>
        </TouchableHighlight>
 
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100
  },
  button1: {
    backgroundColor: "black",
    padding: 20,
    width: "40%",
    alignSelf: "center",
    marginTop: 50,
  },
  button2: {
    backgroundColor: "blue",
    padding: 10,
    width: "40%",
    alignSelf: "center",
    marginTop: 50,
  },
  button3: {
    backgroundColor: "white",
    padding: 10,
    width: "40%",
    alignSelf: "center",
    marginTop: 50,
    borderWidth: 1,
    borderColor: "black",
  },
  button4: {
    backgroundColor: "tomato",
    padding: 20,
    width: "40%",
    alignSelf: "center",
    marginTop: 50,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 15,
  },
  button5: {
    backgroundColor: "black",
    padding: 20,
    width: "40%",
    alignSelf: "center",
    marginTop: 50,
  	shadowColor: "black",
  	shadowOffset: {
  		height: 4,
  		width: 4
  	},
  	shadowRadius: 5,
  	shadowOpacity: 0.8,
  },
  button6: {
    backgroundColor: "lime",
    padding: 10,
    width: 70,
    alignSelf: "center",
    marginTop: 50,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 50,
  },
  fontStyle: {
    color: "white",
    alignSelf: "center",
    fontSize: 24,
  }
});