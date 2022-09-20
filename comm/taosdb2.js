'use strict'
const axios = require('axios');
const util = require('util');
const debug = require('debug');

const url = 'http://127.0.0.1:6041/rest/%s';
const auth = 'Basic cm9vdDp0YW9zZGF0YQ==';

class taosDB2 {

	constructor() {
		this.url = url;
	}

    static async Execute(sql,unix=false) {
        let headers = {
			Authorization: auth
        };
        
        try {
            const { data } = await axios({
                url: util.format(url,unix ? 'sqlt':'sql'),
                method:"post",
                headers:headers,
                data:sql
            });
            if(data.status == "succ") {
                return data;    
            } 
        } catch(e) {
            debug.log(e);
            debug.log(e?.response?.data);
            debug.log(e?.response?.config);
        }
    }

}

module.exports = taosDB2;
