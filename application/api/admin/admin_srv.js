// import { DataService } from '../../../db';
import { CustomError } from '../../../libs/pnkCustomError';
import PnkJwtService from '../../../libs/pnk-jwt';
import { AddNew, AddMany, GetAll, Update, Delete, DeleteMultiple, GetDataByPkey, DoesExist, GetAllWithForeignData, GetAllWithLimit } from '../../../libs/DataServiceHelper';
import { ObjectId } from 'mongodb';
import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

class Admin_Service_Controller {

    constructor() {

    }

    async GetArticlesFromUrl() {
        try {
            let newsList = [];
            for (let i = 1; i < 4; i++) {
                let url = 'https://news.ycombinator.com/news?p=' + i;
                console.log("URL:::::::::::::::::", url);
                let urlData = await this.CallUrl(url); // We will get url data in text format.
                let htmlDom = await this.GetHtmlDomByString(urlData); // converted text data to html DOM.
                //console.log("HtmlDom::::", htmlDom);
                let list = await this.GetNewsListFromHtmlDom(htmlDom);
                await this.SaveNewsInDB(list);
                newsList = newsList.concat(list);
                //console.log("NewsListLength:::", newsList.length, list.length);
            }

            return newsList;

        } catch (e) {
            CustomError.PassErrorToParentHandler(e, "AddAdminUser", "Unable to Add new user :" + e.message, "");
        }
    }

    async CallUrl(url) {
        try {
            let data = '';
            await fetch(url, {
                method: 'GET'
            }).then((res) => res.text()).then((result) => {
                //console.log("URLREsponse:::", typeof result);

                data = result;

            }).catch((e) => {
                CustomError.PassErrorToParentHandler(e, "AddArticles", "Unable to load new articles :" + e.message, "");
            })
            return data;
        }
        catch (e) {
            CustomError.PassErrorToParentHandler(e, "StringToHtmlError", "Unable to convert string to HTML :" + e.message, "");
        }
    }

    async GetHtmlDomByString(htmlString) {
        try {
            return parse(htmlString, {
                lowerCaseTagName: false,
                script: false,
                style: false,
                pre: false,
                comment: false
            });
        }
        catch (e) {
            CustomError.PassErrorToParentHandler(e, "StringToHtmlError", "Unable to convert string to HTML :" + e.message, "");
        }
    }

    async GetNewsListFromHtmlDom(htmlDom) {
        try {
            let articleTable = htmlDom.querySelector('.itemlist');
            let articleRows = articleTable.querySelectorAll('tr');
            //console.log("ArticleRows::", articleRows.length)
            let i = 0;
            let articleArray = [];
            while (i < articleRows.length - 2) {
                // console.log("count:", i);
                let articleObj = { url: '', hacker_news_url: '', title: '', posted_on: '', up_votes: 0, comments: 0 } // blank object for an article
                let td = articleRows[i].querySelectorAll('td'); // Get all TDs from title row.
                if (td) {
                    //console.log("Td::::", td[2].toString());
                    let link = td[2].querySelector('a');
                    // console.log("Link:::", link.toString());
                    articleObj.url = link.getAttribute('href'); // Get Url from <a> Tag.
                    articleObj.title = link.innerHTML;

                    let hUrl = td[2].querySelector('span');
                    if (hUrl) {
                        //console.log("TDDD:::::::::::", hUrl.toString());
                        articleObj.hacker_news_url = 'https://news.ycombinator.com/' + hUrl.querySelector('a').getAttribute('href'); /// Get the hacker url from <span> tag
                    }

                    // articleObj.hacker_news_url = hUrl;
                }

                // Get UpVotes, comment count, posted time from next row
                let td1 = articleRows[i + 1].querySelectorAll('td'); // Get all TDs from title row.
                //console.log("Next ROW tds:::::::", td1.toString());
                let points = td1[1].querySelector('span').innerHTML.toString().split(" ")[0]; // Get the points from span tag and split is done because it has # points. So, we have to remove 'Points' and store only number count.
                // console.log("Points::::::", points);
                articleObj.up_votes = points;

                let ageAtag = td1[1].querySelector('.age');
                if (ageAtag) {
                    let age = ageAtag.querySelector('a').innerHTML;
                    //console.log("Age:::::", age.toString());
                    articleObj.posted_on = this.GetTimestampByString(age.toString());
                }

                let comment = td1[1].querySelectorAll('a');
                if (comment) {
                    //console.log("Comments:::::", comment.toString());
                    let comments = comment[comment.length - 1].innerHTML.toString();
                    //console.log("Comments:::::", comments.toString());
                    if (comment && comments != 'discuss')
                        articleObj.comments = comments.toString().split('&nbsp;')[0];
                    else
                        articleObj.comments = 0;
                }


                articleArray.push(articleObj);
                i = i + 3;
            }
            return articleArray;
        }
        catch (e) {
            CustomError.PassErrorToParentHandler(e, "StringToHtmlError", "Unable to convert string to HTML :" + e.message, "");
        }
    }

