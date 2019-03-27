import React, {Component} from 'react';
import {Alert, AsyncStorage, View, Text, TextInput, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-elements';
import APIService from '../../Services/APIService';
import CommonStyles from '../../Styles/styles';
import {withNavigation} from 'react-navigation';

class CreateCustomerForm extends Component {

    constructor(props){
        super(props);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleUpdate(){
        const {
            customer_phone,
            customer_fname,
            customer_lname,
            customer_email
        } = this.state;

        if(!customer_phone || !customer_fname || !customer_lname){
            Alert.alert("Missing required information to create customer!");
        } else{
            let cleanedPhone = customer_phone.replace(/\D/g,'');    
            this.updateCustomer(this.state.user_key, this.state.phone_hash, 
                {customer_phone: cleanedPhone, customer_fname: customer_fname, customer_lname: customer_lname, customer_email: customer_email}
            );
            this.props.navigation.goBack();
        }
    }

    updateCustomer = async (user_key, phone, req_body) => {
        APIService.CustomerCreateRequest(user_key, phone, req_body).then((result) => {
            if(result){
                console.log("Customer info was updated successfully.");
                this.props.navigation.navigate('Home', params=this.state)
            } else{
                Alert.alert("Update to customer info failed!");
            }
        });
    }

    componentDidMount(){
        // Grab user key
        AsyncStorage.getItem('USER_KEY', (err, auth_key) => {
            if(err){
                console.error("Error retrieving user key for customer form.");
            } else{

                // Grab phone hash
                AsyncStorage.getItem('PHONE_HASH', (err, phone_hash) => {
                    if(err){
                        console.error("Error retrieving user phone for customer form.");
                    } else{
                        this.setState({
                            phone_hash: phone_hash,
                            user_key: auth_key,
                        });
                    }
                });
            }
        });
    };

    render(){
        return(
            <View>
                <Card
                    title={"Please enter some customer information to display. Fields marked with * are required. Note: customers are notified via text, so the phone number provided should belong to a mobile device."}
                    containerStyle={CommonStyles.cardStyles.cardContainer}
                >
                    <TextInput style = {CommonStyles.formStyles.input} 
                        autoCapitalize="none" 
                        onChangeText={ TextInputValue => this.setState({customer_phone: TextInputValue})} 
                        autoCorrect={false} 
                        keyboardType='phone-pad' 
                        returnKeyType="done" 
                        placeholder='Customer Phone *' 
                        placeholderTextColor='rgba(225,225,225,0.7)'/>

                    <TextInput style = {CommonStyles.formStyles.input} 
                        autoCapitalize="none" 
                        onChangeText={ TextInputValue => 
                            this.setState({customer_fname: TextInputValue})}
                        onSubmitEditing={() => this.lnameInput.focus()} 
                        autoCorrect={false}
                        returnKeyType="next" 
                        placeholder=' Customer First Name *' 
                        placeholderTextColor='rgba(225,225,225,0.7)'/>

                    <TextInput style = {CommonStyles.formStyles.input} 
                        autoCapitalize="none" 
                        onChangeText={ TextInputValue => 
                            this.setState({customer_lname: TextInputValue})}
                        ref={(input)=> this.lnameInput = input}
                        onSubmitEditing={() => this.emailInput.focus()} 
                        autoCorrect={false}  
                        returnKeyType="next" 
                        placeholder='Customer Last Name *' 
                        placeholderTextColor='rgba(225,225,225,0.7)'/>

                    <TextInput style = {CommonStyles.formStyles.input} 
                        autoCapitalize="none" 
                        onChangeText={ TextInputValue => 
                            this.setState({customer_email: TextInputValue})}
                        ref={(input)=> this.emailInput = input}
                        autoCorrect={false} 
                        keyboardType='email-address' 
                        returnKeyType="next" 
                        placeholder='Customer Email' 
                        placeholderTextColor='rgba(225,225,225,0.7)'/>

                    <TouchableOpacity style={CommonStyles.buttonStyles.buttonContainer} 
                        onPress={() => {
                            this.handleUpdate();
                        }}>
                        <Text  style={CommonStyles.buttonStyles.buttonText}>Add Customer</Text>
                    </TouchableOpacity>
                </Card>
            </View>
        );
    }
}
export default withNavigation(CreateCustomerForm);