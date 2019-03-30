const crypto = require('crypto');
const Nexmo = require('nexmo');
const nodemailer = require('nodemailer');
const credentials = require('./../constants/credentials');

/* FOR ALL SUBSEQUENT REQUESTS AFTER LOGIN, HEADER MUST CONTAIN ACCESS TOKEN FOR USER IN DATABASE */

// Generates a random auth token for device confirmation or db access
function _generateToken(length){
    return crypto.randomBytes(length).toString('hex');
};

// Hashes passed key with sha256
function _hashKey(key){
    return crypto.createHash('sha256').update(key).digest('hex');
};

// Send auth token via sms to passed number
function _sendAuthKey(number, token){
    let nexmo = new Nexmo({apiKey: credentials.nexmoAPIKey, apiSecret: credentials.nexmoAPISecret});

    // Only supporting US numbers for now...
    nexmo.message.sendSms(credentials.nexmoNumber, "1" + number, 'Your Facet auth token is: ' + token, (err) => {
        if(err){
            return err;
        }
        return;
    });
};

// Send notification to customer via text when added by vendor
function _sendCustomerConfirmation(number, vendor){
    let nexmo = new Nexmo({apiKey: credentials.nexmoAPIKey, apiSecret: credentials.nexmoAPISecret});

    let query = "SELECT fname, lname, vendor_name FROM users WHERE phone_hash = ? LIMIT 1";
    global.connection.query(query, vendor, (err, result) => {
        if(err){
            return err;
        }
        let name = result[0].fname + " " + result[0].lname;
        let company = result[0].vendor_name;
        nexmo.message.sendSms(credentials.nexmoNumber, "1" + number, "Attention: " + name + " of " + company +
            " has added you as a customer on Facet. Text 'Yes' to verify relationship or 'No' to opt out.", (err) => {
            if(err){
                return err;
            }
            return;
        });  
    });
};

// Notifies customer that their response text has been received. Sends passed response
function _sendCustomerResponseConfirmation(number, response){
    let nexmo = new Nexmo({apiKey: credentials.nexmoAPIKey, apiSecret: credentials.nexmoAPISecret});

    nexmo.message.sendSms(credentials.nexmoNumber, "1" + number, response, (err) => {
        if(err){
            return err;
        }
        return;
    });
};

// Send notification to customer via email when added by vendor
function _sendCustomerConfirmationEmail(email, vendor){

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: credentials.emailAddress,
            pass: credentials.emailPassword
        }
    });

    let query = "SELECT fname, lname, vendor_name FROM users WHERE phone_hash = ? LIMIT 1";
    global.connection.query(query, vendor, (err, result) => {
        if(err){
            return err;
        }
        let name = result[0].fname + " " + result[0].lname;
        let company = result[0].vendor_name;

        let mailOptions = {
            from: credentials.emailAddress,
            to: email,
            subject: 'Facet Customer Confirmation',
            text: 'Hello! \n\n' + name + " of " + company + " has added you as a customer on Facet. \nRespond 'Yes' to verify this relationship or 'No' to opt out. \n\nBest, \n Facet Customer Service"
        };

        transporter.sendMail(mailOptions, function(error){
            if(error){
                return error;
            }
            transporter.close();
        });
    });
};

// Notifies customer that their response email has been received. Sends passed response
function _sendCustomerResponseConfirmationEmail(email, response){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: credentials.emailAddress,
            pass: credentials.emailPassword
        }
    });

    let mailOptions = {
        from: credentials.emailAddress,
        to: email,
        subject: 'Facet Customer Confirmation',
        text: response
    };

    transporter.sendMail(mailOptions, function(error){
        if(error){
            return error;
        }
        transporter.close();
    });
};

