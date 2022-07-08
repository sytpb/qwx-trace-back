const Trace = require('./trace');
const debug = require('../comm/debug');



class TDp extends Trace {

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
    	
	unifyStatus(code,city,tocity) {
		let status = 0;

		switch(code) {
			case 'GOT': {
				status = 10; 
				break;
			}   
			case 'ARRIVAL':
			case 'DEPARTURE': {
				status = 20; 
                if(city.indexOf(tocity) > 0)
                    status = 30;
				break;
			}
            case 'INBOUND':
			case 'DISPATCH': 
            case 'HANDOVERSCAN_SIGNED': {
				status = 40; 
				break;    
			}
            case 'DEPARTURE_SIGNED': 
            case 'SIGNED': {
				status = 80; 
				break;
			}
			default:
				break;

		}
		return status;
	}
	
	process(body,msg,res) {
		const info = JSON.parse(body.params);
        debug.log(info);
        const routes = info.track_list[0].trace_list;
		const mailno = info.track_list[0].tracking_number;

		for (let i in routes) {
			let item = routes[i];
            debug.log(item);
			super.lastStamp(mailno).then(([laststamp,tocity]) => {
                let status = this.unifyStatus(item.status,item.city,tocity);
                let unify = super.unify(mailno,null,item.time,item.city,
                                item.description,item.site,status,'DP');
				if(unify.laststamp > laststamp) {
					if(this.isNormal(status))
                        super.saveTrace(unify);
                    else
                        super.saveRoute(unify);
				}
			});
		}
		res.json({ "success":true,"error_code":"1000","error_msg":"成功","result":true});

	}
}

module.exports = TDp;

