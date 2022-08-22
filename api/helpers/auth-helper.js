
// to read env files
require('dotenv').config()

'use strict';
var access_token = null;

class AuthHelper {
    static getAccessToken() {
        if (access_token != null) {
            // return access token if available
            return access_token;
        }
        else {
            // generate new token by calling external API
            // const resp = await axios.post('url to generate token', {
            //     username: process.env.USERNAME,
            //     password: process.env.PASSWORD
            // });
            // token api reponse and assign the token received and return
            // console.log(resp.data);

            access_token = "generated_token";
            return access_token;
        }
    }

    static validateToken(token) {
        try {
            if (token != null && token.trim().length > 0) {
                // logic to validate token (like token expired or not etc...)
                return true;
            }
        }
        catch (err) {

        }
        return false;
    }
}

module.exports = AuthHelper;
