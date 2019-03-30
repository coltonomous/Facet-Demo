import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonStyles from '../../Styles/styles';
import LoginForm from './LoginForm';

export default class Login extends Component {
    render(){
        return(
            <KeyboardAwareScrollView 
                resetScrollToCoords={{x:0, y:0}} 
                contentContainerStyle={CommonStyles.screenStyles.container} 
                enableOnAndroid={true}
            >
                <View style={CommonStyles.loginStyles.loginContainer}>
                    <Image
                        resizeMode="contain" 
                        style={CommonStyles.loginStyles.logo} 
                        source={require('../images/placeholder_logo.png')}
                    />
                </View>
                <View style={CommonStyles.formStyles.formContainer}>
                    <LoginForm />
                </View>
            </KeyboardAwareScrollView>
        );
    }
}
