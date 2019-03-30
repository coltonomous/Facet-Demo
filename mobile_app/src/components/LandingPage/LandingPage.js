import React, {Component} from 'react';
import {FlatList, RefreshControl, View, Platform, PermissionsAndroid} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import Contacts from 'react-native-contacts';
import { sha256 } from "react-native-sha256";
import APIService from '../../Services/APIService';
import CommonStyles from '../../Styles/styles';
import LoadingScreen from '../LoadingScreen';

class LandingPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            contacts: [],
            isLoading: true,
        };
    }

    componentDidMount(){
        if(Platform.OS === 'android'){
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    'title': 'Contacts',
                    'message': 'This app would like to view your contacts.'
                }
                ).then(() => {
                    this.checkContacts();
                }
            );
        } else{
            this.checkContacts();
        }
    }

    checkContacts = () => {
        //let contactsList = [];
        Contacts.getAll((err, contacts) => {
            if(err){
                console.log(err);
                Alert.alert("Permissions are required to access contacts. You can give this app permissions in phone's settings.");
            } else{
                contacts.forEach((contact) => {
                    let seen = false;   // Fewer rerenders than set conversion for dupes

                    contact.phoneNumbers.forEach((number) => {
                        sha256(number["number"].replace(/\D/g,'')).then( async(hash) => {

                            APIService.VendorGetRequest(hash).then((vendors) => {
                                if(vendors && !seen){
                                    seen = true;
                                    //contactsList.push({contact: contact, vendors: vendors});
                                    this.setState({contacts: [...this.state.contacts, contact]});
                                }   
                            });
                        });
                    });
                });
            }
        });

        this.setState({
            //contacts: contactsList,
            isLoading: false,
        });
    }

    renderItem = ({ item }) => (
        <ListItem
            leftAvatar={{
                title: item.givenName[0] + item.familyName[0],
                source: item.thumbnailPath && {uri: item.thumbnailPath},
            }}
            title={item.givenName + " " + item.familyName}
            subtitle={item.note.length < 35 ? item.note : item.note.substring(0, 35) + '...'}
            onPress={() => this.props.navigation.navigate('VendorDetails', {contact: item})}
            containerStyle={CommonStyles.listStyles.listItemContainer}
            titleStyle = {CommonStyles.listStyles.listItemTitleText}
            subtitleStyle = {CommonStyles.listStyles.listItemSubtitleText}
            chevron
        />
    );

    _onRefresh = () => {
        this.setState({
            isLoading: true,
            contacts: []
        });
        
        this.checkContacts();
    }

    render(){
        const contacts = this.state.contacts;

        console.log('render', this.props, this.state)

        if(this.state.isLoading){
            return(
                <LoadingScreen />
            );
        } else if(contacts.length > 0){
            return(
                <View style={CommonStyles.listStyles.flatListContainer}>
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={contacts.sort((a, b) => a.familyName.localeCompare(b.familyName))}
                        renderItem={this.renderItem}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isLoading}
                                onRefresh={this._onRefresh.bind(this)}
                            />
                        }
                    />
                </View>
            );
        } else{
            return(
                <View style={CommonStyles.screenStyles.container}>
                    <Text style={CommonStyles.screenStyles.generalText}>
                        None of your contacts are customers on Facet. If you are a vendor and would like to 
                        add customers, fill out your vendor profile under 'Settings'.
                    </Text>
                </View>
            );
        }
    }
}
export default withNavigation(LandingPage);