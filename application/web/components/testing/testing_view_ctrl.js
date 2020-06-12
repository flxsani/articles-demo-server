import { CustomError } from '../../../../pinaka/core/pnkCustomError';
let config = require('../../../../config');
import { htmlTemplateManager } from '../../../../pinaka/core/htmltemplatemanager';
import { SingleImageUploadComponent } from './views/imageupload/single_image_upload_ctrl';
import { MultiImageUploadComponent } from './views/imageupload/multi_image_upload_ctrl';

export class TestingViewController {
    constructor() {

    }


    async GetSingleImageUploadComponent(req, res) {
        try {

            let singleImageUploadObject = new SingleImageUploadComponent();
            let componentString = await singleImageUploadObject.LoadComponent(config.ConfigData.RootPath + "application/web/components/testing/views/imageupload/single_image_upload.html");
            //console.log("ListComponentString::", componentString);
            res.send(componentString);
            // return componentString;

        } catch (e) {
            CustomError.PassErrorToParentHandler(e, "ProductListComponentLoadingError", "Product List View unable to load : " + e, "");
        }
    }

    async GetMultiImageUploadComponent(req, res) {
        try {

            let multiImageUploadObject = new MultiImageUploadComponent();
            let componentString = await multiImageUploadObject.LoadComponent(config.ConfigData.RootPath + "application/web/components/testing/views/imageupload/multi_image_upload.html");
            //console.log("ListComponentString::", componentString);
            res.send(componentString);
            // return componentString;

        } catch (e) {
            CustomError.PassErrorToParentHandler(e, "ProductListComponentLoadingError", "Product List View unable to load : " + e, "");
        }
    }

}