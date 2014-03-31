/**
* Create menu on Spreadsheet
*/
function onOpen() {  
  SpreadsheetApp.getActive().addMenu('Subscription', [ {name: 'Publish', functionName: 'publish'}, {name: 'Reset', functionName: 'reset'}  ]);
}
