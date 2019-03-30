import React, {Component} from 'react';
import {View} from 'react-native';
import {Avatar, Card, Text} from 'react-native-elements';
import CommonStyles from '../Styles/styles';

export default class CallingCard extends Component {

    constructor(props){
        super(props);
    }
    
    render(){
        const contact = this.props.contact;
        const note = contact.note ? <Text style={CommonStyles.cardStyles.cardText}>{contact.note.replace(/^\s+|\s+$/g, '')}</Text> : null;

        return(
            <View>
                <Card 
                    containerStyle={CommonStyles.cardStyles.cardContainer}
                    titleStyle={CommonStyles.cardStyles.cardTitle}
                    title={contact.givenName + " " + contact.familyName}
                >
                    {note}

                    <Avatar
                        rounded
                        size="xlarge"
                        title={contact.givenName[0] + contact.familyName[0]}
                        source={contact.thumbnailPath && {uri: contact.thumbnailPath}}
                        containerStyle={CommonStyles.cardStyles.cardAvatar}
                    />
                </Card>
            </View>
        );
    }
}