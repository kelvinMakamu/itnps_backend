const Response  = require('../models/responses.model');
const {
    createResponseBody
}               = require("../commons/utilities");

const {
    getUserRawResponses,
    getUserDashboardStats,
    getUserPeriodicRawResponses
}               = require('../services/dashboard.service');


exports.createResponse = (req, res) => {
    const invalid = !req.body.agent_id || !req.body.resolution ||
	 !req.body.satisfaction || !req.body.medium || !req.body.verbatim;
	 
    if(invalid){
        let msg = "Please provide all details";
		res.status(401).json(createResponseBody(1001,msg,[],1));
		return;
    }

    const response  = new Response(req.body);
	response.save((err,response) => {
		if(err){
			res.status(400).json(createResponseBody(1001,err,[],1));
			return;	
		}else{
			let msg = "Response saved successfully.";
	  	    res.status(200).json(createResponseBody(1000,msg,[],1));	
		}
	});
};

exports.findResponseById = (req,res) => {
    Response.findOne({
		_id: req.params.id
	},(err,response) => {
		if(err){
            res.status(400).json(createResponseBody(1001,err,[],1));
            return;	
		}
		if(!response){
			let msg = `No response found by the id ${req.params.id}`;
            res.status(401).json(createResponseBody(1001,msg,[],1));	
            return;
		}else{
            let msg = "Response details loaded successfully.";
            res.status(200).json(createResponseBody(1000,msg,response,0));
		}
	}).populate('agent_id',"first_name last_name");
};

exports.findResponses = (req,res) => {
    Response.find({},(err,response) => {
		if(err){
            res.status(400).json(createResponseBody(1001,err,[],1));
            return;	
		}
		if(!response){
			let msg = `No survey responses found`;
            res.status(401).json(createResponseBody(1001,msg,[],1));	
            return;
		}else{
            let msg = "Responses loaded successfully.";
            res.status(200).json(createResponseBody(1000,msg,response,0));
		}
	}).populate('agent_id',"first_name last_name");
};
//{medium,startDate,endDate}
exports.getUserResponses = async (req, res) => {
    const invalid = !req.body.userId;
	 
    if(invalid){
        let msg = "Please provide unique user Id";
		res.status(401).json(createResponseBody(1001,msg,[],1));
		return;
    }else{
        const userID     = req.body.userId;
        const responses  = await getUserRawResponses(userID);
        if(responses === 1005){
            let msg = `User raw responses not found for user ID ${req.body.userId}.`;
            res.status(401).json(createResponseBody(1003,msg,[],1));
            return;
        }else{
            let msg = "Responses loaded successfully.";
            res.status(200).json(createResponseBody(1000,msg,responses,0));
        }
    }
};

exports.getPeriodicUserResponses = async (req,res)=> {
    const invalid = !req.body.userId || !req.body.startDate ||
	 !req.body.endDate;
	 
    if(invalid){
        let msg = "Please provide all details";
		res.status(401).json(createResponseBody(1001,msg,[],1));
		return;
    }else{
        const userID    = req.body.userId;
        const medium    = req.body.medium || 125;
        const startDate = req.body.startDate;
        const endDate   = req.body.endDate;
        const responses = await getUserPeriodicRawResponses(userID,medium,startDate,endDate);
        if(responses  === 1005){
            let msg = `User periodic raw responses not found for user ID ${req.body.userId}.`;
            res.status(401).json(createResponseBody(1003,msg,[],1));
            return;
        }else{
            let msg     = "Periodic raw responses loaded successfully.";
            res.status(200).json(createResponseBody(1000,msg,responses,0));
        }
    }
};

//{medium,startDate,endDate}
exports.getDashboardStats = async (req, res) => {
    const invalid = !req.body.userId || !req.body.startDate ||
	 !req.body.endDate;
	 
    if(invalid){
        let msg = "Please provide all details";
		res.status(401).json(createResponseBody(1001,msg,[],1));
		return;
    }else{
        const userID    = req.body.userId;
        const medium    = req.body.medium || 125;
        const startDate = req.body.startDate;
        const endDate   = req.body.endDate;
        const stats     = await getUserDashboardStats(userID,medium,startDate,endDate);
        if(stats  === 1005){
            let msg = `User raw responses not found for user ID ${req.body.userId}.`;
            res.status(401).json(createResponseBody(1003,msg,[],1));
            return;
        }else{
            let msg     = "Dashboard stats loaded successfully.";
            res.status(200).json(createResponseBody(1000,msg,stats,0));
        }
    }
};