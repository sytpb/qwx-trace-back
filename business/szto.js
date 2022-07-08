const State = require('./state');
const debug = require('../comm/debug');



class SZto extends State {

	constructor() {
		super();
	}
    
    isCancelable(code) {

        if(code === '4')
            return false;
        return true;
    }
    	
	getStatusDesc(code) {
		let desc = '';

		switch(code) {
            case '1':
                desc = '下单成功';
                break;
            case '2':
                desc = '分配网点';
                break;
            case '3':
                desc = '分配业务员';
                break;
            case '4':
                desc = '业务员揽件';
                break;
            case '5':
                desc = '订单完结';
                break;
            case '6':
                desc = '订单取消';
                break;
            case '10':
                desc = '修改预约时间';
                break;
            case '14':
                desc = '修改订单收寄人信息';
                break;
            case '15':
                desc = '更换运单号';
                break;
            default:
                break;
	    }
        return desc;
    }
	
	process(body,msg,res) {
        try {
            debug.log(body);
            const info = JSON.parse(body.data);
            const {bill_code,partner_order_code,gmt_create,pre_order_status,assign_emp_mobile,assign_site_name} = {...info};
            const statusDesc = this.getStatusDesc(pre_order_status);
            const cancelable = this.isCancelable(pre_order_status);
            const comments = `${assign_emp_mobile} ${assign_site_name}`;
            const unify = super.unify(partner_order_code,bill_code,pre_order_status,statusDesc,comments,'','','',cancelable,'ZTO');
            
            if(bill_code.length > 0)
                super.saveWaybillno(partner_order_code,bill_code);
            
            if(pre_order_status === "6")
                super.setCanceled(partner_order_code);

            super.getStamp(partner_order_code).then(stamp => {
                debug.log(stamp);
                super.saveState(stamp,unify);
            });

            res.json({ "message":"调用成功","status":true,"result":"成功","statusCode":"200"});

        } catch(e) {
            debug.log(e);
        }
	}

}

module.exports = SZto;

