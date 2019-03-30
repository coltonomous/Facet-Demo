import React, {Component} from 'react';
import {Alert, FlatList, Image, RefreshControl, View} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import { sha256 } from "react-native-sha256";
import CallingCard from '../CallingCard';
import LoadingScreen from '../LoadingScreen';
import CommonStyles from '../../Styles/styles';
import APIService from '../../Services/APIService';

class VendorDetails extends Component {

    constructor(props){
        super(props);
        this.state={
            contact: this.props.navigation.state.params.contact,
            vendors: [],
            isLoading: true,
        };
    }

    componentDidMount(){
        let name = this.state.contact.givenName;
        if(name[name.length - 1] == 's'){
            name += '\'';
        } else{
            name += '\'s';
        }
        this.props.navigation.setParams({title: name + " Vendors"});

        this.getVendors();
    }

    getVendors = () => {
        const phoneNumbers = this.state.contact.phoneNumbers;
        phoneNumbers.forEach(async (number) => {
            sha256(number["number"].replace(/\D/g,'')).then(async (hash) => {
                await APIService.VendorGetRequest(hash).then((vendors) => {
                    if(vendors){
                        this.setState({vendors: [...this.state.vendors].concat(vendors)});
                    }
                });
            })
        });
        this.setState({isLoading: false});
    }

    renderItem = ({ item }) => (
        <ListItem
            leftAvatar={{
                title: item.fname[0] + item.lname[0],
            }}
            title={item.vendor_name}
            subtitle={item.fname + " " + item.lname}
            onPress={() => this.props.navigation.navigate('CustomerDetails', {vendor: item})}
            containerStyle={CommonStyles.listStyles.listItemContainer}
            titleStyle = {CommonStyles.listStyles.listItemTitleText}
            subtitleStyle = {CommonStyles.listStyles.listItemSubtitleText}
            chevron
        />
    );

    _onRefresh = () => {
        this.setState({
            isLoading: true,
            vendors: []
        });
        
        this.getVendors();
    }

    render(){
        const contact = this.state.contact;
        const vendors = this.state.vendors;

        let vendorSet = new Set(vendors.map(e => JSON.stringify(e)));
        let uniqueVendors = Array.from(vendorSet).map(e => JSON.parse(e));

        if(this.state.isLoading){
            return(
                <LoadingScreen />
            );
        } else if(vendors.length > 0){
            return(
                <View style={CommonStyles.listStyles.flatListContainer}>
                    <CallingCard contact={contact}/>         
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={uniqueVendors.sort((a, b) => a.vendor_name.localeCompare(b.vendor_name))}
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
                <View style={CommonStyles.listStyles.flatListContainer}>
                    <CallingCard contact={contact}/>
                </View>
            );
        }
    }
}

export default withNavigation(VendorDetails);