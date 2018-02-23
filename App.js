
//Importing Text, StyleSheet, View, ListView, TextInput, ActivityIndicator and Alert component.
import React, { Component } from 'react';
 
import { Text, StyleSheet, View, ListView, TextInput, ActivityIndicator, Alert,TouchableOpacity,Linking } from 'react-native';
 
export default class MyProject extends Component {
 
 //Creating constructor() in class. Creating 2 State variables named as isLoading and text. 
 //isLoading state is used to show and hide the ActivityIndicator and text state is used to set text inside TextInput. 
 //Declared a global array named as arrayholder=[]. This Array is used to Filter the ListView.
  constructor(props) {
 
    super(props);
 
    this.state = {
 
      isLoading: true,
      text: '',
    
    }
 
    this.arrayholder = [] ;
  }
 
  componentDidMount() {

    // Creating Fetch() API in componentDidMount() method. The Fetch() Web API is used in this project to Parse JSON from given HTTP URL. 
    //storing the Parsed JSON inside arrayholder Array.
 
    return fetch('http://192.168.1.9:4000/livestreams')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.streams),
        }, function() {
 
          // In this block you can do something with new state.
          this.arrayholder = responseJson.streams ;
 
        });
      })
      .catch((error) => {
        console.error(error);
      });
      
  }


 //Created SearchFilterFunction() and passing Text inside it as argument. 
 //Now we would filter the JSON array according to given value passed as argument. 
 //After filtering data we would set the newly searched data in dataSource state.
    SearchFilterFunction(text){
     
     const newData = this.arrayholder.filter(function(item){
         const itemData = item.channel.display_name.toUpperCase()
         const textData = text.toUpperCase()
         return itemData.indexOf(textData) > -1
     })
     this.setState({
         dataSource: this.state.dataSource.cloneWithRows(newData),
         text: text
     })
 }
 
 //Creating ListViewItemSeparator() function to show a horizontal line between each ListView element 
  ListViewItemSeparator = () => {
    return (
      <View
        style={{
          height: .5,
          width: "100%",
          backgroundColor: "#000",
        }}
      />
    );
  }
 
 
  render() {

    /*IF condition in render’s block, is used to Show and Hide the ActivityIndicator component after parsing the JSON.*/
    /*Root View is created in render’s return block. */
    
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
 
    return (

    /*TextInput and ListView component is created in the root view. This is used to get search input from user*/
   
 
      <View style={styles.MainContainer}>
 
      <TextInput 
       style={styles.TextInputStyleClass}
       onChangeText={(text) => this.SearchFilterFunction(text)}
       value={this.state.text}
       underlineColorAndroid='transparent'
       placeholder="Search Here For Live Creators"
        />

    
 
        <ListView
 
          dataSource={this.state.dataSource}
 
          renderSeparator= {this.ListViewItemSeparator}
 
          renderRow={(rowData) => 
          <TouchableOpacity style={styles.rowViewContainer} onPress={() => Linking.openURL(rowData.channel.url)}>
            <Text style={{color: 'blue'}}>
            {rowData.channel.display_name}
            </Text>
              </TouchableOpacity>}
 
          //onPress={this.GetListViewItem.bind(this, rowData.channel.display_name)} >{rowData.channel.display_name}</Text>}
 
          enableEmptySections={true}
 
          style={{marginTop: 10}}
 
        />
 
      </View>
    );
  }
}
 
/*Creating Styles for the classes */

const styles = StyleSheet.create({
 
 MainContainer :{
 
  justifyContent: 'center',
  flex:1,
  margin: 7,
  padding: 10
 
  },
 
 rowViewContainer: {
   padding: 10
  },
 
  TextInputStyleClass:{
        
   textAlign: 'center',
   height: 40,
   borderWidth: 1,
   borderColor: '#009688',
   borderRadius: 7 ,
   backgroundColor : "#FFFFFF"
        
   }
 
});