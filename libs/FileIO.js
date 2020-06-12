import fs from 'fs';
import path from 'path';
let shell = require('shelljs');
var archiver = require('archiver');
import { CustomError } from './pnkCustomError';
class FileIo {

    
    
    //////////////////////////////////////////// kailash 08-02-2020 working for templateProcessor before htmltemplate///////
    // async ReadFile(filePath) {
    //     // console.log("In ReadFile Function: ", filePath);
    //     var contents = await fs.readFileSync(filePath, 'utf8');
    //     // console.log("what is this nowag : ",filePath);
    //     return contents;
    // }

    // LoadXml(filePath) {
    //     // console.log("In LoadXml function: ", filePath);
    //     let xmlContent = this.ReadFile(filePath).catch((e) => {
    //         let fileName = this.GetFileNameFromPath(filePath);
    //         // console.log("Inside loadxml function si:")
    //         // throw (new Error("File Not Found : " + fileName));
    //         CustomError.PassErrorToParentHandler(e, "XmlFileNotFound","Xml FileName -  " + fileName + " at file Path - " + filePath + " Not Found", "");

    //     })
    //     return xmlContent;

    // }
    //////////////////////////////////////////// End kailash 08-02-2020 working for templateProcessor before htmltemplate///////

    /////////////////////////////////////// 08-02-2020 ashu sir//////////////
    
    
    
    
    
    ReadFile(filePath) {
        console.log("In ReadFile Function: ", filePath);
        try {
        var contents = fs.readFileSync(filePath, 'utf8');
            return contents;
        }
        catch(e)
        { 

            CustomError.PassErrorToParentHandler(e, "FileNotFound","Xml File " +  filePath + " Not Found", "");
        }
    }

    LoadXml(filePath) {
        console.log("In LoadXml function: ", filePath);
        let fileName = "";
        let xmlContent = "";
        try { 
            xmlContent = this.ReadFile(filePath)
            fileName = this.GetFileNameFromPath(filePath);
        }
        catch(e)
         {
            //throw (new Error("File Not Found : " + fileName));
            CustomError.PassErrorToParentHandler(e, "XmlFileNotFound","Xml File " + fileName + "file Path " + filePath +" Not Found", "");
        }

        // console.log("what is this nowag 1 : ", filePath);
        // console.log("what is this nowag 2 : ", xmlContent);
        return xmlContent;

    }
    
    
    
    
    ///////////////////////////////// End ashu sir//////////////////////
    
    
    
    LoadTemplate(templatePath) {



    }

    LoadJson(jsonPath) {


    }
    ModifyJson(jsonPath, whereToModify, newModification) {


    }
    WriteJson(jsonPath, newJsonContent) {




    }

    WriteXml(xmlFilePath, xmlContent) {


    }

    async WriteFile(filePath, stringContent) {
        return new Promise(async (resolve, reject) => {

            if (fs.existsSync(filePath)) {
                // Do something
                // console.log("Om");
                fs.writeFile(filePath, stringContent, function (err) {
                    if (err) {
                        //return console.log(err);
                        // console.log("Inside")
                        reject('Error:' + err);
                    } else {
                        console.log("Inside writefile");
                        resolve("success");
                    }
                    console.log("The file is updated!");
                })
            }
            else {
                console.log("nwea : ", path.dirname(filePath));
                // await fs.mkdir(path.dirname(filePath), { recursive: true }, () => {
                // await fs.mkdir('E:\Office work\auto_node\generated\', { recursive: true }, () => {

                var parts = filePath.split("/");
                // console.log("partslength : ", parts)
                // console.log("partslength : ", parts.length)
                for (var i = 1; i < parts.length; i++) {
                    var finalpath = path.join.apply(null, parts.slice(0, i));
                    try {
                        fs.mkdirSync(finalpath);
                    } catch (e) {
                        if (e.code != 'EEXIST') throw e;
                    }
                }

                fs.writeFile(filePath, stringContent, function (err) {
                    if (err) {
                        //return console.log(err);
                        console.log("Inside write error now")
                        reject('Error:' + err);
                    } else {
                        console.log("Inside writefile");
                        resolve("success");
                    }
                    console.log("The file was saved!");
                })

                // });
                //////////////////
            }
        });
    }





