import { CustomError } from '../../../../../../pinaka/core/pnkCustomError'
import { Auth_Service } from '../../../../../api/authentication/auth_srv';
let config = require('../../../../../../config');
import { htmlTemplateManager } from '../../../../../../pinaka/core/htmltemplatemanager';

export class SingleImageUploadComponent {
    constructor() {

    }


    async LoadComponent(viewFile) {
        try {
            let htmlDom = new htmlTemplateManager();
            await htmlDom.Load(viewFile);

            // htmlDom.SetValue('ComponentDivID', "htmlString");
            let compStr = htmlDom.ToString();
            htmlDom.Close();
            return compStr;
        }
        catch (e) {
            CustomError.PassErrorToParentHandler(e, "Error : Product Entry component load ", " Product Entry Component unable to Load ", "");
        }
    }


}