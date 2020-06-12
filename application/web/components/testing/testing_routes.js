import { Router } from 'express';
// import LoginService from './login_srv';
import { CustomError } from '../../../../pinaka/core/pnkCustomError';
import test_html_form_Ctl from './views/Test_html_Form_Ctl';
import { TestingViewController } from './testing_view_ctrl';
let testingRoutes = Router();

testingRoutes.get('/', (req, res, next) => {
    try {
        console.log("kailashddddddddddddddd");
        // let abc = new test_html_form_Ctl();
        console.log("testing-routes file")
        test_html_form_Ctl.Add(req, res);
    }
    catch (e) {
        CustomError.ToJson(e);
    }
})
testingRoutes.get('/singleimageupload', (req, res, next) => {
    try {
        console.log("Inside product.routes for Add Product");
        let testingViweCtrlObject = new TestingViewController();
        let componentString = testingViweCtrlObject.GetSingleImageUploadComponent(req, res);
        // console.log("CompoentData::", componentString);
        // res.send(componentString);
    }
    catch (e) {
        console.log("Error::", e);
        CustomError.ToJson(e);
    }
})

testingRoutes.get('/multiimageupload', (req, res, next) => {
    try {
        console.log("Inside product.routes for Add Product");
        let testingViweCtrlObject = new TestingViewController();
        let componentString = testingViweCtrlObject.GetMultiImageUploadComponent(req, res);
        // console.log("CompoentData::", componentString);
        // res.send(componentString);
    }
    catch (e) {
        console.log("Error::", e);
        CustomError.ToJson(e);
    }
})

module.exports = testingRoutes;