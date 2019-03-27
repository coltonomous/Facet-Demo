import React, {Component} from 'react';
import {AsyncStorage, FlatList, Image, RefreshControl, TouchableHighlight, View} from 'react-native';
import {ListItem, Text} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import Swipeable from 'react-native-swipeable';
import LoadinScreen from '../LoadingScreen';
import CommonStyles from '../../Styles/styles';
import APIService from '../../Services/APIService';

class MyCustomers extends Component {

    constructor(props){
        super(props);
        this.state={
            customers: [],
            isLoading: true,
        };
    }

    componentDidMount(){
        AsyncStorage.getItem('PHONE_HASH').then((phone) => {
            this.setState({phone: phone});
            this.getCustomers(phone);
        });
    }

    getCustomers = (phone) => {
        APIService.CustomerGetRequest(phone).then((customers) => {
            if(customers){
                this.setState({customers: customers});
            } else{
                console.log('Error retrieving customers.');
            }
            this.setState({isLoading: false});
        });
    }

    rightButtons = () => {
        <TouchableHighlight><Text>Delete</Text></TouchableHighlight>
    }

    renderItem = ({ item }) => (
        <ListItem
            leftAvatar={{
                title: item.customer_fname[0] + item.customer_lname[0],
            }}
            title={item.customer_fname + " " + item.customer_lname}
            onPress={() => {}}
            containerStyle={CommonStyles.listStyles.listItemContainer}
            titleStyle = {CommonStyles.listStyles.listItemTitleText}
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
                <LoadinScreen />
            );
        } else if(customers.length > 0){
            return(
                <View style={CommonStyles.listStyles.flatListContainer}>     
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={uniqueCustomers.sort((a, b) => a.customer_lname.localeCompare(b.customer_lname))}
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
                        You have no confirmed customers. Update your profile and add some in 'Settings'! {"\n\n"} Your customer will
                        then be contacted at the number or email provided. If they confirm your relationship, they will appear here.
                    </Text>
                </View>
            );
        }
    }
}

export default withNavigation(MyCustomers);