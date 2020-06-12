// import a from './view/home';
class Home_controller {
    async Home(req, res) {
        await res.render("./view/home", { title: 'Demo Project' });
    }
}
let HomeService = new Home_controller();
module.exports = HomeService;