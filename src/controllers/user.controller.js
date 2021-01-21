const bcrypt    = require('bcrypt');
const CONFIG    = require("../configs/config");
const User      = require('../models/users.model');
const {
    createResponseBody
}               = require("../commons/utilities");
const {
      getManagerAgents,
      assignManagerAnAgent
}               = require("../services/user.service");

exports.findUsers = (req,res) =>{
    User.find({},CONFIG.COLS_USER,(err,user) => {
		if(err){
            res.status(400).json(createResponseBody(1001,err,[],1));
            return;	
		}
		if(!user){
		let msg = `No users found`;
            res.status(401).json(createResponseBody(1001,msg,[],1));	
            return;
		}else{
            let msg = "Users loaded successfully.";
            res.status(200).json(createResponseBody(1000,msg,user,0));
		}
	});
};

exports.findUserById = (req,res) => {
    User.findOne({
		_id: req.params.id
	},CONFIG.COLS_USER,(err,user) => {
		if(err){
            res.status(400).json(createResponseBody(1001,err,[],1));
            return;	
		}
		if(!user){
			let msg = `No user found by the id ${req.params.id}`;
            res.status(401).json(createResponseBody(1001,msg,[],1));	
            return;
		}else{
            let msg = "User details loaded successfully.";
            res.status(200).json(createResponseBody(1000,msg,user,0));
		}
	});
};

exports.findUserByLevel = (req,res) => {
    
    if(!CONFIG.ALLOWED_LEVELS.includes(parseInt(req.params.level))){
        let msg = `${req.params.level} is an invalid authorization level`;
        res.status(400).json(createResponseBody(1001,msg,[],1));
        return;
    }

    User.find({
		level: req.params.level
	},CONFIG.COLS_USER,(err,user) => {
		if(err){
                  res.status(400).json(createResponseBody(1001,err,[],1));	
                  return;
		}
		if(!user){
                  let msg = `No user found by the defined level ${req.params.level}`;
                  res.status(401).json(createResponseBody(1001,msg,[],1));	
                  return;
		}else{
                  let msg = "Users successfully loaded.";
                  res.status(200).json(createResponseBody(1000,msg,user,0));
		}
	});
};

exports.updateUserById = (req,res) => {

};

exports.getUserAgentsById = async (req, res) => {
      const invalid = !req.params.managerId;

      if(invalid){
            let msg = "Please provide manager ID";
            res.status(401).json(createResponseBody(1001,msg,[],1));
            return;
      }

      const agents = await getManagerAgents(req.params.managerId);

      switch(agents){
            case 1005:
            res.status(401).json(createResponseBody(1005,`No manager found by the id ${req.params.managerId}`,[],1));
            return;
            break;

            case 1007:
            res.status(401).json(createResponseBody(1007,`Only managers are the ONLY ones assigned agents`,[],1));
            return;
            break;

            case 1009:
            res.status(401).json(createResponseBody(1009,`No agents assigned to the manager`,[],1));
            return;
            break;

            default:
            res.status(200).json(createResponseBody(1000,`Agents successfully loaded`,agents,0));
            break;
      }
};

exports.assignAgentsToManager = async (req,res) => {

      const invalid = !req.body.managerId || !req.body.agentId;

      if(invalid){
            let msg = "Please provide manager and agent IDs";
            res.status(401).json(createResponseBody(1001,msg,[],1));
            return;
      }

      const assigned   = await assignManagerAnAgent(req.body.managerId, req.body.agentId);
      switch(assigned){
            case 1000:
            res.status(200).json(createResponseBody(1000,'Agent successfully assigned to the Manager',[],1));
            break;

            case 1003:
            res.status(401).json(createResponseBody(1003,'The agent is already assigned to the same Manager',[],1));
            break;

            case 1005:
            res.status(401).json(createResponseBody(1005,'Manager records not found',[],1));
            break;

            case 1007:
            res.status(401).json(createResponseBody(1007,'Assignments only allowed between managers and agents',[],1));
            break;

            case 1009:
            res.status(401).json(createResponseBody(1009,'The agent is already assigned to a different manager.',[],1));
            break;

            case 1011:
            res.status(401).json(createResponseBody(1011,'The agent does not exist.',[],1));
            break;

            case 1013:
            res.status(401).json(createResponseBody(1013,'Only agents can be assigned managers.',[],1));
            break;

            case 1015:
            res.status(401).json(createResponseBody(1015,'An error occurred while tring to assign the agent.',[],1));
            break;
      }
}