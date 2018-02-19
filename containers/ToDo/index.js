import React, { Component } from 'react';
import {
    AsyncStorage,
    FlatList,
    StyleSheet
} from 'react-native';
import {
    Container,
    Header,
    View,
    Button,
    Icon,
    Fab,
    Tabs,
    Tab,
    ScrollableTab
} from 'native-base'

import Login from '../Login';
import Register from '../Register';

import Moment from 'moment';
import Api from '../../helper/api'
import { config } from '../../constants/string';

export default class ToDo extends Component{
    constructor(props){
        super(props);
        this.state = {
            text: null,
            data: [],
            users: null,
            category: []
        }
    }

    async addNewTask(){
        //this.setState({ isLoading: true });
        try{
            const { users } = this.state;
            const dueDate = Moment(new Date()).add(1, 'Day').format('YYYY-MM-DD');
    
            const url = `${config.host}${config.task}`;
            const body = {
                userId: users._id,
                status: false,
                task: this.state.text,
                dueDate: dueDate,
                category: 'pengingat'
            };
    
            Api.post(url, body).then(resp => {
                if(resp.success){
                    const data = this.state.data;
                    data.push(body);
                    this.setState({
                        text: null,
                        data: data
                    });
                    this.saveData(data);
                }else{
                    this.setState({ isLoading: false });
                    alert(resp.message);
                }
            }).catch(error => {
                this.setState({ isLoading: false });
                alert(error);
            });
        }catch(error){
            alert(error);
        }
    }

    updateChecked(item){
        const data = this.state.data;
        const index = data.indexOf(item);
        data[index].checked = !data[index].checked;
        this.setState({
            data: data
        });
        this.saveData(data);
    }

    deleteTask(item){
        const data = this.state.data;
        const index = data.indexOf(item);
        data.splice(index, 1);
        this.setState({
            data: data
        });
        this.saveData(data);
    }

    async saveData(data){
        try{
            await AsyncStorage.setItem('ToDo', JSON.stringify(data));
        }
        catch(error){
            alert(error);
        }
    }

    async getTaskByUserId(){
        try{
            const { users } = this.state;
    
            const url = `${config.host}${config.task}${'/' + users._id}`;
            alert(url);
            Api.get(url).then(resp => {
                if(resp.success && resp.data != null){
                    const data = JSON.parse(resp.data);
                    this.setState({
                        data: data
                    });
                    alert(data);
                    this.saveData(data);
                }else{
                    alert(resp.message);
                }
            }).catch(error => {
                alert(error);
            });
        }catch(error){
            alert(error);
        }
    }

    async getUserAsyncStorage(){
        try{
            const data = await AsyncStorage.getItem('users');
            if(data !== null){
                this.setState({
                    users: JSON.parse(data)
                });
            }
        }catch(error){
            alert(error);
        }
    }

    async componentWillMount(){
        await this.getUserAsyncStorage();
        this.getTaskByUserId();
    }

    render(){
        const {data,text} = this.state;
        return(
            // <View style={styles.container}>
            //     <Text>Welcome { this.props.navigation.state.params.username }</Text>
            //     <TextInput
            //         onChangeText={(text) => this.setState({ text })}
            //         onSubmitEditing={() => this.addNewTask()}
            //         style={{ margin: 10 }}
            //         placeholder="Input new Task"
            //         value={text}
            //     />
            //     <FlatList
            //         data={data}
            //         renderItem={({item}) =>
            //             <TaskItem
            //                 item={item}
            //                 onChecked={(item) => this.updateChecked(item)}
            //                 onDeleted={(item) => this.deleteTask(item)}
            //             />
            //         }
            //         extraData={this.state}
            //     />
            // </View>
            <Container>
                <Header hasTabs/>
                <View style={{ flex: 1 }}>
                    <Tabs renderTabBar={()=> <ScrollableTab />}>

                        {/* <Tab heading="Tab1">
                            <Login />
                        </Tab>
                        <Tab heading="Tab2">
                            <Register />
                        </Tab>
                        <Tab heading="Tab3">
                            <Login />
                        </Tab>
                        <Tab heading="Tab4">
                            <Register />
                        </Tab>
                        <Tab heading="Tab5">
                            <Login />
                        </Tab> */}
                    </Tabs>
                    <Fab
                        style={{ backgroundColor: '#5067FF'}}
                        position="bottomRight"
                        onPress={() => alert("On Click")}
                    >
                    <Icon name="add" />
                    </Fab>
                </View>
            </Container>
        );
    }
}

class TaskItem extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { item, onDeleted, onChecked } = this.props;
        return(
            <View style={{ flex: 1, padding: 5, flexDirection: 'row'}}>
                <TouchableOpacity style={{ flex: 0.1 }} onPress={() => onChecked(item)}>
                    <Image source={item.checked ? require('../../assets/images/checkbox-marked-outline.png') :
                        require('../../assets/images/checkbox-blank-outline.png')} />
                </TouchableOpacity>
                <Text style={{ flex: 1, paddingTop: 5, textDecorationLine: 'none'}}>
                    {item.task}
                </Text>
                <TouchableOpacity onPress={() => onDeleted(item)}>
                    <Image source={require('../../assets/images/delete.png')} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: 22,
        backgroundColor: '#ecf0f1',
    }
});