// Sends device auth token (over sms)
exports.device_auth = function(req, res){
    if(!req.body.phone){
        return res.send({"responseText": "Missing phone number for verification."});
    }

    let token = _generateToken(3);

    let query = "INSERT INTO users SET phone_hash = ?, access_token = ?, vendor_flag = 0 \
                ON DUPLICATE KEY UPDATE access_token = ?";   // Presumptively add phone with token
    global.connection.query(query, [_hashKey(req.body.phone), token, token], (err) => {
        if(err){
            return res.send({"error": err});
        }
        _sendAuthKey(req.body.phone, token);
        res.send({"status": 200});
    });
};

// Creates new user object if none exists on post
exports.user_login = function(req, res){

    // Catching empty required fields to notify frontend to throw alert
    if(!req.headers.token){
        return res.send({"responseText": "Missing access token."});
    } else if(!req.headers.phone_hash){
        return res.send({"responseText": "Missing required phone number."});
    }
    let token = _generateToken(16);

    // Update to new, long term auth key for db access. To be regenerated with each login
    let query = "UPDATE users SET access_token = ? WHERE phone_hash = ? AND access_token = ?";
    global.connection.query(query, [token, req.headers.phone_hash, req.headers.token], (err, result) => {
        if(err){
            return res.sendStatus(500).send(err);
        }
        if(result.affectedRows > 0){
            res.send({"token": token});
        } else{
            res.send({"status": 400});
        }
    });
};

// Sends user profile on get request
exports.user_details = function(req, res){
    let token = req.headers.token;
    if(!token){ // Check for token length?
        return res.sendStatus(400).send("Missing required access token.");
    }

    let validateQuery = "SELECT * FROM users WHERE access_token = ? LIMIT 1";
    global.connection.query(validateQuery, token, (err, result) => {
        if(err){
            return res.sendStatus(500).send(err);
        }
        res.send(result);
    });
};

// Updates user object and returns object on put request
exports.user_update = function(req, res){
    let params = {};
    let token = req.headers.token;

    if(!token){
        return res.sendStatus(400).send("Missing required access token.");
    }

    // Clunky af, will probably revisit later, allows for modularity
    if(req.body.fname){
        params["fname"] = req.body.fname;
    }
    if(req.body.lname){
        params["lname"] = req.body.lname;
    }
    if(req.body.email){
        params["email"] = _hashKey(req.body.email);
    }
    if(req.body.vendor_name){
        params["vendor_name"] = req.body.vendor_name;
    }
    if(req.body.vendor_website){
        params["vendor_website"] = req.body.vendor_website;
    }
    if(req.body.vendor_location){
        params["vendor_location"] = req.body.vendor_location;
    }
    if(req.body.vendor_type){
        params["vendor_type"] = req.body.vendor_type;
    }

    if(params["fname"] && params["lname"] && params["vendor_name"]){
        params["vendor_flag"] = 1;
    }

    let query = "UPDATE users SET ? WHERE access_token = '" + token + "'";

    global.connection.query(query, params, (err) => {
        if(err){
            return res.send(err);
        }
        res.send({"status": 200});
    });
};

// Deletes user object on delete request
exports.user_delete = function(req, res){
    let token = req.headers.token;
    if(!token){
        return res.sendStatus(400).send("Missing required access token.");
    }
    let query = "DELETE FROM users WHERE access_token = ?";

    global.connection.query(query, token, (err) => {
        if(err){
            return res.sendStatus(500).send(err);
        }
        res.send({"status": 200});
    });
};

// Vendor presumptively adds customer where status of 0 is unconfirmed by customer
exports.user_add_customer = function(req, res){

    let affiliation = {
        "vendor_phone": req.headers.phone_hash,
        "status": 0    // Pending confirmation
    }

    if(req.body.customer_phone){
        affiliation["customer_phone"] = _hashKey(req.body.customer_phone);
    }
    if(req.body.customer_email){
        affiliation["customer_email"] = _hashKey(req.body.customer_email);
    }
    if(req.body.customer_fname){
        affiliation["customer_fname"] = req.body.customer_fname;
    }
    if(req.body.customer_lname){
        affiliation["customer_lname"] = req.body.customer_lname;
    }

    let query = "INSERT INTO customers SET ?";

    global.connection.query(query, affiliation, (err) => {
        if(err) {
            return res.send({"status": 403, "responseText": err});
        } else if (req.body.customer_phone){
            _sendCustomerConfirmation(req.body.customer_phone, req.headers.phone_hash);
        } else if(req.body.customer_email){
            _sendCustomerConfirmationEmail(req.body.customer_email, req.headers.phone_hash);
        }
        res.send({"status": 200});
    });
};

