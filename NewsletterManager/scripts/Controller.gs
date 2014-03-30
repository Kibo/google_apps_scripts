function doGet(e) {
	var template;

	if (!e.parameter[EmailManager.PARAM_NAME]) {
		template = HtmlService.createTemplateFromFile('error');
		template.errorMessage = "Bad URL parameters.";
		return template.evaluate();
	}

	var params = EmailManager.decodeToken(e.parameter[EmailManager.PARAM_NAME]);

	switch (params.action) {

		case EmailManager.UNSUBSCRIBE:
			unsubscribeAction(params);
			template = HtmlService.createTemplateFromFile(EmailManager.UNSUBSCRIBE);
			template.email = params.email;
			return template.evaluate();
			break;

		default:
			template = HtmlService.createTemplateFromFile('error');
			template.errorMessage = "Unknown action.";
			return template.evaluate();
	}
};

function doPost(e){
  //TODO
  // subscribe new email
};

/**
 * Unsubscribe action
 * @param {Object} params
 */
function unsubscribeAction(params) {
	var manager = new EmailManager(EmailManager.SPREADSHEET_ID, params.sheet);
	var obj = manager.findRowByEmail(params.email);
	obj.isUnsubscribe = 1;
	manager.update(obj);
}

