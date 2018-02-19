import React, { Component } from 'react';
import {
  StackNavigator,
} from 'react-navigation';

import containers from './containers'

const AppNavigator = StackNavigator({
  Login: {screen: containers.Login},
  Home: {
    screen: containers.ToDo,
    navigationOptions: {
      header: null,
    }
  },
  Register: {screen: containers.Register}
});

export default class App extends Component{
  render(){
    return <AppNavigator />;
  }
}