const express = require('express');

import path from 'path';

let shell = require('shelljs');
var fs = require('fs');
// const app = express();
// const rndRoutes = express.Router();
let appGlobals = require('../config').ConfigData;
let eSepCh = appGlobals.errorSeparationChar;

export class CustomError {
    constructor(message, prettyMessage = "", errType, stack, forceClearError = true) {
        //super(message)

        //this.name = this.constructor.name
        this.name = "CustomError";
        this.status = 404;
        //this.req = req;
        //this.res = res;
        this.inMessage = message + eSepCh + this.message;
        this.message = message;
        this.stack = stack;

        if (prettyMessage == "")
            this.prettyMessage = appGlobals.PrettyErrorMessage;
        else
            this.prettyMessage = prettyMessage;


        this.type = errType;

        this.newTrace = CustomError.ReturnTrace(0, stack);
        this.timestamp = (new Date()).getTime(),
            this.dateTime = (new Date())


        // console.log(this instanceof customError);

        if (forceClearError) {
            //this.LogAndExit(req,res);
        }

    }



    static CreatError(errType, message, prettyMessage = "", error) {

        // console.log("CreateError22222222222222222222", message);
        let custErr = "";
        if (error.stack != undefined) {
            custErr = new CustomError(message, prettyMessage, errType, error.stack);
            console.log("CreateError4444444444444444444444444444 if:", custErr.message);
            return custErr;
        } else {
            custErr = new Error(message);
            //custErr = new CustomError(message, req, res, "");
            console.log("CreateError4444444444444444444444444444 else :", custErr.message);
            return custErr;
        }

    }




    static ReturnTrace(levels, stackTrace) {

        //const splitCharacter = "\n    at";;
        //const stack = "29KCustomError: DB Problem:Product1 is not defined\n    at ProductController.GetProductListASYNC (/home/shiva/work/29KProject/29k_app_server/application/components/products/product_ctrl.js:62:19)\n    at ProductController.GetProductList (/home/shiva/work/29KProject/29k_app_server/application/components/products/product_ctrl.js:21:39)\n    at /home/shiva/work/29KProject/29k_app_server/application/routes/product.routes.js:31:10\n    at Layer.handle [as handle_request] (/home/shiva/work/29KProject/29k_app_server/node_modules/express/lib/router/layer.js:95:5)\n    at next (/home/shiva/work/29KProject/29k_app_server/node_modules/express/lib/router/route.js:137:13)\n    at Route.dispatch (/home/shiva/work/29KProject/29k_app_server/node_modules/express/lib/router/route.js:112:3)\n    at Layer.handle [as handle_request] (/home/shiva/work/29KProject/29k_app_server/node_modules/express/lib/router/layer.js:95:5)\n    at /home/shiva/work/29KProject/29k_app_server/node_modules/express/lib/router/index.js:281:22\n    at Function.process_params (/home/shiva/work/29KProject/29k_app_server/node_modules/express/lib/router/index.js:335:12)\n    at next (/home/shiva/work/29KProject/29k_app_server/node_modules/express/lib/router/index.js:275:10)\n    at Function.handle (/home/shiva/work/29KProject/29k_app_server/node_modules/express/lib/router/index.js:174:3)\n    at router (/home/shiva/work/29KProject/29k_app_server/node_modules/express/lib/router/index.js:47:12)\n    at Layer.handle [as handle_request] (/home/shiva/work/29KProject/29k_app_server/node_modules/express/lib/router/layer.js:95:5)\n    at trim_prefix (/home/shiva/work/29KProject/29k_app_server/node_modules/express/lib/router/index.js:317:13)\n    at /home/shiva/work/29KProject/29k_app_server/node_modules/express/lib/router/index.js:284:7\n    at Function.process_params (/home/shiva/work/29KProject/29k_app_server/node_modules/express/lib/router/index.js:335:12)";
        const stack = stackTrace;

        //var re = /at/g

        //const level = 4;
        if (stack != "") {
            var re = /\n    at/g;
            // str = "foobarfoobar";
            var indices = [];
            let match1 = null;
            while ((match1 = re.exec(stack)) != null) {
                indices.push(match1.index);
                //  console.log("match found at " + match1.index);
            }

            // const arrPos = stack.match(/at/g);

            let newTrace = stack.substring(0, indices[levels]);

            // console.log(newTrace);

            return newTrace;
        } else return "";

    }

    // static LogToDb(errJson, collectionName) {


    // }

    // static LogToMail(Json, arrMails) {



    // }




    static PassErrorToParentHandler(e, errorType, message, prettyMessage = "") {
        console.log("In HandlePassErrorToParent");
        let className = e.constructor.name;
        console.log("Error type:" + className);
        // throw e;
        switch (className) {
            case 'CustomError':
                console.log('A Custom Error Occured.');
                e.message = message + eSepCh + e.message;
                e.type = errorType + eSepCh + e.type;
                // this.LogToFile(this.ToJson(e))
                throw e;
            // break;
            case 'Error':
                console.log('An Error occured.');
                //errType = e
                let errType = errorType + eSepCh + e.type;
                message = message + eSepCh + e.message;
                let errObj = CustomError.CreatError(errType, message, prettyMessage, e);
                console.log('error object created 1');
                //this.LogToFile(this.ToJson(e))
                throw errObj;
            // break;
            default:
                //this.LogToFile(this.ToJson(e))
                console.log('An Error  with type ' + e.type + 'occurred.');
                errorType = errorType + eSepCh + e.type;
                message = message + eSepCh + e.message;
                errObj = CustomError.CreatError(errType, message, prettyMessage, e);
                console.log('error object created 2');
                throw errObj;
            // break;
        }
    }





