import React, {Component} from 'react';
import {Image, View} from 'react-native';
import {Text} from 'react-native-elements';
import CommonStyles from '../Styles/styles';

export default class LoadingScreen extends Component {
    
    render(){     
        return(
            <View style={CommonStyles.screenStyles.container}>
            <Image
                resizeMode="contain" 
                style={CommonStyles.screenStyles.loadingIcon} 
                source={require('./images/loading.gif')}
            />
            <Text style={CommonStyles.screenStyles.loadingText}>Loading...</Text>
        </View>
        );
    }
}