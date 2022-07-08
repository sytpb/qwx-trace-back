class Father {
	constructor() {
		console.log('Father');
	}
    test(){
		console.log("i am father's test");
        return 0;
    }
    /*static test1(){
        return 1;
    }*/
}

class Child2 extends Father {
    constructor(){
        super();
    }
	
	test2() {
		//console.log('ssssssssssss');
		super.test();
		return 'i am test2'
	}
    /*static test3(){

        return super.test1()+2;
    }*/
}

let ch2 = new Child2();

let ch1 = new Father();

//console.log(ch2.test2());

//console.log(ch2.test2());

//console.log(Child2.test3()); // 3
function genOrderID() {
        let stime = new Date();
        let mseconds = stime.setMilliseconds(stime.getMilliseconds());
        let rand = parseInt(Math.random()*1000);
        return `${mseconds}${rand}`;    
}


console.log(new Date().getTime());
console.log(genOrderID());


async function lastStamp(waybillno) {

    const [...rest] = [10000,'dalian'];

    return (rest);
}

lastStamp('test').then(([a,b])=> {

    console.log(a,b);
})


