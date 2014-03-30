/**
* Run this function if you want to see a message to the customer.
*
* press SPACE + ENTER
*/
function showMessageForCustomer(){  
  Logger.log(fillInTemplateFromObject( HtmlService.createTemplateFromFile( CUSTOMER_HTML_TEMPLATE_NAME ).evaluate().getContent(), getDataFromLastRow()));
}

/**
* Run this function if you want to see a message to the admin.
*
* press SPACE + ENTER
*/
function showMessageForAdmin(){  
  Logger.log(fillInTemplateFromObject( HtmlService.createTemplateFromFile( ADMIN_HTML_TEMPLATE_NAME ).evaluate().getContent(), getDataFromLastRow()));
}

/**
* Run this function to run all tests.
*/
function startAllTests(){ 
  testGetObjectFromArrays();
  testNormalizeHeader();
  testFillInTemplateFromObject();
  testIsCellEmpty();
  testIsAlnum();
  testIsDigit();
}

function testNormalizeHeader(){  
  assertEqual("a", normalizeHeader("a"));
  assertEqual("aBCD", normalizeHeader("a b c d"));  
}

function testGetObjectFromArrays(){
  var keys = ["a", "a b c d"];
  var data = ["1", "1 2 3 4"];
  
  var obj = getObjectFromArrays( keys, data );
  
  assertEqual(obj["a"], "1");
  assertEqual(obj["aBCD"], "1 2 3 4");  
}

function testFillInTemplateFromObject(){
  var data = {aBCD:"a b c"};
  var template = '<html><body><h3>Hello ${"a b c d"}</h3></body></html>'
    
  assertEqual('<html><body><h3>Hello a b c</h3></body></html>', fillInTemplateFromObject(template, data));  
}

function testIsCellEmpty(){  
  assertTrue( isCellEmpty("")); 
  assertFalse( isCellEmpty("a b c"));
  assertFalse( isCellEmpty(1));  
}

function testIsAlnum(){
  assertTrue(  isAlnum("A")); 
  assertTrue( isAlnum("123"));
  assertFalse( isAlnum(" "));
  assertFalse( isAlnum("#")); 
}

function testIsDigit(){
  assertTrue( isDigit(1)); 
  assertTrue( isDigit("123"));
  assertFalse(isDigit(" "));
}

// -- TEST HELPER -----------------------
function assertTrue(expression){
  if(true != expression){
    throw("Not true");
  }
}

function assertFalse(expression){
  if(false != expression){
    throw("Not false");
  }
}

function assertEqual(expectedValue,actualValue){
  if(actualValue != expectedValue){
        throw("Expected : " + expectedValue + " / Actual : "+ actualValue);
    }
}
