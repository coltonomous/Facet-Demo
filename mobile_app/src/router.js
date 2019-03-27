import React from "react";
import { Platform, StatusBar } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator
} from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome5";
import {colors} from './Styles/colors';

import Login from "./components/Login/Login";
import DeviceAuth from "./components/Login/DeviceAuth";

import LandingPage from "./components/LandingPage/LandingPage";
import VendorDetails from './components/LandingPage/VendorDetails';
import CustomerDetails from './components/LandingPage/CustomerDetails';

import MyCustomers from './components/MyCustomers/MyCustomers';
import MyVendors from './components/MyCustomers/MyVendors';
import MyConnections from './components/MyCustomers/MyConnections';

import AddCustomer from "./components/AddCustomer/AddCustomer";

import ViewProfile from "./components/ViewProfile/ViewProfile";
import UpdateProfile from "./components/ViewProfile/UpdateProfile";

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export const SignedOut = createStackNavigator({
  SignIn: {
    screen: Login,
  },
  Authenticate: {
    screen: DeviceAuth,
    navigationOptions: {
      title: "Authenticate Device",
      headerStyle
    }
  }
});

const LandingStack = createStackNavigator({
  Home: {
    screen: LandingPage,
    navigationOptions: {
      title: "My Contacts",
      headerStyle
    }
  },
  VendorDetails: {
    screen: VendorDetails,
    navigationOptions: ({ navigation }) => {
      if(navigation && navigation.state && navigation.state.params && navigation.state.params.title) {
        return {title: navigation.state.params.title};
      }
      headerStyle
    }
  },
  CustomerDetails: {
    screen: CustomerDetails,
    navigationOptions: ({ navigation }) => {
      if(navigation && navigation.state && navigation.state.params && navigation.state.params.title) {
        return {title: navigation.state.params.title};
      }
      headerStyle
    }
  }
});

const CustomerStack = createStackNavigator({
  MyConnections: {
    screen: MyConnections,
    navigationOptions: {
      title: "My Connections",
      headerStyle
    }
  },
  MyCustomers: {
    screen: MyCustomers,
    navigationOptions: {
      title: "My Customers",
      headerStyle
    }
  },
  VendorDetails: {
    screen: VendorDetails,
    navigationOptions: ({ navigation }) => {
      if(navigation && navigation.state && navigation.state.params && navigation.state.params.title) {
        return {title: navigation.state.params.title};
      }
      headerStyle
    }
  },
  MyVendors: {
    screen: MyVendors,
    navigationOptions: {
      title: "My Vendors",
      headerStyle
    }
  },
  CustomerDetails: {
    screen: CustomerDetails,
    navigationOptions: ({ navigation }) => {
      if(navigation && navigation.state && navigation.state.params && navigation.state.params.title) {
        return {title: navigation.state.params.title};
      }
      headerStyle
    }
  }
});

const ProfileStack = createStackNavigator({
  ViewProfile: {
    screen: ViewProfile,
    navigationOptions: {
        title: "Settings",
        headerStyle
    }
  },
  UpdateProfile: {
    screen: UpdateProfile,
    navigationOptions: {
      title: "Update Profile",
      headerStyle
    }
  },
  AddCustomer: {
    screen: AddCustomer,
    navigationOptions: {
      title: "Add Customer",
      headerStyle
    }
  }
});

export const SignedIn = createBottomTabNavigator(
  {
    Home: {
      screen: LandingStack,
      navigationOptions: {
        tabBarLabel: "My Contacts",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="address-book" size={25} color={colors.gainsboro_dark}/>
        )
      }
    },
    MyConnections: {
      screen: CustomerStack,
      navigationOptions: {
        tabBarLabel: "My Connections",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="user-friends" size={25} color={colors.gainsboro_dark} />
        )
      }
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarLabel: "Settings",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="cog" size={25} color={colors.gainsboro_dark}/>
        )
      }
    }
  },
  {
    tabBarOptions: {
      style: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      },
      showIcon: true
    },
  }
);

export const createRootNavigator = (signedIn = false) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn
      },
      SignedOut: {
        screen: SignedOut
      }
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
};