import React, { Component } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    Button,
    View,
    StyleSheet,
    AsyncStorage
} from 'react-native';

export default class Register extends Component{
    constructor(props){
        super(props);
        this.state = {
            txtName: null,
            txtEmail: null,
            txtPassword: null,
            txtRetypePassword: null,
        }
    }

    validate(){
        const {
            txtName,
            txtEmail,
            txtPassword,
            txtRetypePassword
        } = this.state;

        if(txtName == null){
            alert("Nama tidak boleh kosong");
        }
        else if(txtEmail == null){
            alert("Email tidak boleh kosong");
        }
        else if(txtPassword == null){
            alert("Password tidak boleh kosong");
        }
        else if(txtPassword != txtRetypePassword){
            alert("Password yang anda tulis ulang tidak benar");
        }else{
            this.signUp();
        }
    }

    async signUp(){
        try{
            const login = {
                email: this.state.txtEmail,
                name: this.state.txtName,
                password: this.state.txtPassword
            }
            await AsyncStorage.setItem('login', JSON.stringify(login));
            alert("Success !!");
            this.props.navigation.goBack();
        }
        catch(error){
            alert(error);
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <TextInput placeholder="Name" onChangeText={(txtName) => this.setState({txtName})} />
                <TextInput placeholder="Email" keyboardType="email-address" onChangeText={(txtEmail) => this.setState({txtEmail})} />
                <TextInput placeholder="Password" secureTextEntry={true} onChangeText={(txtPassword) => this.setState({txtPassword})} />
                <TextInput placeholder="Retype Password" secureTextEntry={true} onChangeText={(txtRetypePassword) => this.setState({txtRetypePassword})} />
                <Button title="Sign Up" onPress={() => this.validate()} />
                <TouchableOpacity
                    style={styles.login}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <Text>Already have an account ? Login</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 30
    },
    login: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    }
});