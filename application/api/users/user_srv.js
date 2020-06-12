// import { DataService } from '../../../db';
import { CustomError } from '../../../libs/pnkCustomError';
import PnkJwtService from '../../../libs/pnk-jwt';
import { AddNew, AddMany, GetAll, Update, Delete, DeleteMultiple, GetDataByPkey, DoesExist, GetAllWithForeignData } from '../../../libs/DataServiceHelper';
import { ObjectId } from 'mongodb';
class User_Service_Controller {

    constructor() {
    }


    async AddUser(req, res) {
        try {
            console.log("reqestBody:", req.body)

            let tmpUser = { full_name: req.body.full_name, email: req.body.email, password: req.body.password, role: "User", Status: 'NOT VERIFIED', AddedOn: new Date().getTime(), read_articles: [] }
            console.log("hi SaveUser");
            //calling with async i.e. .... blocking code
            try {
                let user = await AddNew('Users', tmpUser); /// if await

                return user;
            } catch (e) {
                CustomError.PassErrorToParentHandler(e, "DataNotSaved", "User not added:" + e, "");
            }
        } catch (e) {
            CustomError.PassErrorToParentHandler(e, "AddAdminUser", "Unable to Add new user :" + e.message, "");
        }

    }

    async AddAdminUser(req, res) {
        try {
            console.log("reqestBody:", req.body)

            let tmpUser = { full_name: req.body.full_name, email: req.body.email, password: req.body.password, mobile_no: req.body.mobile_no, role: "Super Admin", Status: 'NOT VERIFIED', AddedOn: new Date().getTime() }
            console.log("hi SaveAdminUser");
            //calling with async i.e. .... blocking code
            try {
                let user = await AddNew('Users', tmpUser); /// if await
                //console.log("Product srvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv : ", user.toString())


                // res.json({
                //     'status': true,
                //     'message': 'Product has been added successfully',
                //     'product': product
                // });    
                return user;
            } catch (e) {
                CustomError.PassErrorToParentHandler(e, "DataNotSaved", "User not added:" + e, "");
            }
        } catch (e) {
            CustomError.PassErrorToParentHandler(e, "AddAdminUser", "Unable to Add new user :" + e.message, "");
        }

    }
    async UserLogin(req, res) {
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


}





let UserService = new User_Service_Controller();
module.exports = UserService;