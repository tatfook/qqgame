
const path = require("path");
const rootdir = path.resolve(".");

exports.baseUrl = "/";
exports.qqgame = {
	host: "http://openapi.sparta.html5.qq.com",
	//host: "https://openapi.tencentyun.com";
	appid: "1106994032",
	appkey: "oSsmnQYFPMUD1o36",
}

exports.keys = "keepwork";

exports.view = {
	root: [
		path.join(rootdir, 'app/public/html'),
	].join(","),
	defaultViewEngine: 'nunjucks',
	mapping: {
		'.tpl': "nunjucks",
	}
};

exports.nunjucks = {
	tags: {
		variableStart: "{*",
		variableEnd: "*}",
	},
};

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
