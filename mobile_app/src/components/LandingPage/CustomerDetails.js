import React, {Component} from 'react';
import {Image, View} from 'react-native';
import {withNavigation} from 'react-navigation';
import CallingCard from '../CallingCard';
import CommonStyles from '../../Styles/styles';

class CustomerDetails extends Component {

    constructor(props){
        super(props);
        this.state={
            contact: this.props.navigation.state.params.vendor,
            isLoading: true,
        };
    }

    componentDidMount(){
        let name = this.state.contact.fname;
        if(name[name.length - 1] == 's'){
            name += '\'';
        } else{
            name += '\'s';
        }
        this.props.navigation.setParams({title: name + " Information"});
    }

    render(){
        const vendor = this.state.contact;

        const contact = {
            givenName: vendor.fname,
            familyName: vendor.lname,
            note: vendor.vendor_name,
            vendor_website: vendor.vendor_website,
            vendor_location: vendor.vendor_location,
            vendor_type: vendor.vendor_type,
            //thumbnailPath: './images/user-placeholder.png',
        }

        return(
            <View style={CommonStyles.listStyles.flatListContainer}>
                <CallingCard contact={contact}/>
            </View>
        );
    }
}

export default withNavigation(CustomerDetails);