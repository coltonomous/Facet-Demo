import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonStyles from '../../Styles/styles';
import ProfileForm from './ProfileForm';

export default class UpdateProfile extends Component {

    constructor(props){
        super(props);
        this.state = this.props.navigation.state.params.data;
    }

    render(){
        return(
            <KeyboardAwareScrollView 
                resetScrollToCoords={{x:0, y:0}} 
                contentContainerStyle={CommonStyles.screenStyles.container} 
                enableOnAndroid={true}
            >
                <View style={CommonStyles.formStyles.formContainer}>
                    <ProfileForm onUpdate={this.props.navigation.state.params.onUpdate} data={this.state}/>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}