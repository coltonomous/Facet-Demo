import React, {Component} from 'react';
import {Alert, View, Text, TextInput, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import APIService from '../../Services/APIService';
import CommonStyles from '../../Styles/styles';
import { onRegister } from '../../auth';

class LoginForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            phone: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }  

    handleSubmit(){
        this.submitLogin(this.state.phone);
    }

    submitLogin = async (phone) => {
        let cleanedPhone = phone.replace(/\D/g,'');     
        APIService.ProfileCreateRequest(cleanedPhone).then((result) => {
            if(result){
                onRegister(cleanedPhone).then(() => this.props.navigation.navigate('Authenticate'));
            } else{
                Alert.alert('Login failed!');
            }
        })
    }

    render(){
        return(
            <View>
                <TextInput style = {CommonStyles.formStyles.input} 
                    autoCapitalize="none" 
                    onChangeText={ TextInputValue => this.setState({phone: TextInputValue})} 
                    autoCorrect={false} 
                    keyboardType='phone-pad' 
                    returnKeyType="done" 
                    placeholder='Enter your phone number' 
                    placeholderTextColor='rgba(225,225,225,0.7)'/>

                <TouchableOpacity style={CommonStyles.buttonStyles.buttonContainer} 
                    onPress={this.handleSubmit}>
                    <Text  style={CommonStyles.buttonStyles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
export default withNavigation(LoginForm);