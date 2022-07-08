class wutils {

	constructor() {
	}

    static map2obj(map) {
        let obj= Object.create(null);

        for (let[k,v] of map) {
                obj[k] = v;
        }
        return obj;
    }

    static Wrap(row) {
        const rest = row.map(item=> typeof item === 'string' ? `\'${item}\'` : item === null ? 'null' : item);

        return rest;
    }
    
}

module.exports = wutils;

