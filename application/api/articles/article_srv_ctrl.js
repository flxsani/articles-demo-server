import { Router } from 'express';
import ArticleService from './article_srv';
let adminRoutes = Router();
import { CustomError } from '../../../libs/pnkCustomError';
import PnkJwtService from '../../../libs/pnk-jwt';


adminRoutes.get('/:page_no', PnkJwtService.authenticateToken, async (req, res) => {
    // adminRoutes.get('/:page_no', async (req, res) => {

    let articles = [];
    try {
        // if (req.query.sortact && req.query.sortby) {
        //     console.log(" if sort act :", req.query);
        articles = await ArticleService.GetArticlesByPageNo(req.user.id, req.params.page_no, 'desc', 'posted_on');
        // }
        // else {
        //     console.log(" else sort act :", req.query);
        //     articles = await ArticleService.GetArticlesByPageNo(req.user.id, req.params.page_no);
        // }
        res.json(articles);
    }
    catch (e) {
        console.log('in catch of /route - generate');
        // CustomError.FinalizeErrorInChain(e,"",req,res);
        res.send(CustomError.ToJson(e));
    }


});
adminRoutes.get('/addasread/:article_id', PnkJwtService.authenticateToken, async (req, res) => {
    // adminRoutes.get('/addasread/:article_id', async (req, res) => {


    try {

        let article = await ArticleService.AddArticleAsReadByUser(req, res);
        res.json(article);
    }
    catch (e) {
        console.log('in catch of /route - generate');
        // CustomError.FinalizeErrorInChain(e,"",req,res);
        res.send(CustomError.ToJson(e));
    }


});
module.exports = adminRoutes;