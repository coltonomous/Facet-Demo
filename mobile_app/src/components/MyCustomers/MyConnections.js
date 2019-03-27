import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import CommonStyles from '../../Styles/styles';

class MyConnections extends Component {
    constructor(props){
        super(props);
        this.state={};
    }

    renderOptions = () => {
        return(
            <View>
                <TouchableOpacity style={CommonStyles.buttonStyles.buttonContainer} 
                    onPress={() => this.props.navigation.navigate('MyCustomers')}>
                    <Text  style={CommonStyles.buttonStyles.buttonText}>My Customers</Text>
                </TouchableOpacity>        

                <TouchableOpacity style={CommonStyles.buttonStyles.buttonContainer} 
                    onPress={() => this.props.navigation.navigate('MyVendors')}>
                    <Text  style={CommonStyles.buttonStyles.buttonText}>My Vendors</Text>
                </TouchableOpacity>
            </View>           
        );
    }

    render(){

        return(
            <View style={CommonStyles.screenStyles.container}>
                {this.renderOptions()}
            </View>
        );
    }
}

export default withNavigation(MyConnections);