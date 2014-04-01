/**
 * Creates a new EmailManager.
 * @constructor
 * @param {string} spreadsheetId
 * @param {string} sheetName
 */
var EmailManager = function(spreadsheetId, sheetName) {

	this._spreadsheet = SpreadsheetApp.openById(spreadsheetId);
	if (!this._spreadsheet) {
		throw "Spreedsheet with ID: " + EmailManager.SPREADSHEET_ID + " not found."
	}

	this._sheet = this._spreadsheet.getSheetByName( sheetName );
	if (!this._sheet) {
		throw "The sheet with the name " +  sheetName + " not found.";      
	}
        
    // no data
    if( EmailManager.FIRST_ROW > this._sheet.getLastRow() ){
       throw "There is no data."; 
    }
    
	this._data = this._sheet.getRange(EmailManager.FIRST_ROW, EmailManager.FIRST_COLUMN, this._getDataLastRow(), this._sheet.getLastColumn()).getValues();
}

/**
* Send a email
* @param {string} to - email address
* @param {string} subject
* @param {string} body - htmlBody
* @param {Array} attachments - an array of files to send with the email
*
* @example
* 	var file = DriveApp.getFileById('1234567890abcdefghijklmnopqrstuvwxyz');
*   var blob = Utilities.newBlob('Insert any HTML content here', 'text/html', 'my_document.html');
* 	manager.sendEmail("tomas@kibo.cz", "subject", "text", [file, blob]);
*
* @see https://developers.google.com/apps-script/reference/mail/mail-app#sendEmail(String,String,String,Object)
*/
EmailManager.prototype.sendEmail = function(to, subject, body, attachments) {

	var email = {}
	email.to = to;
	email.subject = subject;
	email.htmlBody = body;
	if (attachments) {
		email.attachments = attachments;
	}

	MailApp.sendEmail(email);
}
/**
 * Get data for sending
 * @param {?number} maxRows
 * @return {Array<Object>} [{'id':1,'email':'abc@gmail.com', ...}, {'id':2,'email':'def@gmail.com', ...}]
 */
EmailManager.prototype.getData = function( maxRows ) {

	var maxRows = (maxRows && maxRows < EmailManager.MAX_ROWS) ? maxRows : EmailManager.MAX_ROWS;	      
	var data = [];

	for (var i = 0, max = this._data.length; i < max; ++i) {
		var object = this._getObjectFromArrays(EmailManager.HEADER, this._data[i]);
		if ( this._isDataValid( object ) 
        && object.isSend === 0 
        && object.hasError === 0 
        && object.isUnsubscribe === 0) {			
          data.push(object);
			
          if (maxRows <= data.length) {
            break;
			//=======>
          }
		}
	}

	return data;
}

/**
 * Update row in spreadsheet
 * @param {Object} data
 */
EmailManager.prototype.update = function( data ){
	if( this._isDataValid(data) ){                  
		var range = this._sheet.getRange( this.getRowNumberByEmail(data.email), EmailManager.FIRST_COLUMN, 1, EmailManager.HEADER.length);        
        range.setValues( [ this._getArrayFromObject(data) ]);                
	}
}

/**
 * Create a new row in spreadsheet
 * @param {Object} data
 */
EmailManager.prototype.create = function( data ){ 

  var obj = this.findRowByEmail( data.email )
  if( obj && typeof obj.isUnsubscribe != 'undefined' ){
    // email is already in the sheet
    obj.isUnsubscribe = 0; 
    this.update(obj);
    return; 
  }

  Logger.log("Create new row " + data.email);  
  var range = this._sheet.getRange( this._sheet.getLastRow() + 1, EmailManager.FIRST_COLUMN, 1, EmailManager.HEADER.length); 
  range.setValues( [ [data.email, 0, 0, 0] ]);
}

/**
 * Set 'isSend' column to default values
 */
EmailManager.prototype.reset = function(){
  
  if( EmailManager.HEADER.indexOf('isSend') == -1 ){
    return;
  }
     
  // Select 'isSend' column
  var range = this._sheet.getRange( EmailManager.FIRST_ROW, EmailManager.HEADER.indexOf('isSend') + 1, this._sheet.getLastRow() - 1, 1);
  range.setValue(0);
}

