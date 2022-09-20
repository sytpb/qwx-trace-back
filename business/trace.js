const debug = require('../comm/debug');
const wutils = require('../comm/wutils');
const taosDB2 = require('../comm/taosdb2');


class Trace {
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
	
	unify(waybillno,id,laststamp,city,remark,reason,status,express) {
		laststamp = new Date(laststamp).getTime() * 1000;

		return {"waybillno":waybillno,"id":id,"laststamp":laststamp,"city":city,"remark":remark,
				"reason":reason,"status":status,"express":express};

	}
	/*deprecated*/
	getAddresseeInfo(waybillno,callback) {
		let sql = `SELECT d_tel FROM milkyway.orders WHERE waybillno = '${waybillno}';`;
		console.log(sql);
		taosDB2.Execute(sql).then(result => {
			if(result.rows > 0) {
				let tell = result.data[0][0];
				console.log(tell);
				let sql = `SELECT corpid,userid FROM milkyway.contact WHERE d_tel = '${tell}';`;
				taosDB2.Execute(sql).then(result => {
					if(result.rows > 0) {
						let data = result.data[0];
						callback({"corpid":data[0],"userid":data[1]});
					}
				});
			}
		});
	}


	async lastStamp(waybillno) {
		let query = `SELECT LAST(laststamp,tocity) FROM route.trace WHERE waybillno ='${waybillno}';`;
		let result = await taosDB2.Execute(query);
	    debug.log(result);	
		if(result.rows > 0) {
            const [laststamp,tocity] = result.data[0];
			return [laststamp,tocity];
		}
		else {
			return [0,''];
		}
	}

	saveRoute(info) {
		debug.log(info);
        if(info.remark.length === 0)        /*get empty car number info */
            return;

		let query = `SELECT d_city,corpid,userid FROM milkyway.orders WHERE waybillno = '${info.waybillno}';`;

        //debug.log(query);
		taosDB2.Execute(query).then(result => {
			if(result.rows > 0) {
				let [d_city,corpid,userid] = result.data[0];
                
                const remark2 = info.remark.slice(0,120);
				const sql2 = `INSERT INTO route.trace_${corpid} USING route.trace TAGS('${corpid}') VALUES(now,'${userid}','${info.waybillno}',${info.laststamp},
											null,'${d_city}','${remark2}','${info.reason}',${info.status},'${info.express}');`;
				debug.log(sql2);
				taosDB2.Execute(sql2);
			}
		});
	}

	saveTrace(info) {
		debug.log(info);
        if(info.remark.length === 0)        /*get empty car number info */
            return;

		let query = `SELECT stamp,d_corpid,d_userid,d_city,corpid,userid FROM milkyway.orders WHERE waybillno = '${info.waybillno}';`;

        //debug.log(query);
		taosDB2.Execute(query).then(result => {
			if(result.rows > 0) {
				let [stamp,d_corpid,d_userid,d_city,corpid,userid] = result.data[0];
                
                const status = info.status;
                const trace = info.remark.slice(0,30);
                const laststamp = info.laststamp; /*microsecond*/

                debug.log(laststamp);
                const sql1 = `INSERT INTO milkyway.orders_${corpid}_${userid} USING milkyway.orders TAGS('${corpid}','${userid}') (stamp,status,trace,laststamp) VALUES('${stamp}',${status},'${trace}',${laststamp});`;
                debug.log(sql1);
                taosDB2.Execute(sql1);
                
                const remark2 = info.remark.slice(0,120);
				const sql2 = `INSERT INTO route.trace_${corpid} USING route.trace TAGS('${corpid}') VALUES(now,'${userid}','${info.waybillno}',${info.laststamp},
											null,'${d_city}','${remark2}','${info.reason}',${info.status},'${info.express}');`;
				debug.log(sql2);
				taosDB2.Execute(sql2);
                debug.log(d_corpid,typeof(d_corpid),d_corpid === 'null'); 
                if(d_corpid !== null) {
                    this.saveTrace2(info,corpid,userid,d_corpid,d_userid);
                }
			}
		});
	}

	saveTrace2(info,corpid,userid,d_corpid,d_userid) {
        
        const query = `SELECT stamp FROM milkyway.inbox WHERE corpid='${d_corpid}' AND waybillno='${info.waybillno}';`;
        taosDB2.Execute(query).then(result => {
            if(result.rows > 0) {/*UPDATE*/
                const [stamp] = result.data[0];
                const status = info.status;
                const trace = info.remark.slice(0,30);
                const laststamp = info.laststamp;
                

                const sql1 = `INSERT INTO milkyway.inbox_${d_corpid}_${d_userid} USING milkyway.inbox TAGS('${d_corpid}','${d_userid}') (stamp,status,trace,laststamp) VALUES('${stamp}',${status},'${trace}',${laststamp});`;
                debug.log(sql1);
                taosDB2.Execute(sql1);
            } else {/*INSERT*/
                const sql2 = `SELECT stamp,corpid,s_city,s_company,s_address,s_name,s_tel,d_city,waybillno,status,trace,laststamp,express,wares,ntop,action FROM milkyway.orders 
                                                                                                            WHERE corpid='${corpid}' AND userid ='${userid}' AND waybillno='${info.waybillno}';`;
                taosDB2.Execute(sql2).then(result=> {
                    if(result.rows > 0) {
                        const [stamp,...rest] = result.data[0];
                        const sql3 = `SELECT remark FROM milkyway.remark WHERE stamp = '${stamp}';`;
                        debug.log(sql3);
                        taosDB2.Execute(sql3).then((result) => {
                            let remark = '';
                            if(result.rows > 0 )
                                [remark] = result.data[0];
                            const sql4 = `INSERT INTO milkyway.inbox_${d_corpid}_${d_userid} USING milkyway.inbox TAGS('${d_corpid}','${d_userid}') VALUES(now,${wutils.Wrap(rest)},'${remark}');`;
                            debug.log(sql4);
                            taosDB2.Execute(sql4);
                            
                        });

                    }
                });

            }

        });

	}

}

module.exports = Trace;
