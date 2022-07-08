const Trace = require('./trace');
const debug = require('../comm/debug');



class TZto extends Trace {

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
			case 'GOT': {
				status = 10; 
				break;
			}   
			case 'DEPARTURE':
			case 'ARRIVAL': {
				status = 20;
                if(city.indexOf(current) >= 0)
                    status = 30; 
				break;
			}
            case 'DISPATCH':   
			case 'INBOUND': {
				status = 40; 
				break;    
			} 
            case 'SIGNED':  
			case 'DEPARTURE_SIGNED': {
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
        const info = JSON.parse(body.data);
        const mailno = info.billCode;
        const {action,city,actionTime,desc,problemCode} = info;

        super.lastStamp(mailno).then(([laststamp,tocity]) => {
            let status = this.unifyStatus(action,city,tocity);
            let unify = super.unify(mailno,null,actionTime,city,desc,problemCode,status,'ZTO');
            if(unify.laststamp > laststamp) {
                if(this.isNormal(status))
                    super.saveTrace(unify);
                else
                    super.saveRoute(unify);
            }   
        });
    
		res.json({"message":"调用成功","status":true,"result":"成功","statusCode":"200"});
	}

}

module.exports = TZto;