/**
* Find number of row by email
* @param {string} email
* @return {number}
*/
EmailManager.prototype.getRowNumberByEmail = function( email ){

 for(var idx = 0, max = this._data.length; idx < max; idx++ ){      
    var obj = this._getObjectFromArrays(EmailManager.HEADER, this._data[idx]);  
    if( obj.email === email){     
      return idx + EmailManager.FIRST_ROW;
      break;
    }  
  }  
  Logger.log("Can not find row with Email: " + email); 
}

/**
* Find row by email
* @param {string} email
* @return {Object}
*/
EmailManager.prototype.findRowByEmail = function( email ){

 for(var idx = 0, max = this._data.length; idx < max; idx++ ){      
    var obj = this._getObjectFromArrays(EmailManager.HEADER, this._data[idx]);  
    if( obj.email === email){     
      return obj
      break;
    }  
  }  
  Logger.log("Can not find row with Email: " + email); 
}

/**
* Get unsubscribe url
* Params are encoded with Base64
* @param {string} email
* @return {string}
*/
EmailManager.prototype.getUnsubscribeUrl = function( email ){
  return ScriptApp.getService().getUrl() + "?action=" + EmailManager.UNSUBSCRIBE + "&" + EmailManager.PARAM_NAME + "=" + Utilities.base64Encode( JSON.stringify({"email":email, "sheet":this._sheet.getName()}), Utilities.Charset.UTF_8);  
}

/**
* Decode token encoded as Base64
* @static
* @param {string} encodedToken
* @return {object}
*/
EmailManager.decodeToken = function( encodedToken ){
   var decoded = Utilities.base64Decode( encodedToken, Utilities.Charset.UTF_8);      
   return JSON.parse( Utilities.newBlob(decoded).getDataAsString() );    
}

/*
 * Get object from array
 * @private
 * @param {Array} keys
 * @param {Array} data
 * @return {Object}
 */
EmailManager.prototype._getObjectFromArrays = function(keys, data) {
	var object = {};
	for (var j = 0, max = keys.length; j < max; ++j) {
		object[keys[j]] = data[j];
	}

	return object;
}

/**
* Get array from object values
* @private
* @param {Object} obj
* @return {array}
*/
EmailManager.prototype._getArrayFromObject = function( obj ){
  var arr = []
  for (var prop in obj) {
    arr.push( obj[prop] );
  } 
  return arr;
}

/**
 * Verifies data object
 * @private
 * @param {Object} data
 * @return {boolean}
 */
EmailManager.prototype._isDataValid = function( data ){	
	for( var i = 0; i < EmailManager.HEADER.length; ++i ){                            
		if( typeof data[ EmailManager.HEADER[i] ] === 'undefined' 
        || data[ EmailManager.HEADER[i] ] === null 
        || ( typeof data[ EmailManager.HEADER[i] ] === 'string' && data[ EmailManager.HEADER[i] ].length === 0 ) ){
            Logger.log("Validation error: #" + data.id);
			return false;
		}
	}
	
	return true;
}

/*
 * Get last row in sheet without header of table
 * @private
 * @return {number}
 */
EmailManager.prototype._getDataLastRow = function() {
	return this._sheet.getLastRow() - (EmailManager.FIRST_ROW - 1 )
}

/**
 * Max count of rows for sending email
 * Google gmail daily quota
 * @constant
 * @type {number}
 * @dafault
 */
EmailManager.MAX_ROWS = MailApp.getRemainingDailyQuota();

/**
 * Columns name map
 * @constant
 * @type {Object}
 */
EmailManager.HEADER = ['email', 'isSend', 'isUnsubscribe', 'hasError']

/**
 * Line of first row of data
 * @constant
 * @type {number}
 */
EmailManager.FIRST_ROW = 2

/**
 * Line of first data column
 * @constant
 * @type {number}
 */
EmailManager.FIRST_COLUMN = 1

/**
 * Unsubscribe action
 * @constant
 * @type {string}
 */
EmailManager.UNSUBSCRIBE = "unsubscribe"

/**
 * Subscribe action
 * @constant
 * @type {string}
 */
EmailManager.SUBSCRIBE = "subscribe"

/**
 * Param name
 * @constant
 * @type {string}
 */
EmailManager.PARAM_NAME = "p_token"

/**
 * Admin email
 * @constant
 * @type {string}
 */
EmailManager.ADMIN_EMAIL = "tomasjurman@gmail.com"

/**
 * Google Spreadsheet id
 * @constant
 * @type {string}
 */
EmailManager.SPREADSHEET_ID = "0Au095ikOvxFidGhZTEdDeTBTVUhhT3lCSmNwUVFHTkE"