    async SaveNewsInDB(newsList) {
        try {
            for (let i = 0; i < newsList.length; i++) {

                try {

                    let doesExist = await DoesExist('Articles', { title: newsList[i].title, url: newsList[i].url });
                    console.log("DoesExists:::", doesExist);
                    let result = null;
                    if (!doesExist) {
                        // Save Article
                        result = await AddNew("Articles", newsList[i]);
                        //console.log("SaveStatus : ", result);
                    }
                    else {
                        //Update article
                        let updateData = { up_votes: newsList[i].up_votes, comments: newsList[i].comments }
                        result = await Update('Articles', { title: newsList[i].title, url: newsList[i].url }, updateData);
                        // console.log("UpdateStatus : ", result)
                    }

                } catch (e) {
                    CustomError.PassErrorToParentHandler(e, "DataNotSaved", "Article not added:" + e, "");
                }
            }
            return { status: true };

        } catch (e) {
            CustomError.PassErrorToParentHandler(e, "AddAdminUser", "Unable to Add new articles :" + e.message, "");
        }

    }
    GetTimestampByString(a) {
        let spTime = a.split(' ');
        let d = new Date();
        let pastDate = null;
        //alert(d.getTime());
        if (spTime[1] == 'minute' || spTime[1] == 'minutes') {
            pastDate = d.getTime() - parseInt(spTime[0]) * 60 * 1000;
        }
        if (spTime[1] == 'hour' || spTime[1] == 'hours') {
            pastDate = d.getTime() - parseInt(spTime[0]) * 3600 * 1000;
        }

        if (spTime[1] == 'day' || spTime[1] == 'days') {
            pastDate = d.getTime() - parseInt(spTime[0]) * 24 * 3600 * 1000;
        }

        return pastDate;
    }
    async AdminUserLogin(req, res) {
        try {
            console.log("reqestBody:", req.body)


            //calling with async i.e. .... blocking code
            try {
                let user = await GetAll('Users', { email: req.body.email, password: req.body.password }, []);

                // console.log("User::::", user);
                if (user.length > 0) {
                    user = user[0];
                    let access_token = PnkJwtService.generateAccessToken({ username: user.full_name, id: user._id, email: user.email });
                    // console.log("GeneratedToken::", access_token);
                    user.access_token = access_token;
                }
                else {
                    user = {
                        status: false,
                        message: "Invalid credentials."
                    }
                }


                return user;
            } catch (e) {
                CustomError.PassErrorToParentHandler(e, "UnableToGetUserData ", "User not added:" + e, "");
            }
        } catch (e) {
            CustomError.PassErrorToParentHandler(e, "AddAdminUser", "Unable to Add new user :" + e.message, "");
        }

    }

    async GetArticleMasterByPageNo(setNo, sortact = null, sortby = null) {
        try {
            //let condition = { "Categories": new ObjectId(categoryId) };
            // if (sortact && sortby) {
            let recordsInSet = 30;
            let initRecord = (parseInt(setNo) - 1) * recordsInSet;

            console.log("Limit:", recordsInSet, ", Skip::", initRecord);
            let articles = await GetAllWithLimit('Articles', {}, [], sortact, sortby, recordsInSet, initRecord);
            let totalRecords = await GetAllWithLimit('Articles', {}, [], sortact, sortby);

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
}





let AdminService = new Admin_Service_Controller();
module.exports = AdminService;