    WriteTemplateFile(templatePath, newFileContent) {

    }

    ModifyFile(templatePath, whatToModifyStr, withWhatToModifyStr) {



    }

    GetFileNameFromPath(pathStr) {
        //return new Promise((resolve, reject) => {
        try {

            let tempArr = pathStr.split('/');
            // console.log("tempArr : ", tempArr);
            let tempFileName = tempArr[tempArr.length - 1].split('.')[0] + '.' + tempArr[tempArr.length - 1].split('.')[1];
            // console.log("tempFileName : ", tempFileName);
            // let firstFileName = tempArr[tempArr.length - 1].split('.')[0]; 
            // let fileExtension = tempArr[tempArr.length - 1].split('.')[1];
            // let firstSpecialCharacter = firstFileName.indexOf("_");
            // let intermediateString = firstFileName.substring(firstSpecialCharacter);
            // console.log("intermediate : ", intermediateString);
            // let outputFileName = "output" + intermediateString +"."+ fileExtension;
            // console.log("FileName : ", tempFileName);
            // resolve(tempFileName);
            return tempFileName;
        }
        catch (err) {
            // reject(err);
            return null;
        }
        //});
    }

    async MakeDirSync(dir) {
        if (fs.existsSync(dir)) {
            return
        }

        try {
            await fs.mkdirSync(dir)
        } catch (err) {
            if (err.code == 'ENOENT') {
                // myMkdirSync(path.dirname(dir)) //create parent dir
                console.log("No Directory Found")
                //this.MakeDirSync(dir) //create dir
            }
        }

    }

    async CopyFilesAndFolderRecursiveSync(source, target) {
        let files = [];
        try {
            //check if folder needs to be created or integrated
            let targetFolder = path.join(target, path.basename(source));
            let targetFolder1 = targetFolder;
            if (fileio.CheckForGenerateEntityFolder(targetFolder)) {
                targetFolder1 = await fileio.FolderAndFileNameReplacer(targetFolder);
            }

            if (fileio.CheckForPrjectTemplateFolder(targetFolder)) {
                targetFolder1 = await fileio.FolderAndFileNameReplacer(targetFolder);
            }

            if (!fs.existsSync(targetFolder1)) {
                // await fs.mkdirSync(targetFolder1);
                await fileio.MakeDirByPathSync(targetFolder1);
            }

            //copy

            //console.log("IsDirctory:::", source);
            if (fs.lstatSync(source).isDirectory()) {
                files = await fs.readdirSync(source);
                files.forEach(function (file) {
                    // console.log("File:", file, "--- Source::", source);
                    // file = fileio.FolderAndFileNameReplacer(file);
                    //return;
                    let curSource = path.join(source, file);
                    if (fs.lstatSync(curSource).isDirectory()) {
                        fileio.CopyFilesAndFolderRecursiveSync(curSource, targetFolder1);
                    } else {
                        fileio.copyFileSync(curSource, targetFolder1);
                    }
                });
            }
        }
        catch (e) {
            console.log("ERROR", e);
            //return e;
        }
    }

