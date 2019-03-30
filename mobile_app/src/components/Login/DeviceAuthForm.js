import React, {Component} from 'react';
import {Alert, AsyncStorage, View, Text, TextInput, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import APIService from '../../Services/APIService';
import CommonStyles from '../../Styles/styles';
import { onSignIn } from '../../auth';
//import {onSignIn, isMember} from '../../auth';

class DeviceAuthForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            token: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit(){
        AsyncStorage.getItem("PHONE_HASH", (err, result) => {
            if(err){
                console.error("Problem retrieving user phone for device authentication.");
            } else{
                this.submitAuth(this.state.token, result);
            }
        });
    }

    submitAuth = async (token, phone_hash) => {
        APIService.ProfileLoginRequest(token, phone_hash).then((result) => {
            if(result.token){
                onSignIn(result.token).then(() => this.props.navigation.navigate('SignedIn'));
            } else{
                Alert.alert('Device authentication failed!');
            }
        });
    }

    render(){
        return(
            <View>
                <TextInput style = {CommonStyles.formStyles.input} 
                    autoCapitalize="none" 
                    onChangeText={ TextInputValue => this.setState({token: TextInputValue})} 
                    autoCorrect={false} 
                    keyboardType='default' 
                    returnKeyType="next" 
                    placeholder='Enter your SMS auth code' 
                    placeholderTextColor='rgba(225,225,225,0.7)'/>

                <TouchableOpacity style={CommonStyles.buttonStyles.buttonContainer} 
                    onPress={this.handleSubmit}>
                    <Text  style={CommonStyles.buttonStyles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default withNavigation(DeviceAuthForm);