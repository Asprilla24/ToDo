import React, {Component} from 'react';
import {
    Text,
    TextInput,
    Button,
    View,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import {
    NavigationActions
} from 'react-navigation';
import { config } from '../../constants/string';
import Api from '../../helper/api';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            txtUsername: null,
            txtPassword: null,
            isLoading: false
        }
    }

    async onLogin(){
        this.setState({ isLoading: true });
        const url = `${config.host}${config.login}`;
        const body = {
            username: this.state.txtUsername,
            password: this.state.txtPassword
        };

        Api.post(url, body).then(resp => {
            if(resp.success){
                this.saveData(resp.data);
            }else{
                this.setState({ isLoading: false });
                alert(resp.message);
            }
        }).catch(error => {
            this.setState({ isLoading: false });
            alert(error)
        });
    }

    async saveData(data){
        try{
            await AsyncStorage.setItem('users', JSON.stringify(data));
            this.setState({ isLoading: false });
            this.navigateToHome(data);
        }
        catch(error){
            this.setState({ isLoading: false });
            alert(error);
        }
    }

    navigateToHome(data){
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Home', params: {username: data.username}})],
        });
        this.props.navigation.dispatch(resetAction);
    }

    async componentWillMount(){
        try{
            const data = await AsyncStorage.getItem('users');
            const dataLogin = JSON.parse(data);
            if(dataLogin !== null){
                this.navigateToHome(dataLogin);
            }
        }catch(error){
            alert(error);
        }
    }

    render(){
        return(
            this.state.isLoading ? (
                <View style={styles.container}>
                    <ActivityIndicator
                        size="large"/>
                </View>
            ) : 
            (
                <View style={styles.container}>
                    <TextInput placeholder="Username" onChangeText={(txtUsername) => this.setState({txtUsername})}/>
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
            )
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