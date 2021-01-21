const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");
const CONFIG = require("../configs/config");
const User   = require("../models/users.model");
const { 
  createResponseBody,
  determineUserLevel

}           = require("../commons/utilities");

const { 
  enforceCredentialsUniqueness

}           = require("../services/user.service");

const loginRequired = (req, res, next) => {
  if(!req.user) {
    let msg = "Unauthorized user";
    res.status(401).json(createResponseBody(1001, msg, [], 1));
    return;
  }
  next();
};

const registerUser = async (req, res) => {
  const invalid =
    !req.body.first_name ||
    !req.body.last_name ||
    !req.body.username ||
    !req.body.email ||
    !req.body.password;

  if(invalid){
    let msg = "Please provide correct details";
    res.status(401).json(createResponseBody(1001, msg, [], 1));
    return;
  }

  const enforced = await enforceCredentialsUniqueness(req.body.email,req.body.username);

  switch(enforced){
    case 1000:
    const user = new User(req.body);
    user.save((err, user) => {
      if(err){
        res.status(400).json(createResponseBody(1001, err, [], 1));
        return;
      }else{
        user.password = undefined;
        let msg = "User registered successfully.";
        res.status(200).json(createResponseBody(1000, msg, [], 1));
      }
    });
    break;

    case 1001:
    let desc = 'Failed! The username is already in use!';
    res.status(400).json(createResponseBody(1001, desc, [], 1));
    return;
    break;

    case 1003:
    let descr = 'Failed! The email address is already in use!';
    res.status(400).json(createResponseBody(1003, descr, [], 1));
    return;
    break;
  }
};

const login = (req, res) => {
  User.findOne({ username: req.body.username },
    (err, user) => {
      if(err){
        res.status(400).json(createResponseBody(1001, err, [], 1));
        return;
      }

      if(!user){
        let msg = "Authentication failed. No user found";
        res.status(401).json(createResponseBody(1001, msg, [], 1));
        return;
      }else{
        var validPassword = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        
        if (!validPassword) {
          let msg = "Authentication failed. Invalid username/password";
          res.status(401).json(createResponseBody(1001, msg, [], 1));
          return;
        } else {
          let authToken = { 
            token: jwt.sign({ id: user._id, email:user.email },CONFIG.SECRET),
            user: {
              id: user._id,
              name: `${user.first_name} ${user.last_name}`,
              userLevel: determineUserLevel(user.level)
            }
          };
          let msg = "User authenticated successfully";
          res.status(200).json(createResponseBody(1000, msg, authToken, 0));
        }
      }
    }
  );
};

// const resetPassword = (req, res) =>{

// }

const validateToken = (req,res,next) => {
	if(req.headers['authorization']){
		try{
			let auth    = req.headers['authorization'].split(' ');
			if(auth[0] !== 'Bearer'){
				req.user  = undefined;
				next();
			}else{
				jwt.verify(auth[1], CONFIG.SECRET,(err,decode) =>{
					if(err){
						req.user = undefined;
					}
          req.user = decode.id;
          next();
				});
			}
		}catch(err){
			req.user = undefined;
			next();
		}
	}else{
    req.user = undefined;
    next();
	}
};

module.exports = {
	login,
	validateToken,
	registerUser,
	loginRequired
}