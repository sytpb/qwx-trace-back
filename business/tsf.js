const Trace = require('./trace');
const debug = require('../comm/debug');



class TSf extends Trace {

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
    	
	unifyStatus(code,remark,city) {
		let status = 0;

		switch(code) {
			case '50': {
				status = 10; 
				break;
			}   
			case '30':
			case '3036':
			case '123':
			case '130': {
				status = 20; 
				break;
			}
            case '31': {
                status = 20;
                if(remark.indexOf(city) > remark.indexOf('到达'))
                    status = 30;
                break;
            }   
			case '44': {
				status = 40; 
				break;    
			} 
            case '8000':  
			case '80': {
				status = 80; 
				break;
			}
			case '99': {
				status = 99; 
				break;
			}   
			case '33':
			case '70': {
				status = 404;
				break;
			}   
			default:
                status = +code;
				break;

		}
		return status;
	}
	
	process(body,msg,res) {
		const info = body.Body;

		let routes = info.WaybillRoute;
		for (let i in routes) {
			let item = routes[i];
            //debug.log(item);
			//let status = this.unifyStatus(item.opCode,item.remark,'北京');
			//let unify = super.unify(item.mailno,item.id,item.acceptTime,item.acceptAddress,
			//			item.remark,item.reasonCode,status,'SF');
			super.lastStamp(item.mailno).then(([laststamp,tocity]) => {
                let status = this.unifyStatus(item.opCode,item.remark,tocity);
                let unify = super.unify(item.mailno,item.id,item.acceptTime,item.acceptAddress,
                                item.remark,item.reasonCode,status,'SF');
				if(unify.laststamp > laststamp) {
					if(this.isNormal(status))
                        super.saveTrace(unify);
                    else
                        super.saveRoute(unify);
				}
			});
		}
		res.json({"return_code":"0000","return_msg":"成功"});

	}

}

module.exports = TSf;

