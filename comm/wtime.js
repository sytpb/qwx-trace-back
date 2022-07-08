class wtime {

	constructor() {
	}

    static now() {
        let day = new Date();
        return `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()} ${day.getHours()}:${day.getMinutes()}:${day.getSeconds()}`;
    }
    
    static date() {
        let day = new Date();
        return `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
    }

    static local(date) {
        let day = new Date(date);
        return `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
    }

    static last(n) {
        let day = new Date();
        day.setDate(day.getDate() + n);
        day.setHours(0);
        day.setMinutes(0);
        day.setSeconds(0);
        day.setMilliseconds(0);
        return day.getTime();
    }   

    static today() {
        let today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        return today.getTime();
    }   

    static midday() {
        let today = new Date();
        today.setHours(12);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        return today.getTime();
    }

    static weekday() {
        let today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        let nday = today.getDay() || 7;
        today.setDate(today.getDate() - nday + 1);

        let day = today;
        return day.getTime();
    }

    static monthday() {
        let today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        today.setDate(1);

        let day = today;
        return day.getTime();
    }

    static yearday() {
        let today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        today.setDate(1);
        today.setMonth(0);

        let day = today
        return day.getTime();
    }

}

module.exports = wtime;

//console.log(wtime.local(wtime.weekday()));
//console.log(wtime.weekday());
//console.log(wtime.local(wtime.yearday()));
//console.log(wtime.local(wtime.weekday()));