// Sends information for all customers on get request
exports.user_customer_details = function(req, res, next){
    
    let query = "SELECT customer_fname, customer_lname, status FROM customers \
        WHERE vendor_phone = ? AND customer_fname IS NOT NULL AND customer_lname IS NOT NULL \
        AND status != 2";

    global.connection.query(query, req.headers.phone_hash, (err, result) => {
        if(err){
            return res.sendStatus(500).send(err);
        }
        res.send(result);
    });
};

// Vendor removes user as customer
exports.user_remove_customer = function(req, res, next){

    let query = "DELETE FROM customers WHERE vendor_phone = ? AND customer_phone = ?";
    
    global.connection.query(query, [req.headers.phone_hash, _hashKey(req.body.customer_phone)], (err) => {
        if(err){
            return next(err);
        }
        res.send({"status": 200});
    });
};

// Sends information for all vendors who added user on get request
exports.user_vendor_details = function(req, res){

    let query = "SELECT U.phone_hash, U.fname, U.lname, U.vendor_name, U.vendor_website, U.vendor_location, \
        U.vendor_type, C.status FROM users U INNER JOIN customers C ON \
        C.vendor_phone = U.phone_hash WHERE C.customer_phone = ? AND C.status != 2";

    global.connection.query(query, req.headers.phone, (err, result) => {
        if(err){
            return res.send({"status": 403, "responseText": err});
        }
        res.send(result);
    });
};

// Confirms customer relationship between user and vendor by setting status to 1
exports.user_confirm_vendor = function(req, res, next){

    if(!req.body.to || !req.body.msisdn){
        return res.sendStatus(400).send("Inbound SMS is invalid.");
    }
    let sms = {
        from: req.body.msisdn,
        text: req.body.text
    };

    let status = 0;
    if(sms.text.toLowerCase() === "yes"){
        status = 1;
    } else if(sms.text.toLowerCase() === "no"){
        status = 2;
    }else{
        // Keeps auto sending every few minutes for some reason...
        //_sendCustomerResponseConfirmation(sms.from.substring(1), 'Sorry, we could not interpret your response. Please try again.');
        return {"status": 400};
    }

    let query = "UPDATE customers SET status = ? WHERE customer_phone = ? AND status = 0";

    global.connection.query(query, [status, _hashKey(sms.from.substring(1))], (err, result) => {
        if(err){
            return next(err);
        }
        _sendCustomerResponseConfirmation(sms.from.substring(1), 'Thank you. Your response has been accepted.');
        res.sendStatus(200);
    });
};

// Confirms customer relationship between user and vendor by setting status to 1
exports.user_confirm_vendor_email = function(req, res, next){
    let message = req.body.message;
    message = message.substring(0, 30); // Only reading the first 30 chars
    message = message.replace(/\n/g, " ");
    message = message.toLowerCase();

    let query = "UPDATE customers SET status = ? WHERE customer_email = ? AND status = 0";
    let status = 0;

    if(message.includes("yes")){
        status = 1;
    } else if(message.includes("no")){
        status = 2;
    } else{
        _sendCustomerResponseConfirmationEmail(req.body.from, "Invalid response. Please respond with a simple 'Yes' or 'No'.\n");
    }

    global.connection.query(query, [status, req.body.from], (err) => {
        if(err){
            return next(err);
        }
        _sendCustomerResponseConfirmationEmail(req.body.from, 'Thank you. Your response has been accepted.');
        res.send({"status": 200});
    });

    //res.end('OK');
};
