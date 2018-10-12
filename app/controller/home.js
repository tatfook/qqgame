const shell = require("shelljs");
const Controller = require('egg').Controller;

class HomeController extends Controller {
	async index() {
		await this.ctx.render("home/index.html");
	}

	async code() {
		const cmd_str ="git reset --hard HEAD; git pull origin master";
		shell.exec(cmd_str);

	}
}

module.exports = HomeController;
