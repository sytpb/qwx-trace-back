const State = require('./state');
const debug = require('../comm/debug');



class SDp extends State {

	constructor() {
		super();
	}
    
    isCancelable(code) {

        if(code === 'GET')
            return false;
        return true;
    }
    	
	getStatusDesc(code) {
		let desc = '';

		switch(code) {
            case 'ACCEPT':
                desc = '已受理';
                break;
            case 'CANCEL':
                desc = '已取消';
                break;
            case 'FAILGOT':
                desc = '揽货失败';
                break;
            case 'GOBACK':
                desc = '已退回';
                break;
            case 'GOT':
                desc = '已开单';
                break;
            case 'INVALID':
                desc = '已作废';
                break;
            case 'RECEIPTING':
                desc = '接货中';
                break;
            case 'REJECT':
                desc = '已拒绝';
                break;
            case 'SHOUTCAR':
                desc = '已约车';
                break;
            case 'SIGNFAILED':
                desc = '异常签收';
                break;
            case 'SIGNSUCCESS':
                desc = '正常签收';
                break;
            default:
                break;
	    }
        return desc;
    }
	
	process(body,msg,res) {

		const info = JSON.parse(body.params);
        debug.log(info); 
        //const logisticid = info.logisticID;
        const {logisticid,statusType,comments,mailNo} = {...info};
        const statusDesc = this.getStatusDesc(statusType);
        const cancelable = this.isCancelable(statusType);
        const unify = super.unify(logisticid,mailNo,statusType,statusDesc,comments,'','','',cancelable,'DP');

        super.getStamp(logisticid).then(stamp => {
            super.saveState(stamp,unify);
        });

        if(statusType === 'CANCEL')
            super.setCanceled(logisticid); 
		res.json({"logisticCompanyID":"DEPPON","logisticID":logisticid,"result":"true","resultCode":"1000","reason":"成功"});

	}

}

module.exports = SDp;

