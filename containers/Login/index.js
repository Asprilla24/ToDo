import React, {Component} from 'react';
import {
    Text,
    TextInput,
    Button,
    View,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';
import {
    NavigationActions
} from 'react-navigation';

export default class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            txtEmail: null,
            txtPassword: null
        }
    }

    async onLogin(){
        try{
            const data = await AsyncStorage.getItem('login');
            if(data !== null){
                const login = JSON.parse(data);
                const {
                    txtEmail,
                    txtPassword
                } = this.state;
                if(login.password == txtPassword && login.email == txtEmail){
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({routeName: 'Home'})],
                    });
                    this.props.navigation.dispatch(resetAction);
                }
            }
        }
        catch(error){
            alert(error);
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <TextInput placeholder="Email" onChangeText={(txtEmail) => this.setState({txtEmail})}/>
                <TextInput placeholder="Password" secureTextEntry={true} onChangeText={(txtPassword) => this.setState({txtPassword})}/>
                <Button
                    onPress={() => this.onLogin()}
                    title="LOGIN"
                />
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Register')}
                    style={styles.signup}
                >
                    <Text>Dont have an account ? Sign Up</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 30
    },
    signup: {
        justifyContent:'center',
        alignItems: 'center',
        padding: 10
    }
});