import React, {Component} from 'react';
import {Alert, AsyncStorage, View, Text, TextInput, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-elements';
import APIService from '../../Services/APIService';
import CommonStyles from '../../Styles/styles';
import {withNavigation} from 'react-navigation';

class ProfileForm extends Component {

    constructor(props){
        super(props);
        this.state = this.props.data;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Passes state back to 
    goBack(){
        this.props.navigation.goBack();
        this.props.onUpdate(this.state);
    }

    handleSubmit(){
        const {
            fname,
            lname, 
            vendor_name,
        } = this.state;

        if(!fname || !lname || !vendor_name){
            Alert.alert("Missing required information!");
        } else{
            this.submitProfile(this.state.user_key, this.state);
            this.goBack();
        }
    }

    submitProfile = async (user_key, request_body) => {
        APIService.ProfileUpdateRequest(user_key, request_body).then((result) => {
            if(result){
                console.log("Profile update was successful!");
            } else{
                Alert.alert("Account info update failed!");
            }
        });
    }

    componentDidMount(){
        // Grab auth key
        AsyncStorage.getItem('USER_KEY', (err, auth_key) => {
            if(err){
                console.error("Error retrieving user key for profile form.");
            } else{
                this.setState({
                    user_key: auth_key
                });
            }
        });

        // Grab phone hash
        AsyncStorage.getItem('PHONE_HASH', (err, phone_hash) => {
            if(err){
                console.error("Error retrieving user phone for profile form.");
            } else{
                this.setState({
                    phone_hash: phone_hash
                });
            }
        });
    }

    render(){
        return(
            <View>
                <Card
                    title={"Update your profile. Fields marked with * are required to be able to add customers."}
                    containerStyle={CommonStyles.cardStyles.cardContainer}
                >
                    <Text style={CommonStyles.cardStyles.sectionText}>User Information</Text>

                    <TextInput style = {CommonStyles.formStyles.input} 
                        autoCapitalize="none" 
                        onChangeText={ TextInputValue => 
                            this.setState({fname: TextInputValue})}
                        onSubmitEditing={() => this.lnameInput.focus()} 
                        autoCorrect={false}
                        returnKeyType="next" 
                        placeholder='First Name *' 
                        placeholderTextColor='rgba(225,225,225,0.7)'/>

                    <TextInput style = {CommonStyles.formStyles.input} 
                        autoCapitalize="none" 
                        onChangeText={ TextInputValue => 
                            this.setState({lname: TextInputValue})}
                        ref={(input)=> this.lnameInput = input}
                        onSubmitEditing={() => this.emailInput.focus()} 
                        autoCorrect={false}  
                        returnKeyType="next" 
                        placeholder='Last Name *' 
                        placeholderTextColor='rgba(225,225,225,0.7)'/>

                    <TextInput style = {CommonStyles.formStyles.input} 
                        autoCapitalize="none" 
                        onChangeText={ TextInputValue => 
                            this.setState({email: TextInputValue})}
                        ref={(input)=> this.emailInput = input}
                        onSubmitEditing={() => this.vendorNameInput.focus()} 
                        autoCorrect={false} 
                        keyboardType='email-address' 
                        returnKeyType="next" 
                        placeholder='Email' 
                        placeholderTextColor='rgba(225,225,225,0.7)'/>

                    <Text style={CommonStyles.cardStyles.sectionText}>{"\n"}Vendor Information</Text>

                    <TextInput style = {CommonStyles.formStyles.input} 
                        autoCapitalize="none" 
                        onChangeText={ TextInputValue => 
                            this.setState({vendor_name: TextInputValue})}
                        ref={(input)=> this.vendorNameInput = input}
                        onSubmitEditing={() => this.vendorWebsiteInput.focus()} 
                        autoCorrect={false}  
                        returnKeyType="next" 
                        placeholder='Vendor Name *' 
                        placeholderTextColor='rgba(225,225,225,0.7)'/>

                    <TextInput style = {CommonStyles.formStyles.input} 
                        autoCapitalize="none" 
                        onChangeText={ TextInputValue => 
                            this.setState({vendor_website: TextInputValue})}
                        ref={(input)=> this.vendorWebsiteInput = input}
                        onSubmitEditing={() => this.vendorLocationInput.focus()} 
                        autoCorrect={false}  
                        returnKeyType="next" 
                        placeholder='Vendor Website' 
                        placeholderTextColor='rgba(225,225,225,0.7)'/>

                    <TextInput style = {CommonStyles.formStyles.input} 
                        autoCapitalize="none" 
                        onChangeText={ TextInputValue => 
                            this.setState({vendor_location: TextInputValue})}
                        ref={(input)=> this.vendorLocationInput = input}
                        onSubmitEditing={() => this.vendorTypeInput.focus()} 
                        autoCorrect={false}  
                        returnKeyType="next" 
                        placeholder='Vendor Zip Code' 
                        placeholderTextColor='rgba(225,225,225,0.7)'/>
                
                    <TextInput style = {CommonStyles.formStyles.input}   
                        returnKeyType="go" 
                        onChangeText={ TextInputValue => 
                            this.setState({vendor_type: TextInputValue})}
                        ref={(input)=> this.vendorTypeInput = input} 
                        placeholder='Vendor Type' 
                        placeholderTextColor='rgba(225,225,225,0.7)'/>

                    <TouchableOpacity style={CommonStyles.buttonStyles.buttonContainer} 
                        onPress={() => {
                            this.handleSubmit();
                        }}>
                        <Text  style={CommonStyles.buttonStyles.buttonText}>Update Profile</Text>
                    </TouchableOpacity>
                </Card>
            </View>
        );
    }
}

export default withNavigation(ProfileForm);