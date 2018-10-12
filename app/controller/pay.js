
const Controller = require('egg').Controller;

class Pay extends Controller {
	async index() {
		await this.ctx.render("pay/index.html", {platform:"qzone"});
	}
}

module.exports = Pay;
