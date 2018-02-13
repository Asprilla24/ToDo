import React, { Component } from 'react';
import {
    AsyncStorage,
    TouchableOpacity,
    Text,
    TextInput,
    FlatList,
    Image,
    View,
    StyleSheet
} from 'react-native';

export default class ToDo extends Component{
    constructor(props){
        super(props);
        this.state = {
            text: null,
            data: []
        }
    }

    addNewTask(){
        const data = this.state.data;
        data.push({
            checked: false,
            task: this.state.text
        });
        this.setState({
            text: null,
            data: data
        });
        this.saveData(data);
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

    async componentWillMount(){
        try{
            const data = await AsyncStorage.getItem('ToDo');
            if(data !== null){
                this.setState({
                    data: JSON.parse(data)
                });
            }
        }catch(error){
            alert(error);
        }
    }

    render(){
        const {data,text} = this.state;
        return(
            <View style={styles.container}>
                <TextInput
                    onChangeText={(text) => this.setState({ text })}
                    onSubmitEditing={() => this.addNewTask()}
                    style={{ margin: 10 }}
                    placeholder="Input new Task"
                    value={text}
                />
                <FlatList
                    data={data}
                    renderItem={({item}) =>
                        <TaskItem
                            item={item}
                            onChecked={(item) => this.updateChecked(item)}
                            onDeleted={(item) => this.deleteTask(item)}
                        />
                    }
                    extraData={this.state}
                />
            </View>
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