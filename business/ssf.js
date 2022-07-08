const State = require('./state');
const debug = require('../comm/debug');


class SSf extends State {

	constructor() {
        super();
	} 
    	
	isCancelable(code) {

		if(code === '05-40003')
            return false;
	
		return true;
	}

    isCanceled(code) {

        if(code === '00-2000')
            return true;
        else if(code === '00-40045-1000')
            return true;
        else if(code === '04-40002-40014')
            return true;
        return false;
    }	

	process(body,msg,res) {
		const info = body;
        debug.log(info);
        const states = info.orderState;
        for(const item of states) {
            const {orderNo,empPhone,carrierCode,orderStateDesc,lastTime,bookTime,orderStateCode,waybillNo} = {...item};
            const cancelable = this.isCancelable(orderStateCode);   
            const unify = super.unify(orderNo,waybillNo,orderStateCode,orderStateDesc,empPhone,lastTime,bookTime,carrierCode,cancelable,'SF');
            
            super.getStamp(orderNo).then(stamp => {
                super.saveState(stamp,unify);
            });
            
            if(this.isCanceled(orderStateCode))
                super.setCanceled(orderNo);
        }
        
        res.json({"success":"true","code":"0","msg":""});
	}

}

module.exports = SSf;

