const Trace = require('./trace');
const debug = require('../comm/debug');



class TSto extends Trace {

	constructor() {
		super();
        this.normality = [10,20,30,40,80];
	}
    
    isNormal(code) {
       const result = this.normality.some(item => {
            return code === item; 
       });
       return result;
    }
    	
	unifyStatus(code,current,city) {
		let status = 0;

		switch(code) {
			case '收件': {
				status = 10; 
				break;
			}   
			case '发件':
			case '到件': {
				status = 20;
                if(city.indexOf(current) >= 0)
                    status = 30; 
				break;
			}
            case '派件':   
			case '第三方代派':
            case '派件入柜':
            case '柜机代收':
            case '驿站代收': {
				status = 40; 
				break;    
			} 
            case '签收': {
				status = 80; 
				break;
			}
			default:
                status = 0;
				break;

		}
		return status;
	}
	
	process(body,msg,res) {
        const info = JSON.parse(body.content,super.censor,4);
        const mailno = info.waybillNo;
        const {scanType,opOrgCityName,opTime,memo,issueName} = info.trace;

        super.lastStamp(mailno).then(([laststamp,tocity]) => {
            let status = this.unifyStatus(scanType,opOrgCityName,tocity);
            let unify = super.unify(mailno,null,opTime,opOrgCityName,memo,issueName,status,'STO');
            if(unify.laststamp > laststamp) {
                if(this.isNormal(status))
                    super.saveTrace(unify);
                else
                    super.saveRoute(unify);
            }   
        });
    
		res.json({"success":true,"errorCode":"","errorMsg":""});
	}
}

module.exports = TSto;

