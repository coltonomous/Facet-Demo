import React, {Component} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonStyles from '../../Styles/styles';
import CreateCustomerForm from './CreateCustomerForm';

export default class AddCustomer extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return(
            <KeyboardAwareScrollView 
                resetScrollToCoords={{x:0, y:0}} 
                contentContainerStyle={CommonStyles.screenStyles.container} 
                enableOnAndroid={true}
            >
                <View style={CommonStyles.screenStyles.container}>
                    <View style={CommonStyles.formStyles.formContainer}>
                        <CreateCustomerForm />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}