import FileIO from '../../../../../pinaka/core/FileIO';

let config = require('../../../../../config');
const fs = require('fs');
//const xml2js = require('xml2js');
//const parser = new xml2js.Parser();
import { CustomError } from '../../../../../pinaka/core/pnkCustomError';
//import { HtmlTemplateManager as htmlDom} from './../../../../pinaka/core/htmltemplatemanager';
let htmlDom = require('../../../../../pinaka/core/htmltemplatemanager.js');

class Test_Html_Form_Ctl {

        

  async  Add(req,res){

        try {
                console.log("hi in application");
                let viewFile = config.ConfigData.RootPath + "application/web/components/testing/views/test_html_form.html";
                // let viewFile = config.ConfigData.RootPath + "application/web/components/login/views/login_view.ejs";
                console.log('sssssssssssssssssssssssssssssss  : '+viewFile);
                //let htmlDom = new HtmlTemplateManager();  

                await htmlDom.Load(viewFile);
                htmlDom.SetValue('d1',"<div>om Namah Shiva</div>");
                htmlDom.SetStyle('d1','color',"blue");
                htmlDom.SetValue('t1',"Jai Mata Di");
                htmlDom.SetValue('p1',"Jai Mata Di jai bholenath");
                htmlDom.SetValue('rl1',"Female");
                htmlDom.SetValue('cl1',"Swimming");
                htmlDom.SetValue('img1',"http://finelogics.com/logo.png");
                htmlDom.SetValue('spn1',"Jai Ganesha");
                htmlDom.SetValue('txtAr1',"asdfsafsfsgsggdg gvdfsgdhdhdhshshfh gdhdhdhdhdh gvxgbdhdhdhh");
                htmlDom.SetValue('h1',"Jai Mata Di");
                htmlDom.SetValue('sel1',"M.P.");
                ////////////////htmlDom.SetValue('t1',"Jai Mata Di");
                /////////////htmlDom.SetValue('tb1',"<tr><td>Ashu><td>47</td></tr><tr><td>Sani</td><td>28</td><td>Kailash</td><td>26</td><</tr>");

                

                ///////////////htmlDom.SetValue("s1","alert('bye'); function checkme(){ alert('downMe');}");
                htmlDom.SetValue('sel1',"R.P.");

                htmlDom.AddHtmlToResponse("<div id='d5' > Jai Maata Di<script>function a(){alert('bye')}</script></div>");
                htmlDom.AddScriptToResponse("alert('bye');");
                //////////////////htmlDom.AddScriptToInitResponse("alert('bye');");



               htmlDom.AddScriptToResponse("function checkme(){ alert('downMe');}");

              
              ///////////////////////htmlDom.Remove("d1");
              


                res.send(htmlDom.ToString());
                htmlDom.Close();


                ///////////////////res.send('hi');






            }
        catch (e)
            {
                
                CustomError.PassErrorToParentHandler(e,"htmltemplateloading","template LOading Error","");
                console.log('bye');

            }

    
    
    }
}

let test_html_form_Ctl = new Test_Html_Form_Ctl();
module.exports = test_html_form_Ctl;