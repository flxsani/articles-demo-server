// import { DataService } from '../../../db';
import { CustomError } from '../../../libs/pnkCustomError';
import PnkJwtService from '../../../libs/pnk-jwt';
import { AddNew, AddMany, GetAll, Update, Delete, DeleteMultiple, GetDataByPkey, DoesExist, GetAllWithForeignData, GetAllWithLimit, UpdateInEmbeddedField } from '../../../libs/DataServiceHelper';
import { ObjectId } from 'mongodb';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

class Article_Service_Controller {

    constructor() {

    }

    async GetArticlesByPageNo(userId, setNo, sortact = null, sortby = null) {
        try {
            //let condition = { "Categories": new ObjectId(categoryId) };
            // if (sortact && sortby) {

            let user_data = await GetAll("Users", { _id: new ObjectId(userId) }, ['read_articles']);
            //console.log("UserData::", user_data);
            let condition = {};
            if (user_data.length > 0) {
                condition = { _id: { $nin: user_data[0].read_articles } };
            }
            let recordsInSet = 30;
            let initRecord = (parseInt(setNo) - 1) * recordsInSet;

            //console.log("Limit:", recordsInSet, ", Skip::", initRecord);
            let articles = await GetAllWithLimit('Articles', condition, [], sortact, sortby, recordsInSet, initRecord);
            let totalRecords = await GetAllWithLimit('Articles', condition, [], sortact, sortby);

            let res = { metarow: { totalRecordsInSet: recordsInSet, totalRecordsInDb: totalRecords.length, currentSetNo: parseInt(setNo), totalRecordsInCurrentSet: articles.length }, rows: articles };
            return res;
            // }
            // else {
            //     return await GetAllByFkey('Product', condition, 'Categories', 'Categories', '_id', 'ProductCategories') // Get Data by foreign key with all Fields 
            // }
        } catch (e) {
            CustomError.PassErrorToParentHandler(e, "GetStudentMasterByPageNo", "Unable to get Student Master :" + e.message, "");
        }

    }

    async AddArticleAsReadByUser(req, res) {
        try {
            let userId = new ObjectId(req.user.id);
            let articleId = new ObjectId(req.params.article_id);
            console.log("UserId", userId, articleId);
            let article = await UpdateInEmbeddedField('Users', { _id: userId }, 'read_articles', articleId); /// if await
            return {
                'status': true,
                'message': 'Article added as read by you'
            };

        } catch (e) {
            CustomError.PassErrorToParentHandler(e, "AddArticleAsReadByUser", "Unable to add Article as read by user :" + e.message, "");
        }
    }
}






let ArticleService = new Article_Service_Controller();
module.exports = ArticleService;