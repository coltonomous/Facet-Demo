// Returns OK upon successful addition of email field to db
exports._member_add = function(req, res, next){
    let member = {
        "email": req.body.email
    }

    let query = "INSERT INTO members SET ?";

    // Catching empty required fields to notify frontend to throw alert
    if(!req.body.email){
        return res.send({"id": '', "responseText": "Email missing for database insertion."});
    }
    
    global.connection.query(query, member, (err) => {
        if(err){
            return next(err);
        }
        res.sendStatus(200);
    });
};

// Returns OK if member exists whose email is registered in db, indicating membership
exports.member_search = function(req, res){
    let email = req.params.email_string;

    let query = 'SELECT * FROM members WHERE email = "' + email + '"';

    global.connection.query(query,(err, result) => {
        if(err){
            return next(err);
        }
        res.send(result);
    });
};