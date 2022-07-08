const debug = require('../comm/debug');
const wtime = require('../comm/wtime');
const taosDB2 = require('../comm/taosdb2');

const CANCEL_VALUE = 9;

class State {
	constructor() {
        this.censor = function(key,value){
            if(typeof(value) == 'function'){
                return Function.prototype.toString.call(value)
            }   
            return value;
        };
	}

	process(body,msg,res) {
		
	}
	
	unify(orderid,waybillno,scode,sdesc,comments,lasttime,booktime,carriercode,cancelable,express) {

		return {orderid,waybillno,scode,sdesc,comments,lasttime,booktime,carriercode,cancelable,express};
	}

    async getStamp(orderid) {
        const sql = `SELECT stamp FROM route.states WHERE orderid ='${orderid}';`;
        const result = await taosDB2.Execute(sql);

        if(result.rows > 0) {
            const [stamp] = result.data[0];
            return stamp;
        }   
        else {
            return null;
        }
    }

	saveState(stamp,info) {
		const {orderid,waybillno,scode,sdesc,comments,lasttime,booktime,carriercode,cancelable,express} = {...info};
        const sql = `INSERT INTO route.states_data USING route.states TAGS(now) VALUES(${stamp === null ? 'now' : "'" + stamp + "'"},'${orderid}','${waybillno}','${scode}',
                                    '${sdesc}','${comments}','${lasttime}','${booktime}','${carriercode}',${cancelable},'${express}');`;
        taosDB2.Execute(sql);
	}

    /*FOR ZTO...*/
    saveWaybillno(orderid,waybillno) {
        const sql = `SELECT stamp,tbname,corpid,userid from milkyway.orders WHERE orderid='${orderid}';`;
        taosDB2.Execute(sql).then(result => {
            if(result.rows > 0) {
                const [stamp,tbname] = result.data[0];
                const sql2 = `INSERT INTO milkyway.${tbname} (stamp,waybillno) VALUES('${stamp}','${waybillno}');`;
                taosDB2.Execute(sql2);
            }

        });
    }

    setCanceled(orderid) {
        const sql = `SELECT stamp,tbname from milkyway.orders WHERE orderid='${orderid}';`;
        taosDB2.Execute(sql).then(result => {
            if(result.rows > 0) {
                const [stamp,tbname] = result.data[0];
                const sql2 = `INSERT INTO milkyway.${tbname} (stamp,status) VALUES('${stamp}',${CANCEL_VALUE});`;
                taosDB2.Execute(sql2);
            }

        });
    }

}

module.exports = State;
