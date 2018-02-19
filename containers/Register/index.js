import React, { Component } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    Button,
    View,
    StyleSheet,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import { config } from '../../constants/string';
import Api from '../../helper/api';
import { Dropdown } from 'react-native-material-dropdown';
import DatePicker from 'react-native-datepicker';

export default class Register extends Component{
    constructor(props){
        super(props);
        this.state = {
            txtUsername: null,
            txtPassword: null,
            txtRetypePassword: null,
            txtGender: 'Male',
            txtBirthdate: null,
            isLoading: false
        }
    }

    validate(){
        const {
            txtUsername,
            txtPassword,
            txtRetypePassword,
            txtGender,
            txtBirthdate
        } = this.state;

        if(txtUsername == null){
            alert("Username tidak boleh kosong");
        }
        else if(txtGender == null){
            alert("Gender tidak boleh kosong");
        }
        else if(txtBirthdate == null){
            alert("Birthdate tidak boleh kosong");
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
            this.setState({ isLoading: true });
            const url = `${config.host}${config.register}`;
            const body = {
                username: this.state.txtUsername,
                password: this.state.txtPassword,
                gender: this.state.txtGender,
                birthdate: this.state.txtBirthdate
            }
            Api.post(url, body).then(resp => {
                if(resp.success){
                    this.setState({ isLoading: false });
                    alert("Success !!");
                    this.props.navigation.goBack();
                }else{
                    this.setState({ isLoading: false });
                    alert(resp.message);
                }
            }).catch(error => {
                this.setState({ isLoading: false });
                alert(error)
            });
        }
        catch(error){
            alert(error);
        }
    }

    render(){
        const gender = [{
            value:'Male'
        },
        {
            value:'Female'
        }];
        return(
            this.state.isLoading ? (
                <View style={styles.container}>
                    <ActivityIndicator
                        size="large"/>
                </View>
            ) : 
            (
                <View style={styles.container}>
                    <TextInput placeholder="Username" onChangeText={(txtUsername) => this.setState({txtUsername})} />
                    <TextInput placeholder="Password" secureTextEntry={true} onChangeText={(txtPassword) => this.setState({txtPassword})} />
                    <TextInput placeholder="Retype Password" secureTextEntry={true} onChangeText={(txtRetypePassword) => this.setState({txtRetypePassword})} />
                    <Dropdown
                        label="Gender"
                        data={gender}
                        value={this.state.txtGender}
                    />
                    <DatePicker
                        //style={styles.datePicker}
                        maxDate={new Date()}
                        date={this.state.txtBirthdate}
                        mode="date"
                        androidMode="calendar"
                        placeholder="Birthdate"
                        format="MM-DD-YYYY"
                        showIcon={false}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        border={true}
                        //customStyles={datePickerCustomStyle}
                        onDateChange={(date) => this.setState({
                            txtBirthdate: date
                        })}
                        />
                    <Button title="Sign Up" onPress={() => this.validate()} />
                    <TouchableOpacity
                        style={styles.login}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Text>Already have an account ? Login</Text>
                    </TouchableOpacity>
                </View>
            )
        )
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