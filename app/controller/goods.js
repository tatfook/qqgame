const _ = require("lodash");
const CryptoJS = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");

const Controller = require('egg').Controller;

function urlEncode(str) {
	return encodeURIComponent(str).replace(/\*/g, '%2A');
}

function makeSign(method, urlPath, params, appkey) {
	method = method.toUpperCase();

	const secret = appkey + "&";

	delete params.sig;

	const keys = _.sortBy(_.keys(params));
	const paramarr = [];
	_.each(keys, function(key) {
		paramarr.push(key + "=" + params[key]);
	});
	const paramstr = paramarr.join("&");

	const sigstr = method + "&" + urlEncode(urlPath) + "&" + urlEncode(paramstr);
	
	const sig = Base64.stringify(CryptoJS.HmacSHA1(sigstr, secret));
	
	return sig;
}

function checkSig(method, urlPath, params, appkey) {
	const curTime = _.now() / 1000;
	const result = {ret: 0, msg: "OK"};

	let orgsig = params["sig"];
	delete params["sig"];

	// token不存在
	if (!params["token"]) {
		result.ret = 3; 
		result.msg = "token unexist";
		return result;
	}

	// 时效性检验
	if (params["ts"]) {
		const ts = _.toNumber(params["ts"]);
		if (curTime - ts > 900) {
			result.ret = 2;
			result.msg = "token expired";
			return result;
		}
	}

	const sig = makeSign(method, urlPath, params, appkey);

	if (sig != orgsig) {
		result.ret = 1;
		result.msg = "sig not match:" + sig + " orgsig:" + orgsig;
		return result;
	}

	return result;
}

class GoodsController extends Controller {
	async index() {
		await this.ctx.render("goods/index.html");
	}

	async getUserInfo(params) {
		const {ctx, config} = this;
		const userParams = {};

		userParams.openid = params.openid;
		userParams.openkey = params.openkey;
		userParams.appid = params.appid;
		userParams.pf = params.pf;

		const payapi = "/v3/user/get_info";
		const sig = makeSign("GET", payapi, userParams, config.appkey);

		const urlencodeParamArr = [];
		let urlencodeParamStr = "";
		
		_.each(userParams, (val, key) => urlencodeParamArr.push(key + "=" + urlEncode(val)));
		urlencodeParamStr = urlencodeParamArr.join("&");
		urlencodeParamStr = urlencodeParamStr + "&sig=" + urlEncode(sig);
		
		//正式环境的host
		// $host = "https://openapi.tencentyun.com";
		//测试环境的host
		const host = "http://openapi.sparta.html5.qq.com";
		const url = host + payapi + "?" + urlencodeParamStr;

		const result = await ctx.curl(url, {
			dataType: "json",
			timeout: 5000,
		});

		console.log(result);

		return result;
	}

	// 发货
	async delivery() {
		const {ctx, config} = this;
		const query = ctx.query;
		const qqgameConfig = config.qqgame;
		
		const deliverapi = config.baseUrl + "/goods/delivery";
		const result = checkSig("GET", deliverapi, query, qqgameConfig.appkey);

		ctx.status = 200;

		if (result.ret !=0) {
			ctx.body = result;
			return;
		}

		// 请求OK 通知客户端SERVER

		// 通知腾讯服务器
		const comfirmParam = {};
		confirmParam.appid = qqgameConfig.appid;
		confirmParam.openid = query.openid;
		confirmParam.pf = query.pf || "qqgame";
		confirmParam.payitem = query.payitem;
		confirmParam.token_id = query.token_id;
		confirmParam.billno = query.billno;
		confirmParam.amt = query.amt;
		confirmParam.payamt_coins = query.payamt_coins;
		confirmParam.zoneid = query.zoneid;
		confirmParam.ts = _.toString(_.now() / 1000);
		confirmParam.provide_errno = query.provide_errno;
		
		const confirmapi = "/v3/pay/confirm_delivery";
		const sig = makeSign("GET", confirmapi, confirmParam, qqgameConfig.appkey);
		
		const urlencodeParamArr = [];
		let urlencodeParamStr = "";
		_.each(confirmParam, (val, key) => urlencodeParamArr.push(key + "=" + urlEncode(val)));
		urlencodeParamStr = urlencodeParamArr.join("&");
		urlencodeParamStr = urlencodeParamStr + "&sig=" + urlEncode(sig);
		
		const url = qqgameConfig.host + payapi + "?" + urlencodeParamStr;
		const ret = await ctx.curl(url, {
			dataType: "json",
			timeout: 5000,
		});

		ctx.status = ret.status;
		ctx.body = ret.data;
	}

	async buy() {
		const {ctx, config} = this;
		const qqgameConfig = config.qqgame;

		const params = ctx.request.body;
		const payParams = {};

		payParams.appid = params.appid || qqgameConfig.appid;
		payParams.goodsmeta = "钻石*测试";
		payParams.goodsurl = "https://camo.githubusercontent.com/d80cf3b511ef4898bcde9a464de491fa15a50d06/68747470733a2f2f7261772e6769746875622e636f6d2f66656e676d6b322f6b6f612d67756964652f6d61737465722f6f6e696f6e2e706e67";
		payParams.openid = params.openid;
		payParams.openkey = params.openkey;
		payParams.payitem = "1*2*1";
		payParams.pf = params.pf;
		payParams.pfkey = params.pfkey;
		payParams.ts = _.toString(_.now() / 1000);
		payParams.zoneid = "0";

		const payapi = "/v3/pay/buy_goods";
		const sig = makeSign("GET", payapi, payParams, qqgameConfig.appkey);

		const urlencodeParamArr = [];
		let urlencodeParamStr = "";
		
		_.each(payParams, (val, key) => urlencodeParamArr.push(key + "=" + urlEncode(val)));
		urlencodeParamStr = urlencodeParamArr.join("&");
		urlencodeParamStr = urlencodeParamStr + "&sig=" + urlEncode(sig);
		
		//正式环境的host
		// $host = "https://openapi.tencentyun.com";
		//测试环境的host
		const url = qqgameConfig.host + payapi + "?" + urlencodeParamStr;

		const result = await ctx.curl(url, {
			dataType: "json",
			timeout: 5000,
		});

		ctx.status = result.status;
		ctx.body = result.data;
	}
}

module.exports = GoodsController;
