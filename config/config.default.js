
const path = require("path");
const rootdir = path.resolve(".");

exports.baseUrl = "/";
exports.qqgame = {
	host: "http://openapi.sparta.html5.qq.com",
	//host: "https://openapi.tencentyun.com";
	appid: "1106994032",
	appkey: "oSsmnQYFPMUD1o36",
	CanvasURL:"5b45af1e-0.gz.1255384442.clb.myqcloud.com",
}

exports.keys = "keepwork";

exports.view = {
	root: [
		path.join(rootdir, 'app/public/html'),
	].join(","),
	defaultViewEngine: 'ejs',
	mapping: {
		'.ejs': "ejs",
		'.html': "ejs",

	}
};

exports.ejs = {};

exports.securities = {
	enable: false,
};

exports.cluster = { 
	listen: { 
		path: '', 
		port: 9001, 
		hostname: '',
  	} 
};
//exports.middleware = ["header"];
