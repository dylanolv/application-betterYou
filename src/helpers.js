import { AsyncStorage } from 'react-native';

export const isAuthenticated = () => { 
    AsyncStorage.getItem('userData').then((user_data_json) => {
        let user_data = JSON.parse(user_data_json);
        if (user_data != null) {
            console.log(true)
          return true
        }
        else {
            console.log(false)
          return false
        }
    });
}