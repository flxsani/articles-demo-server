import { CustomError } from '../../../pinaka/core/pnkCustomError'
import { Auth_Service } from '../../api/authentication/auth_srv';
let config = require('../../../config');
import { htmlTemplateManager } from '../../../pinaka/core/htmltemplatemanager';
import { AdminHomeComponent } from '../components/admin/views/admin_home_ctrl.js';

export class AdminPageController {
    constructor() {

    }

    async PageLoad(req, res) {
        try {

            let adminHomeCompObj = new AdminHomeComponent();
            let componentString = await adminHomeCompObj.LoadComponent(config.ConfigData.RootPath + "application/web/components/admin/views/admin_home.html");
            // console.log("Content:::", componentString);
            let layoutHtmlDom = new htmlTemplateManager();
            let layout = config.ConfigData.RootPath + "application/web/layouts/admin-layout.html";
            await layoutHtmlDom.Load(layout);
            layoutHtmlDom.SetTemplateContent('divMainContentAdminDashBoard', componentString);
            // layoutHtmlDom.AddScriptToResponse(componentObj.scriptStr);
           // console.log("LayoutContent:::", layoutHtmlDom.ToString());
            let pageStr = await layoutHtmlDom.ToString().replace(/pnk-script/g, "script");
            res.send(pageStr);
            layoutHtmlDom.Close();

        } catch (e) {
            CustomError.PassErrorToParentHandler(e, "DataNotSaved", "Admin View unable to load : " + e, "");
        }
    }
    

}