    static HandleErrorAndContinueExecution(err, type, message, prettyMessage = "", res = null, req = null, levels = 4, wetherBrowserResponse = false) {

        if (prettyMessage == "")
            prettyMessage = appGlobals.PrettyErrorMessage;

        err.prettyMessage = prettyMessage;

        const stack = err.stack || "";

        //var re = /at/g

        let newTrace = CustomError.ReturnTrace(levels, stack);

        //const level = 4;
        if (stack != "") {
            var re = /\n    at/g;
            // str = "foobarfoobar";
            var indices = [];
            let match1 = null;
            while ((match1 = re.exec(stack)) != null) {
                indices.push(match1.index);
                //  console.log("match found at " + match1.index);
            }

            // const arrPos = stack.match(/at/g);

            newTrace = stack.substring(0, indices[levels]);
        }

        err.stack = newTrace;
        err.timestamp = (new Date()).getTime();
        err.dateTime = (new Date());
        err.type = type;

        let errJson = CustomError.ToJson(err);

        console.log(errJson);



        //  console.log("clearing error" + JSON.stringify(errJson));
        console.log("LogFilePath::", appGlobals.FilePaths.logFilePath);

        let filePath = appGlobals.FilePaths.logFilePath;
        let collectionName = "";
        let arrMails = null;

        if (appGlobals.RequestMode == "DEV" || appGlobals.RequestMode == "DEBUG") {

            if (wetherBrowserResponse) {

                res.json(errJson);
                res.end();

            }

        }
        else {
            if (appGlobals.LogError.wetherFile) {
                CustomError.LogToFile(errJson, filePath);
            }

            if (appGlobals.LogError.wetherDb)
                CustomError.LogToDb(errJson, collectionName);

            if (appGlobals.LogError.wetheMail)
                CustomError.LogToMail(errJson, arrMails);

        }

    }



    static SendResponse(errorJson, req, res) {
        //let finalErrorJson = errorJson

    }

    static ToString(e) {
        let errJson = CustomError.ToJson(e);
        return JSON.stringify(errJson);
    }

    static ToJson(e) {

        let errName = "";
        let prettyMessage = "";
        if ((e.constructor.name) != undefined) {
            errName = e.constructor.name;
        }
        else
            errName = "UnnamedError";
        if (e.prettyMessage != "")
            prettyMessage = e.prettyMessage;

        let errJson = {
            error: {
                name: errName,
                type: e.type,
                message: e.message,
                //stacktrace: this.stack,
                trace: e.stack,
                timestamp: e.timestamp,
                datetime: e.dateTime,
                prettymessage: prettyMessage,

            }
        }

        let filePath = appGlobals.FilePaths.logFilePath;
        console.log("LogFilePath::", filePath)
        let collectionName = "";
        let arrMails = null;

        if (appGlobals.RequestMode == "DEV" || appGlobals.RequestMode == "DEBUG") {

            if (appGlobals.LogError.wetherFile) { /// This is here only for testing.
                CustomError.LogToFile(errJson, filePath);
            }

        }
        else {
            if (appGlobals.LogError.wetherFile) {
                CustomError.LogToFile(errJson, filePath);
            }

            if (appGlobals.LogError.wetherDb)
                CustomError.LogToDb(errJson, collectionName);

            if (appGlobals.LogError.wetheMail)
                CustomError.LogToMail(errJson, arrMails);
        }

        //console.log("in error to json"+errJson);

        return errJson;
    }

    static LogToFile(errJson) {
        //console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyydddddddddddddddddddd");
        let f_name = "logfile.txt";
        let dirpath = appGlobals.FilePaths.logFilePath;
        let filepath = dirpath + '/' + f_name;
        try {
            // filename = (filename.toLowerCase()).replace(/ /g, "_");
            if (!fs.existsSync(dirpath)) {
                console.log("exists::", fs.existsSync(dirpath));
                shell.mkdir('-p', dirpath);
            }
            if (!fs.existsSync(filepath)) {
                console.log("File not  available");
                fs.closeSync(fs.openSync(filepath, 'w'));
            }
            // var filepath = filepath + '/' + filename + '_' + Date.now() + '.' + extension;

            let oldContent = fs.readFileSync(filepath, 'utf8');
            let logFileContent = oldContent + JSON.stringify(errJson) + '\n\n------------------------------------\n\n';
            let k = fs.writeFileSync(filepath, logFileContent);
        } catch (e) {
            console.log(e);
            // fileFormatError.LogToFile(e, req, res, filepath, '', '',filename);
        }
    }

}


//const CustomError = new customError();

//module.exports = customError  ;