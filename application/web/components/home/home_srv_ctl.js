import {
    Router
} from 'express';
let homeRoutes = Router();
import HomeSevice from './home_srv';
// import HomeSevice from './view/home';
//import {    CustomError} from '../../../../libs/pnkCustomError';


homeRoutes.get('/', async (req, res, next) => {
    try {
        // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        // await HomeSevice.Home(req, res);
        res.render("./home/views/home", {
            title: "Demo Product"
        });
        // res.status(200).send({
        //     status: true,
        //     response: {message:"Successfully completed"}
        //   });      
    } catch (e) {
        // res.send(CustomError.ToJson(e));
    }
});

module.exports = homeRoutes;
