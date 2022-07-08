const State = require('./state');
const debug = require('../comm/debug');



class SSto extends State {

	constructor() {
		super();
	}
    
    isCancelable(code) {

        if(code === '5')
            return false;
        return true;
    }
    	
	getStatusDesc(code) {
		let desc = '';

		switch(code) {
            case '1':
                desc = '已分配';
                break;
            case '2':
                desc = '已调派';
                break;
            case '3':
                desc = '';
                break;
            case '4':
                desc = '已取消';
                break;
            case '5':
                desc = '已完成';
                break;
            case '6':
                desc = '打回';
                break;
            default:
                break;
	    }
        return desc;
    }
	
	process(body,msg,res) {
        try {
            res.json({"success":true,"errorCode":"","errorMsg":"" });
            const info = JSON.parse(body.content,super.censor,4);
            debug.log(info);
            if(info.event === "ORDER_STATUS_CHANGE_NOTIFY") {
                const {BillCode,OrderId,Status,UserMobile,SiteName} = {...info.changeInfo};
                const statusDesc = this.getStatusDesc(Status);
                const cancelable = this.isCancelable(Status);
                const comments = `${UserMobile} ${SiteName}`;
                const unify = super.unify(OrderId,BillCode,Status,statusDesc,comments,'','','',cancelable,'STO');
                
                if(BillCode.length > 0)
                    super.saveWaybillno(OrderId,BillCode);

                super.getStamp(OrderId).then(stamp => {
                    debug.log(stamp);
                    super.saveState(stamp,unify);
                });

            } else if(info.event === "ORDER_CANCEL_NOTIFY") {
                const {OrderId} = {...info.cancelInfo};
                const unify = super.unify(OrderId,"","4","","运单已取消",'','','',false,'STO');
                super.setCanceled(OrderId);
                super.getStamp(OrderId).then(stamp => {
                    super.saveState(stamp,unify);
                });
            }

        } catch(e) {
            debug.log(e);
        }
	}

}

module.exports = SSto;

