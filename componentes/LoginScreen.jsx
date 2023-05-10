import React from "react";
import { StyleSheet, Text, ImageBackground, View } from 'react-native';
import { Input, Icon, Button } from '@rneui/themed';
import { HStack, Box, Flex } from "@react-native-material/core";
import Toast from "react-native-toast-message";
import Config from '../config/endpoints.json';

export default class LoginScreen extends React.Component {

    state = {
        username: '', 
        passw: '', 
        loadingLogin: false,
        inputUsernameError: '',
        inputPasswordError: '',
        loginMessage: 'Kérjük jelentkezz be felhasználói neveddel és jelszavaddal a rendszerbe!',
        appTitle: Config.appTitle
    }

    logMeIn = () => {
        let isAnyError = false;
        if (this.state.username === '') {
            this.setState({inputUsernameError: 'Kérjük add meg felhasználói neved!'});
            isAnyError = true;
        }
        if (this.state.passw === '') {
            this.setState({inputPasswordError: 'Kérjük add meg jelszavad!'});
            isAnyError = true;
        }
        if (!isAnyError) {
            this.setState({loadingLogin: true});
            const url = Config.baseURI + Config.login;
            const data = { 
                emailAddress: this.state.username, 
                password: this.state.passw 
            };
            const formData = JSON.stringify(data);
            fetch(url, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                },
                body: formData,
            })
            .then(response => response.json())
            .then(json => {
                if (json.status === 'exception') {
                    this.setState({loadingLogin: false});
                    console.log('AUTH error:');
                    console.log(json);
                    Toast.show({
                        type: 'error',
                        text1: 'Sikertelen authentikáció:',
                        text2: 'Hibás belépési adatok. Kérjük ellenőrizd a felhasználói nevet és jelszót!'
                    });
                }
                else {
                    console.log('AUTH success:');
                    console.log(json);
                    if (json.body.result === 'ERROR_INCORRECT_EMAIL_ADDRESS') {
                        this.setState({loadingLogin: false});
                        Toast.show({
                            type: 'error',
                            text1: 'Sikertelen authentikáció:',
                            text2: 'Nem megfelelő felhasználói név. Kérjük ellenőrizd a felhasználói nevet!'
                        });    
                    }
                    else if (json.body.result === 'ERROR_ACCOUNT_LOCKED') {
                        this.setState({loadingLogin: false});
                        Toast.show({
                            type: 'error',
                            text1: 'Sikertelen authentikáció:',
                            text2: 'A megadott felhasználói fiók zárolva lett.'
                        });    
                    }
                    else if (json.body.result === 'ERROR_INCORRECT_PASSWORD') {
                        this.setState({loadingLogin: false});
                        Toast.show({
                            type: 'error',
                            text1: 'Sikertelen authentikáció:',
                            text2: 'A megadott felhasználói jelszó érvénytelen. Kérjük ellenőrizd a jelszót!'
                        });    
                    }
                    else {
                        this.setState({loadingLogin: false});
                        Toast.show({
                            type: 'success',
                            text1: 'Sikeres authentikáció:',
                            text2: 'Üdvözöljük a RockPhone rendszerében!'
                        });
                    }
                }
            })
            .catch(error => {
                this.setState({loadingLogin: false});
                console.error('NETWORK error:');
                console.error(error);
                Toast.show({
                    type: 'error',
                    text1: 'Hálózati hiba:',
                    text2: 'Sikertelen authentikációs kísérlet.'
                });
            });
        }
    }

    render() {
        return (
            <>
                <ImageBackground source={bgImage} resizeMode="cover" imageStyle={{opacity: 1}} style={styles.bgcontainer}>
                    <Flex center={true} style={styles.textBlock}>
                        <Text style={styles.h1}>{this.state.appTitle}</Text>
                        <Text style={styles.h2}>{this.state.loginMessage}</Text>
                    </Flex>

                    <Box style={styles.formContainer}>
                        <Input 
                        placeholderTextColor="#333333" 
                        style={styles.inpText} 
                        placeholder="Felhasználói név" 
                        errorMessage={this.state.inputUsernameError} 
                        onChangeText={value => this.setState({username: value})} 
                        leftIcon={{ type: 'font-awesome', name: 'user', color: '#333333' }} />

                        <Input 
                        placeholderTextColor="#333333" 
                        style={styles.inpText} 
                        secureTextEntry={true} 
                        placeholder="Jelszó" 
                        errorMessage={this.state.inputPasswordError} 
                        onChangeText={value => this.setState({passw: value})} 
                        leftIcon={{ type: 'font-awesome', name: 'key', color: '#333333' }} />
                    </Box>

                    <HStack spacing={10} style={styles.centered}>
                        <Box>
                            <Button loading={this.state.loadingLogin} radius={'md'} type={'solid'} onPress={() => this.logMeIn()}>
                                Bejelentkezés <Icon type="font-awesome" name="sign-in" color="#fff" />
                            </Button>
                        </Box>
                    </HStack>
                </ImageBackground>
            </>
        );
    }
}

const bgImage = {uri: 'https://cdna.artstation.com/p/assets/images/images/050/919/246/large/qingfeng-chen-matrix7.jpg?1656001253'};

const styles = StyleSheet.create({
    bgcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        height: '100%'
    },
    textBlock: {
        marginBottom: 100, 
        marginTop: -20
    },
    inpText: {
        color: '#363636'
    },
    h1: {
        fontSize: 48,
        fontWeight: '700',
        marginBottom: 50,
        color: '#39ff14'
    },
    h2: {
        fontSize: 16,
        fontWeight: '500',
        color: '#39ff14'
    },
    centered: {
        justifyContent: 'center'
    },
    formContainer: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        margin: 30,
        marginTop: -30,
        marginBottom: 50,
        borderRadius: 10
    },
    inputError: {
        fontWeight: '700', 
        backgroundColor: '#ffffff', 
        opacity: 0.6, 
        padding: 10
    }
});