    async GetAllFilesInFolder(source) {
        let files = [];
        if (fs.lstatSync(source).isDirectory()) {
            files = await fs.readdirSync(source);
        }
        else {
            // Something went wrong
        }
        return files;
    }
    async copyFileSync(source, target, entityName) {
        let targetFile = target;

        //console.log("TargetFile:::", targetFile, "++++++++++++++++Source", source);
        //if target is a directory a new file with the same name will be created
        if (fs.existsSync(target)) {
            if (fs.lstatSync(target).isDirectory()) {
                targetFile = path.join(target, path.basename(source));
            }
            //    console.log("FinaltargetFile::", targetFile);
        }

        await fs.writeFileSync(targetFile, await fs.readFileSync(source));
        // console.log("WriteFileDone;;;;;;;;;;;;;;;;;;;;", entityName);
        /// Check for file 
        let fileStr = source.split('.');
        if (fileio.CheckForGenerateEntityFile(targetFile)) {
            // let urlSplit = targetFile.split("\\");
            // console.log("Split::", urlSplit[urlSplit.length - 3]);
            // let entityName = urlSplit[urlSplit.length - 3];
            if (fileStr.length > 0 && entityName != undefined)
                await fileio.RenameFileName(targetFile, entityName);
        }

        return targetFile;
    }


    async MakeDirByPathSync(dirpath) {
        if (!fs.existsSync(dirpath)) {
            //console.log("exists::", fs.existsSync(dirpath));
            shell.mkdir('-p', dirpath);
        }
    }
    async WriteFleContent(content, targetPath, fileName) {
        //let folderCreateStatus = await fileio.MkDirByPathSync(targetPath);
        //console.log("TargetPath:::", targetPath);
        await fileio.MakeDirByPathSync(targetPath);
        let k = await fs.writeFileSync(targetPath + '/' + fileName, content);
        return true;
    }
    FolderAndFileNameReplacer(str, name = 'Product') {
        //console.log("DDD:", str, "Name::", name);
        if (str.match('generated_entity_uiname')) {
            //console.log("Generated entity Folder Found in String : ", str.match('generated_entity_uiname'));
            str = str.replace('generated_entity_uiname', name);
            //console.log("ModifiedString: ", str);
        }

        if (str.match('generate_entity')) {
            //console.log("Generate entity Component Folder Found: ", str.match('generate_entity'));
            str = str.replace('generate_entity', name);
            //console.log("ModifiedString: ", str);
        }
        if (str.match('project_template')) {
            //console.log("Generate entity Component Folder Found: ", str.match('project_template'));
            str = str.replace('project_template', 'product_demo');
            // console.log("ModifiedString: ", str);
        }
        return str;
    }
    CheckForGenerateEntityFolder(str) {
        // console.log("DDD:", str);
        if (str.match('generated_entity_uiname')) {
            return true
        }
        return false;
    }
    CheckForGenerateFolder(str) {
        // console.log("DDD:", str);
        if (str.match('generate_entity')) {
            return true
        }
        return false;
    }
    CheckForPrjectTemplateFolder(str) {
        // console.log("DDD:", str);
        if (str.match('project_template')) {
            return true
        }
        return false;
    }
    CheckForGenerateEntityFile(str) {
        // console.log("DDD:", str);
        if (str.match('generate_entity')) {
            return true
        }
        return false;
    }

    async RenameFileName(str, replacewith = 'product') {
        // console.log("\nRenameString:::->", str);
        let modifiedStr = fileio.FolderAndFileNameReplacer(str, replacewith);
        // console.log("\nRenameMofiedString:::", modifiedStr);
        await fs.renameSync(str, modifiedStr);
        //return modifiedStr;
    }

    CreateZip(source, out) {
        const archive = archiver('zip', { zlib: { level: 9 } });
        const stream = fs.createWriteStream(out);

        return new Promise((resolve, reject) => {
            archive
                .directory(source, false)
                .on('error', err => reject(err))
                .pipe(stream)
                ;

            stream.on('close', () => resolve());
            archive.finalize();
        });
    }
    async RemoveFolderOrFile(targetPath) {
        //await fs.rmdirSync(targetPath);
        if (fs.existsSync(targetPath)) {
            await fs.readdirSync(targetPath).forEach(async (file, index) => {
                const curPath = path.join(targetPath, file);
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    await fileio.RemoveFolderOrFile(curPath);
                } else { // delete file
                    await fs.unlinkSync(curPath);
                }
            });
            await fs.rmdirSync(path);
        }
    }
}

let fileio = new FileIo();
module.exports = fileio;