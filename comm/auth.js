const Aes = require('./aes');
const debug = require('./debug');

const key = "onetown521onetown521onetown52188";

class Auth {

    constructor() {
    }
   
    
    static login(corpid,userid,res) {
        this.setCookie(corpid,userid,res);
        //res.status(200).end();
    }

    static saveAccInfo2Cookie(accinfo,res) {
        this.setCookie2(accinfo,res);
    }

    static authentication(req,res) {
        if(this.verifyCookie(req,res)) {
            return true;
        }
        return false;
    }
    
    static timeoutCookie(req,res) {
        const options = { expires: new Date(Date.now() + -1*3600000),path: '/',encode: String};        
        res.cookie('usercookie', 'timeout',options);
        res.cookie('acccookie','timeout',options);
    }

    static setCookie(corpid,userid,res) {
        console.log(`.........SET COOKIE [${corpid}] [${userid}].......`);
        
        const content = JSON.stringify(this.genToken2(corpid,userid));
        
        debug.log(content);
        const options = { expires: new Date(Date.now() + 8*3600000),path: '/',encode: String};        
        res.cookie('usercookie', content,options);

    }

    static setCookie2(accinfo,res) {
        console.log(`.........SET COOKIE [${accinfo}].......`);
        
        const content = JSON.stringify(this.genAccount(accinfo));
        
        debug.log(content);
        const options = { expires: new Date(Date.now() + 8*3600000),path: '/',encode: String};        
        res.cookie('acccookie', content,options);

    }
     
    static verifyCookie(req,res) {
        //debug.log(req.cookies,req.cookies.__proto__===undefined);
        if(req.cookies.__proto__ === undefined)
            return false;
        const {corpid,userid,token,iv} = JSON.parse(req.cookies.usercookie);
        //debug.log(corpid,userid,iv,token);
        const token2 = Aes.encrypt(iv,key,JSON.stringify({"corpid":corpid,"userid":userid})); 
        if(token2 !== token)
            return false;
        
        const content1 = req.cookies.usercookie;
        const content2 = req.cookies.acccookie;
        /*update expires time*/
        const expires = { expires: new Date(Date.now() + 4*3600000),path: '/',encode: String };
        res.cookie('usercookie', content1,expires);
        res.cookie('acccookie', content2,expires);
        //debug.log(req.headers,req.cookies);
        
        return true;
    }

    static verifyToken(corpid,userid,authorization) {
        
        if(!authorization)
            return false;

        const text = authorization.split(":");
        const token = text[0];
        const iv = text[1];
        const now = new Date().getTime();
        const content = {"corpid":corpid,"userid":userid};
        const plaintext = JSON.stringify(content);
        const token2 = Aes.encrypt(iv,key,plaintext);
        if(token === token2){
            if((now - iv) < 24*3600*1000)
                return true;
        }
        return false;
    }

    static genToken2(corpid,userid) {
        const iv = String(new Date().getTime());
        const content = {"corpid":corpid,"userid":userid};
        const plaintext = JSON.stringify(content);
        let token = Aes.encrypt(iv,key,plaintext);
        return {"corpid":corpid,"userid":userid,"token":token,"iv":iv};
    }

    static genToken(corpid,userid) {
        const iv = String(new Date().getTime());
        const content = {"corpid":corpid,"userid":userid};
        const plaintext = JSON.stringify(content);
        let token = Aes.encrypt(iv,key,plaintext);
        token = token.replace(/\+/g, '%2B');       //For '+' convert to SPACE issue;
        return {"token":token,"iv":iv};
    }

    static genAccount(info) {
        debug.log(info);
        if(Object.keys(info).length === 0)  /*no record in DB*/
            return {};
        const iv = String(info.stamp);
        debug.log(iv);
        const plaintext = JSON.stringify(info);
        const token = Aes.encrypt(iv,key,plaintext);
        return {"token":token,"iv":iv};
    }

    static decryptAccount(acccookie) {
        const {token,iv} = acccookie;
        const plaintext = Aes.decrypt(iv,key,token);
        debug.log(token);
        const info = JSON.parse(plaintext);
        return info;
    }

}

function genToken_tst(corpid,userid,iv) {
    //const iv = String(new Date().getTime());
    const content = {"corpid":corpid,"userid":userid};
    const plaintext = JSON.stringify(content);
    const token = Aes.encrypt(iv,key,plaintext);
    console.log(token);
    return {"token":token,"iv":iv};
}
//genToken_tst("ww2b7dbb2cbc418245","SongYanTao","1619662638431");
//console.log(Auth.verifyToken("abcd123","userid","1619271031879"));
module.exports = Auth;
