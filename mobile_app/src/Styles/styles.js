import {Platform, StyleSheet} from 'react-native';
import {colors} from './colors';

class CommonStyles{

    get screenStyles(){
        return StyleSheet.create({
            container: {
                flexGrow: 1,
                backgroundColor: colors.japanese_indigo,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
            }, 
            generalText:{
                color: colors.gainsboro,
                textAlign: 'center',
                fontWeight: '700',
                fontSize: 18,
                marginBottom: 10,
                ...Platform.select({
                    ios: {
                        fontFamily: 'AvenirNext-Medium'
                    },
                    android: {
                        fontFamily: 'Roboto'
                    }
                }),
            },
            loadingIcon: {
                position: 'absolute',
                top: '45%',
                width: 60,
                height: 60,
            },
            loadingText: {
                color: colors.gainsboro,
                textAlign: 'center',
                fontWeight: '500',
                fontSize: 12,
                marginBottom: 10,
                ...Platform.select({
                    ios: {
                        fontFamily: 'AvenirNext-Medium'
                    },
                    android: {
                        fontFamily: 'Roboto'
                    }
                }),
                position: 'absolute',
                top: '55%',
            }
        });
    }

    get formStyles(){
        return StyleSheet.create({
            formContainer: {
                width: 380,
                paddingBottom: 50
            },
            input:{
                height: 40,
                width: 320,
                backgroundColor: 'rgba(30,30,30,0.3)',
                marginBottom: 10,
                paddingLeft: 20,
                alignSelf: 'center',
                color: colors.gainsboro,
                borderRadius: 100,
                ...Platform.select({
                    ios: {
                        fontFamily: 'AvenirNext-Medium'
                    },
                    android: {
                        fontFamily: 'Roboto'
                    }
                }),
            },
        });
    }

    get buttonStyles(){
        return StyleSheet.create({
            buttonContainer:{
                backgroundColor: colors.steel_blue,
                paddingVertical: 15,
                width: 320,
                marginBottom: 15,
                alignSelf: 'center',
                borderRadius: 100,
            },
            buttonText:{
                color: colors.gainsboro,
                textAlign: 'center',
                fontWeight: '600',
                ...Platform.select({
                    ios: {
                        fontFamily: 'AvenirNext-Medium'
                    },
                    android: {
                        fontFamily: 'Roboto'
                    }
                }),
            }, 
        });
    }

    get listStyles(){
        return StyleSheet.create({
            flatListContainer: {
                flexGrow: 1,
                backgroundColor: colors.japanese_indigo,
            },
            listItemContainer: {
                backgroundColor: colors.japanese_indigo,
                borderBottomColor: colors.gainsboro,
                borderBottomWidth: 1,
            },
            listItemTitleText: {
                color: colors.gainsboro,
                fontWeight: '500',
                ...Platform.select({
                    ios: {
                        fontFamily: 'AvenirNext-Medium'
                    },
                    android: {
                        fontFamily: 'Roboto'
                    }
                }),
            },
            listItemSubtitleText: {
                color: colors.dark_sky_blue,
                ...Platform.select({
                    ios: {
                        fontFamily: 'AvenirNext-Medium'
                    },
                    android: {
                        fontFamily: 'Roboto'
                    }
                }),
            }
        });
    }

    get loginStyles() {
        return StyleSheet.create({
            loginContainer:{
                alignItems: 'center',
                flexGrow: 1,
                justifyContent: 'center',
            },
            logo: {
                position: 'absolute',
                width: 350,
                height: 150,
            },
        });
    }

    get cardStyles(){
        return StyleSheet.create({
            cardContainer: {
                alignItems: 'center', 
                ...Platform.select({
                    ios: {
                        shadowOffset: {width: 3, height: 4},
                        shadowColor: '#000',
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        borderRadius: 5,
                    },
                    android: {
                        elevation: 5,
                    }
                }),
                backgroundColor: '#D9DCD6',
                opacity: 0.9
            },
            cardAvatar: {
                shadowOffset: {width: 2, height: 2},
                shadowColor: '#000',
                shadowOpacity: 0.8,
                shadowRadius: 2,
                alignSelf: 'center',
            },
            cardSpacer: {
                marginTop: 20,
            },
            cardTitle: {
                top: 10,
                ...Platform.select({
                    ios: {
                        fontFamily: 'AvenirNext-Medium'
                    },
                    android: {
                        fontFamily: 'Roboto'
                    }
                }),
            },
            cardText: {
                textAlign: 'center',
                top: -10,
                ...Platform.select({
                    ios: {
                        fontFamily: 'AvenirNext-Medium'
                    },
                    android: {
                        fontFamily: 'Roboto'
                    }
                }),
            },
            sectionText: {
                color: colors.steel_blue,
                textAlign: 'center',
                fontWeight: '700',
                marginBottom: 5,
                ...Platform.select({
                    ios: {
                        fontFamily: 'AvenirNext-Medium'
                    },
                    android: {
                        fontFamily: 'Roboto'
                    }
                }),
            }
        });
    }
}

export default new CommonStyles();