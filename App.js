import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './componentes/LoginScreen';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <View style={styles.container}>
      <LoginScreen></LoginScreen>
      <StatusBar style="auto" />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  }
});
