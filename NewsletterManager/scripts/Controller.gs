function doGet(e) {
    var template;

	switch (e.parameter.action) {

		case EmailManager.UNSUBSCRIBE:
            var params = EmailManager.decodeToken(e.parameter[EmailManager.PARAM_NAME]);
			unsubscribeAction(params);
			template = HtmlService.createTemplateFromFile(EmailManager.UNSUBSCRIBE);
			template.email = params.email;
			return template.evaluate().setTitle( EmailManager.UNSUBSCRIBE ).setSandboxMode(HtmlService.SandboxMode.NATIVE);
			break;

		default:
			template = HtmlService.createTemplateFromFile('error');
			template.errorMessage = "Unknown action."
			return template.evaluate().setTitle( "Error" ).setSandboxMode(HtmlService.SandboxMode.NATIVE);
	}
}

function doPost(e){
  var template;
    
    switch (e.parameter.action) {
    
		case EmailManager.SUBSCRIBE:                         
            subscribeAction({"email":e.parameter.email, "sheet": e.parameter.sheet});
            template = HtmlService.createTemplateFromFile( EmailManager.SUBSCRIBE );            
            template.email = e.parameter.email;
            template.backUrl = e.parameter.backUrl;
			return template.evaluate().setTitle( EmailManager.SUBSCRIBE ).setSandboxMode(HtmlService.SandboxMode.NATIVE);
			break;

		default:
			template = HtmlService.createTemplateFromFile('error');
			template.errorMessage = "Unknown action."
			return template.evaluate().setTitle( "Error" ).setSandboxMode(HtmlService.SandboxMode.NATIVE);
	}
}

/**
 * Unsubscribe action
 * @param {Object} params
 */
function unsubscribeAction(params) {
    if(!params.email || !params.sheet){
      Logger.log("Missing parameters: " + params);
      return;
    }
    
	var manager = new EmailManager(EmailManager.SPREADSHEET_ID, params.sheet);
	var obj = manager.findRowByEmail(params.email);
	obj.isUnsubscribe = 1
	manager.update(obj);
}

/**
 * Subscribe action
 * @param {Object} params
 */
function subscribeAction(params) {
    if(!params.email || !params.sheet){
      Logger.log("Missing parameters: " + params);
      return;
    }

	var manager = new EmailManager(EmailManager.SPREADSHEET_ID, params.sheet);	
	manager.create( params );
}




