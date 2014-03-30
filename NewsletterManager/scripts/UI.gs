/**
* Create menu on Spreadsheet
*/
function onOpen() {  
  SpreadsheetApp.getActive().addMenu('Subscription', [ {name: 'Subscribe', functionName: 'main'} ]);
}