import React, {Component} from 'react';
import {Alert, AsyncStorage, Image, View, Text, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import APIService from '../../Services/APIService';
import CallingCard from '../CallingCard';
import LoadingScreen from '../LoadingScreen';
import CommonStyles from '../../Styles/styles';
import { onSignOut } from '../../auth';

class ViewProfile extends Component {
    constructor(props){
        super(props);
        this.state={
            isLoading: true
        };
        this.handleDelete = this.handleDelete.bind(this);
    }

    onUpdate = data => {
        this.setState(data);
        this.setState({vendor_flag : 1});
    };

    handleDelete(){
        this.deleteProfile(this.state.auth_key);
    }

    deleteProfile = async (user_key) => {
        APIService.ProfileDeleteRequest(user_key).then(() => {
            onSignOut().then(() => {
                this.props.navigation.navigate('SignedOut');
            });
        });
    }

    componentDidMount(){
        AsyncStorage.getItem('USER_KEY', (err, user_key) => {
            if(err){
                console.error("Problem retrieving user key in view profile.");
            } else{

                this.setState({
                    auth_key: user_key
                });

                APIService.ProfileGetRequest(user_key).then((result) => {
                    if(result){
                        this.setState(result);
                        this.setState({isLoading: false});
                        console.log(this.state);
                    } else{
                        console.error("Error retrieving profile information for user.");
                    }
                });
            }
        });
    }

    renderCustomerButton = () => {
        if(this.state.vendor_flag == 1){
            return(
                <View>
                    <TouchableOpacity style={CommonStyles.buttonStyles.buttonContainer} 
                        onPress={() => this.props.navigation.navigate('AddCustomer')}>
                    <Text  style={CommonStyles.buttonStyles.buttonText}>Add Customer</Text>
                </TouchableOpacity>        
                </View>
            );
        } else{
            return null;
        }
    }

    renderOptions = () => {
        return(
            <View style={CommonStyles.screenStyles.container}>
                <Text style = {CommonStyles.screenStyles.generalText}>Options</Text>

                {this.renderCustomerButton()}

                <TouchableOpacity style={CommonStyles.buttonStyles.buttonContainer} 
                    onPress={() => this.props.navigation.navigate('UpdateProfile', {onUpdate: this.onUpdate, data: {}})}>
                    <Text  style={CommonStyles.buttonStyles.buttonText}>Update Profile</Text>
                </TouchableOpacity>        

                <TouchableOpacity style={CommonStyles.buttonStyles.buttonContainer} 
                    onPress={() => Alert.alert(
                        "Confirm Profile Deletion",
                        "Are you sure you want to delete your profile?",
                        [
                            {text: "Cancel"},
                            {text: "Confirm", onPress: () => {
                                this.handleDelete();
                            }}
                        ],
                        { cancelable: false }
                    )}>
                    <Text  style={CommonStyles.buttonStyles.buttonText}>Delete Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={CommonStyles.buttonStyles.buttonContainer} 
                    onPress={() => onSignOut().then(() => this.props.navigation.navigate('SignedOut'))}>
                    <Text  style={CommonStyles.buttonStyles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>           
        );
    }

    render(){

        if(this.state.isLoading){
            return(
                <LoadingScreen/>
            );
        } else if(this.state.fname){

            const contact = {
                givenName: this.state.fname,
                familyName: this.state.lname,
                note: this.state.vendor_name,
                vendor_website: this.state.vendor_website,
                vendor_location: this.state.vendor_location,
                vendor_type: this.state.vendor_type,
                //thumbnailPath: './images/user-placeholder.png',
            }

            return(
                <View style={CommonStyles.listStyles.flatListContainer}>
                    <CallingCard contact={contact} />
                    {this.renderOptions()}
                </View>
            );
        } else{
            return(
                <View style={CommonStyles.screenStyles.container}>
                    <Text style={CommonStyles.screenStyles.generalText}>
                        If you would like to add customers on Facet, please fill out your vendor profile 
                        information by clicking on "Update Profile" below.
                    </Text>
                    {this.renderOptions()}
                </View>
            );
        }
    }
}

export default withNavigation(ViewProfile);