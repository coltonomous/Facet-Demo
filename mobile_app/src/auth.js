import { AsyncStorage } from "react-native";
import { sha256 } from "react-native-sha256";

export const onSignIn = (user_id) => AsyncStorage.setItem("USER_KEY", user_id); // Access token

export const onRegister = (phone) => sha256(phone).then( hash => AsyncStorage.setItem("PHONE_HASH", hash)); // Phone hash for device verification

export const onSignOut = () => AsyncStorage.removeItem("USER_KEY").then(AsyncStorage.removeItem("PHONE_HASH"));

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem("USER_KEY")
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};
