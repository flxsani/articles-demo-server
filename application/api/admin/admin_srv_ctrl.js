import { Router } from 'express';
import AdminService from './admin_srv';
let adminRoutes = Router();
import { CustomError } from '../../../libs/pnkCustomError';
import PnkJwtService from '../../../libs/pnk-jwt';




adminRoutes.get('/addarticles', PnkJwtService.authenticateToken, async (req, res) => {
    // adminRoutes.get('/addarticles', async (req, res) => {

    //let products = [];
    try {

        let response = await AdminService.GetArticlesFromUrl();
        // console.log("ResDataa:::::", response);
        res.json({ status: true, data: response });
    }
    catch (e) {
        console.log('in catch of /route - generate');
        // CustomError.FinalizeErrorInChain(e,"",req,res);
        res.send(CustomError.ToJson(e));
    }


});


adminRoutes.get('/articles/:page_no', PnkJwtService.authenticateToken, async (req, res) => {
    // adminRoutes.get('/articles/:page_no', async (req, res) => {

    let articles = [];
    try {
        // if (req.query.sortact && req.query.sortby) {
        //     console.log(" if sort act :", req.query);
        articles = await AdminService.GetArticleMasterByPageNo(req.params.page_no, 'desc', 'posted_on');
        // }
        // else {
        //     console.log(" else sort act :", req.query);
        //     articles = await AdminService.GetArticleMasterByPageNo(req.params.page_no);
        // }
        res.json(articles);
    }
    catch (e) {
        console.log('in catch of /route - generate');
        // CustomError.FinalizeErrorInChain(e,"",req,res);
        res.send(CustomError.ToJson(e));
    }


});
module.exports = adminRoutes;