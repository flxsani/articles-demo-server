import { Router } from 'express';
import { CustomError } from '../../../../pinaka/core/pnkCustomError'
import { Auth_Service } from '../../../api/authentication/auth_srv';
let config = require('../../../../config');
import { htmlTemplateManager } from '../../../../pinaka/core/htmltemplatemanager';
import { SingleImageUploadComponent } from '../../components/testing/views/imageupload/single_image_upload_ctrl';
import { MultiImageUploadComponent } from '../../components/testing/views/imageupload/multi_image_upload_ctrl';

export class TestingAdminPageController {
    constructor() {

    }

    async PageLoad(req, res) {
        try {
            let componentString = '';
            if (req.params.page != undefined) {
                if (req.params.page == 'singleimageupload') {
                    componentString = await this.LoadSingleImageUploadComponent();
                }
                else if (req.params.page == 'multiimageupload') {
                    componentString = await this.LoadMultiImageUploadComponent();
                }
                else {
                    componentString = '<h1>404</h1> <h3>Page not found</h3>';
                }
            }
            else {
                componentString = '<h1>Hello This is Testing Component</h1>';
            }

            // console.log("Content:::", componentString);
            let layoutHtmlDom = new htmlTemplateManager();
            let layout = config.ConfigData.RootPath + "application/web/layouts/admin-layout.html";
            await layoutHtmlDom.Load(layout);
            layoutHtmlDom.SetTemplateContent('divMainContentAdminDashBoard', componentString);
            // layoutHtmlDom.AddScriptToResponse(componentObj.scriptStr);
            // console.log("LayoutContent:::", layoutHtmlDom.ToString());
            // let pageStr = await layoutHtmlDom.ToString().replace(/pnk-script/g, "script");
            let pageStr = await layoutHtmlDom.GetFinalizeString();
            res.send(pageStr);
            layoutHtmlDom.Close();

        } catch (e) {
            CustomError.PassErrorToParentHandler(e, "DataNotSaved", "Admin View unable to load : " + e, "");
        }
    }
    async LoadSingleImageUploadComponent() {
        try {
            let singleImageCompObj = new SingleImageUploadComponent();
            return await singleImageCompObj.LoadComponent(config.ConfigData.RootPath + "application/web/components/testing/views/imageupload/single_image_upload.html");

        }
        catch (e) {
            CustomError.PassErrorToParentHandler(e, "Single Image Upload view Not Loaded", "Single Image Upload View unable to load : " + e, "");
        }
    }
    async LoadMultiImageUploadComponent() {
        try {
            let multiImageCompObj = new MultiImageUploadComponent();
            return await multiImageCompObj.LoadComponent(config.ConfigData.RootPath + "application/web/components/testing/views/imageupload/multi_image_upload.html");

        }
        catch (e) {
            CustomError.PassErrorToParentHandler(e, "Single Image Upload view Not Loaded", "Single Image Upload View unable to load : " + e, "");
        }
    }
}