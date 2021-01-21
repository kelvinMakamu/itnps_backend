const CONFIG    = require("../configs/config");
const User      = require('../models/users.model');
const Manager   = require('../models/managers.model');
const mongoose  = require('mongoose');

const assignManagerAnAgent = async (managerID, userID) => {
    const restriction = await restrictDuplicateAssignment(managerID,userID);
    switch(restriction){
        case 1000:
        return 1003;//Assignment already exists
        break;

        case 1001:
        const restricted = await restrictErroneousAssignment(managerID, userID);
        if(restricted === 1000){
            const assignment  = await Manager.insertMany({ manager_id: managerID, agent_id: userID });
            if(assignment){
                return 1000;
            }else{
                return 1015;
            }
        }else{
          return restricted;
        }
        break;
    }
};

const restrictDuplicateAssignment = async (managerID, userID) => {
    const assignment = await Manager.findOne({ manager_id: managerID, agent_id: userID});
    if(assignment){
        return 1000;
    }else{
        return 1001;
    }
};

const restrictErroneousAssignment = async (managerID, userID) => {
    const manager = await User.findOne({ _id: managerID });
    if(manager){
        if(parseInt(manager.level) === 1){
            const alreadyAssigned = await checkAgentAlreadyAssigned(userID);
            switch(alreadyAssigned){
                case 1000:
                return 1009;// The agent has already been assigned
                break;

                case 1001:
                const user = await User.findOne({ _id: userID });
                if(user){
                    return parseInt(user.level) === 2 ? 1000 : 1013;// Only agents can be assigned 
                }else{
                    return 1011;//The agent does not exist
                }
                break;
            }
        }else{
            return 1007;// Assignments only allowed between managers and agents
        }
    }else{
        return 1005;//Manager records not available
    }
};

const checkAgentAlreadyAssigned = async (userID) => {
    const user = await Manager.findOne({ _id: userID });
    if(user){
        return 1000;
    }else{
        return 1001;
    }
}

const getManagerAgents = async (managerID) => {
    if(mongoose.Types.ObjectId.isValid(managerID)){
        const manager = await User.findOne({ _id: managerID });
        if(manager){
            switch(manager.level){
                case 0:
                const users  = await User.find({},CONFIG.COLS_USER);
                if(users){
                    return users;
                }else{
                    return 1009;
                }
                break;

                case 1:
                const userIDs = await Manager.find({ manager_id: managerID },'agent_id');
                let agents = userIDs.map((ID) => {return ID.agent_id});
                
                let condition = {
                    _id: { $in: agents },
                };
                
                const assigned  = await User.find(condition,CONFIG.COLS_USER);
                if(assigned){
                    return assigned;
                }else{
                    return 1009;
                }
                break;

                case 2:
                const current  = await User.findOne({ _id: managerID },CONFIG.COLS_USER);
                if(current){
                    return current;
                }else{
                    return 1009;
                }
                break;
    
                default:
                return 1007;
                break;
            }
        }else{
            return 1005;
        }
    }else{
        return 1005;
    }
}

const enforceCredentialsUniqueness = async(email, username) => {
    const user = await User.findOne({ username: username});
    if(user){
        return 1001;
    }else{
        const mailuser = await User.findOne({ email: email});
        if(mailuser){
            return 1003;
        }else{
            return 1000;
        }
    }
}

module.exports = {
    getManagerAgents,
    assignManagerAnAgent,
    enforceCredentialsUniqueness
}