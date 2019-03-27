import { host } from '../../app.json';

/* Wrapper class for all API calls and HTTP requests */
class APIService {
    
    /**
     * Make post request to add user phone and send login token
     * @param {String} phone - The phone number being used to login.
     * @returns {Promise} - True if successful and false otherwise.
     */
    ProfileCreateRequest(phone){
        return new Promise(
            (resolve, reject) => {
                fetch(host + '/users/auth/',
                {
                    method: 'post',
                    mode: 'no-cors',
                    body: JSON.stringify({
                        phone: phone
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson && responseJson.status === 200){
                        resolve(true);
                    } else{
                        resolve(false);
                    }
                })
                .catch((error) =>{
                    console.error(error);
                    reject("Error on user login: " + error);
                });
            }
        )
    }


    /**
     * Make post request to update user token so they can log in.
     * @param {String} user_key - The login token sent to user.
     * @param {String} phone_hash - The user's hashed phone number.
     * @returns {Promise} - Returns more secure token if successful and false otherwise.
     */
    ProfileLoginRequest(user_key, phone_hash){
        return new Promise(
            (resolve, reject) => {
                fetch(host + '/users/',
                {
                    method: 'post',
                    mode: 'no-cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'token': user_key,
                        'phone_hash': phone_hash
                    }
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.token){
                        resolve(responseJson);
                    } else{
                        resolve(false);
                    }
                })
                .catch((error) =>{
                    console.error(error);
                    reject("Error authenticating device: " + error);
                });
            }
        )
    }


    /**
     * Make get request for profile information.
     * @param {String} user_key - The auth token for all user requests
     * @returns {Promise} - The JSON of user info or false is not available.
     */
    ProfileGetRequest(user_key){
        return new Promise(
            (resolve, reject) => {
                fetch(host + '/users/', {
                    method: 'get',
                    mode: 'no-cors',
                    headers: {
                        'Accept': 'application/json',
                        'token': user_key
                    }
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.length === 1){
                        resolve(responseJson[0]);
                    } else{
                        console.log("Error parsing profile information json.");
                        resolve(false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject('Error in profile information request: ' + error);
                });
            }
        )
    }


    /**
     * Make put request for updating profile information.
     * @param {String} user_key - The auth token for all user requests
     * @param {Object} request_body - Object containing user information to send. 
     * @returns {Promise} - True if operation was successful or false otherwise.
     */
    ProfileUpdateRequest(user_key, request_body){
        return new Promise(
            (resolve, reject) => {
                fetch(host + '/users/',
                {
                    method: 'put',
                    mode: 'no-cors',
                    body: JSON.stringify({
                        fname: request_body.fname,
                        lname: request_body.lname,
                        email: request_body.email,
                        vendor_name: request_body.vendor_name,
                        vendor_website: request_body.vendor_website,
                        vendor_location: request_body.vendor_location,
                        vendor_type: request_body.vendor_type,
                }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'token': user_key,
                    }
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status === 200){
                        resolve(true);
                    } else{
                        resolve(false);
                    }
                })
                .catch((error) =>{
                    console.error(error);
                    reject('Error in profile update request: ' + error);
                });
            }
        )
    }


    /**
     * Make delete request for user profile.
     * @param {String} user_key - The auth token for all user requests
     * @returns {Promise} - True if operation was successful or false otherwise.
     */
    ProfileDeleteRequest(user_key){
        return new Promise(
            (resolve, reject) => {
                fetch(host + '/users/', 
                {
                    method: 'delete',
                    mode: 'no-cors',
                    headers: {
                        'Accept': 'application/json',
                        'token': user_key
                    }
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.status === 200){
                        resolve(true);
                    } else{
                        resolve(false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject("Error in delete profile request: " + error);
                });
            }
        )
    }


    /**
     * Make get request for customer information.
     * @param {String} vendor_phone - User's hashed phone number.
     * @returns {Promise} - The JSON of customer info or false is not available.
     */
    CustomerGetRequest(vendor_phone){
        return new Promise(
            (resolve, reject) => {
                fetch(host + '/users/customers/', {
                    method: 'get',
                    mode: 'no-cors',
                    headers: {
                        'Accept': 'application/json',
                        'phone_hash': vendor_phone
                    }
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson && responseJson.length > 0){
                        resolve(responseJson);
                    } else{
                        resolve(false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject('Error in customer information request: ' + error);
                });
            }
        )
    };


    /**
     * Make get request for vendor information.
     * @param {String} user_phone - Customer's phone number.
     * @returns {Promise} - The JSON of customer info or false is not available.
     */
    VendorGetRequest(user_phone){

        return new Promise(
            (resolve, reject) => {
                fetch(host + '/users/vendors/', {
                    method: 'get',
                    mode: 'no-cors',
                    headers: {
                        'Accept': 'application/json',
                        'phone': user_phone
                    }
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.length > 0){
                        resolve(responseJson);
                    } else{
                        resolve(false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject('Error in vendor information request: ' + error);
                });
            }
        )
    };


    /**
     * Make post request to add customer.
     * @param {String} user_key - The auth token for all user requests
     * @param {String} vendor_phone - The phone hash of the vendor
     * @param {Object} request_body - Object containing all customer information to ubdate customer with.
     * @returns {Promise} - Returns specific status if operation was successful or false otherwise.
     */
    CustomerCreateRequest(user_key, vendor_phone, request_body){
        return new Promise(
            (resolve, reject) => {
                fetch(host + '/users/customers/',
                {
                    method: 'post',
                    mode: 'no-cors',
                    body: JSON.stringify({
                        customer_phone: request_body.customer_phone,
                        customer_email: request_body.customer_email,
                        customer_fname: request_body.customer_fname,
                        customer_lname: request_body.customer_lname,
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'token': user_key,
                        'phone_hash': vendor_phone,
                    }
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.status){
                        resolve(responseJson.status);
                    } else{
                        resolve(false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject("Error in customer creation request: " + error);
                });
            }
        )
    }


    /**
     * Make delete request to delete customer.
     * @param {String} vendor_phone - The phone hash of the logged in user.
     * @param {String} request_body - Object containing customer's phone number.
     * @returns {Promise} - Returns a specific status if operation was successful or false otherwise.
     */
    CustomerDeleteRequest(vendor_phone, request_body){
        return new Promise(
            (resolve, reject) => {
                fetch(host + '/users/customers/',
                {
                    method: 'delete',
                    mode: 'no-cors',
                    body: JSON.stringify({
                        customer_phone: request_body.customer_phone
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'phone_hash': vendor_phone,
                    }
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.status){
                        resolve(responseJson.status);
                    } else{
                        resolve(false);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject("Error in customer deletion request: " + error);
                });
            }
        );
    }
}
export default new APIService();