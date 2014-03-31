var EMAIL_SUBJECT = "Newsletter"
var TEMPLATE_NAME = "newsletter.html"

/**
* Publish newsletter
*/
function publish() {  
   Logger.clear();
   var manager = new EmailManager( EmailManager.SPREADSHEET_ID, SpreadsheetApp.getActive().getActiveSheet().getName() );
      
   var data = manager.getData();
             
   // Send emails
   for(var i = 0, max = data.length; i < max; ++i){       
     var template = HtmlService.createTemplateFromFile( TEMPLATE_NAME );     
     template.email = data[i].email
     template.unsubscribeUrl = manager.getUnsubscribeUrl( data[i].email );          
       
     try{       
       manager.sendEmail( data[i].email, EMAIL_SUBJECT, template.evaluate().getContent()); 
       data[i].isSend = 1;
       
     }catch(e){
       data[i].hasError = 1;       
       Logger.log( "Sending email error. Record #" + data[i].id + ", " + data[i].email );    
     }                       
     
     manager.update( data[i] );               
   }
      
   // send stats
   Logger.log("Sheet: " + SpreadsheetApp.getActive().getActiveSheet().getName() );
   Logger.log("Count of rows: " + data.length);
   manager.sendEmail( EmailManager.ADMIN_EMAIL, "Admin log", "<pre>" + Logger.getLog() + "</pre>");      
}

/**
* Reset data to default values
*/
function reset(){
  var manager = new EmailManager( EmailManager.SPREADSHEET_ID, SpreadsheetApp.getActive().getActiveSheet().getName() );
  manager.reset();
}

