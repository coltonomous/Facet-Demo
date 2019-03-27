import React, {Component} from 'react';
import {AsyncStorage, FlatList, Image, RefreshControl, View} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import LoadingScreen from '../LoadingScreen';
import CommonStyles from '../../Styles/styles';
import APIService from '../../Services/APIService';

class MyVendors extends Component {

    constructor(props){
        super(props);
        this.state={
            customers: [],
            isLoading: true,
        };
    }

    componentDidMount(){
        AsyncStorage.getItem('PHONE_HASH').then((phone) => {
            this.getCustomers(phone);
        });
    }

    getCustomers = (phone) => {
        APIService.VendorGetRequest(phone).then((customers) => {
            console.log(customers);
            if(customers && customers.length > 0){
                this.setState({customers: customers});
            } else{
                console.log('Error retrieving vendors.');
            }
            this.setState({isLoading: false});
        });
    }

    renderItem = ({ item }) => (
        <ListItem
            leftAvatar={{
                title: item.fname[0] + item.lname[0],
            }}
            title={item.vendor_name}
            subtitle={item.fname + " " + item.lname}
            onPress={() => {}}
            containerStyle={CommonStyles.listStyles.listItemContainer}
            titleStyle = {CommonStyles.listStyles.listItemTitleText}
            subtitleStyle = {CommonStyles.listStyles.listItemSubtitleText}
            chevron
        />
    );

    _onRefresh = () => {
        this.setState({
            isLoading: true,
            customers: []
        });
        
        this.getCustomers(this.state.phone);
    }

    render(){
        const customers = this.state.customers;

        let customerSet = new Set(customers.map(e => JSON.stringify(e)));
        let uniqueCustomers = Array.from(customerSet).map(e => JSON.parse(e));

        if(this.state.isLoading){
            return(
                <LoadingScreen />
            );
        } else if(customers.length > 0){
            return(
                <View style={CommonStyles.listStyles.flatListContainer}>     
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={uniqueCustomers.sort((a, b) => vendor_name.localeCompare(b.vendor_name))}
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
                    <Text style={CommonStyles.screenStyles.generalText}>You have not been added by any vendors.</Text>
                </View>
            );
        }
    }
}

export default withNavigation(MyVendors);