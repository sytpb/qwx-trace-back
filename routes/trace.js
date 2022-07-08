const express = require('express');
const router = express.Router();

const TSf = require('../business/tsf');
const TDp = require('../business/tdp');
const TZto = require('../business/tzto');
const SZto = require('../business/szto');
const TSto = require('../business/tsto');

router.use('/:msg', function(req, res, next) {
	let method = req.method;
	if(method == 'GET') {
	}
	else if(method == 'POST') {
		let msg = req.params.msg;
		msg = msg.toUpperCase();
		console.log(`------------------------ROUTER MSG ${msg}-------------------------`);
        
		if(msg === 'SF') {
            const sf = new TSf();
            sf.process(req.body,msg,res);
        }
        else if(msg === 'DP') {
            const dp = new TDp();
            dp.process(req.body,msg,res);
        }    
        else if(msg === 'ZTO') {
            const msgtype = req.body.msg_type;
            if(msgtype === 'Traces') {
                const tzto = new TZto();
                tzto.process(req.body,msg,res);
            }
            else if(msgtype === 'order') {
                const szto = new SZto();
                szto.process(req.body,msg,res);
            }
        }   
        else if(msg === 'STO') {
            const tsto = new TSto();
            tsto.process(req.body,msg,res);
        }
	}
});


module.exports = router;
