'use strict'
const taosDB2 = require('./taosdb2');

function tst() {
	//let taos = new taosDB2();
	taosDB2.Execute("select last(fromcity,waybillno,tocity,laststamp,remark) from route.trace2 group by waybillno").then(res => {
		console.log(res);
	}).catch(e => {
		console.log(e.response.data);
		//console.log(e);
	});
}

async function tst2() {
	try{
		let data = await taosDB2.Execute("select last(stamp,fromcity,waybillno,tocity,laststamp,remark) from route.trace2 group by waybillno",true);
		console.log(data);
	}
	catch(e) {
		console.log(e.response.data);
	}
}
//tst()  equals tst2()
tst2();

let aa = 1599191508000;
var date = new Date(aa);
var dt = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
console.log(dt);
