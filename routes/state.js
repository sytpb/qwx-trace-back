const express = require('express');
const router = express.Router();

//const TSf = require('../business/ssf');
const SDp = require('../business/sdp');
const SSf = require('../business/ssf');
const SSto = require('../business/ssto');

router.use('/:msg', function(req, res, next) {
	let method = req.method;
	if(method == 'GET') {
	}
	else if(method == 'POST') {
		let msg = req.params.msg;
		msg = msg.toUpperCase();
		console.log(`------------------------ROUTER MSG ${msg}-------------------------`);
        
		if(msg === 'SF') {
            const sf = new SSf();
            sf.process(req.body,msg,res);
        }
        else if(msg === 'DP') {
            const dp = new SDp();
            dp.process(req.body,msg,res);
        }    
        else if(msg === 'STO') {
            const sto = new SSto();
            sto.process(req.body,msg,res);
        }   
        else if(msg === 'ZTO') {
            /*Route in Trace*/
        }
	}
});


module.exports = router;
