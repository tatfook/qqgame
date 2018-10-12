
module.exports = app => {
	const { router, controller, config  } = app;
	
	//console.log(config);

	router.get('/', controller.home.index);
	router.get('/goods', controller.goods.index);
	router.post('/goods/buy', controller.goods.buy);
	router.get('/goods/delivery', controller.goods.delivery);
	//router.post('/goods/delivery', controller.goods.delivery);

	router.get("/news", controller.news.list);

	router.get('/pay', controller.pay.index);
};
