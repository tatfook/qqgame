
window.g_app = window.g_app || {};

$(function() {
	g_app.config = {
		qqUrlPrefix: "http://minigame.qq.com/plat/social_hall/app_frame/",
		canvasURLBaseUrl: "http://5b45af1e-0.gz.1255384442.clb.myqcloud.com/",
	};

	g_app.qqparams = {
		appid: "1106994032",
		openid : GameAPI.Aux.get_http_param('openid'),
		openkey : GameAPI.Aux.get_http_param('openkey'),
		pf : GameAPI.Aux.get_http_param('pf'),
		pfkey : GameAPI.Aux.get_http_param('pfkey'),
		param : GameAPI.Aux.get_http_param('param'),
	}
});

