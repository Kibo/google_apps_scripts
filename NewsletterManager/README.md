# Newsletter manager
* Publish newsletter
* Subscribe a new email
* Unsubscribe email from the mailing list

## Setting
1. Create new Spreadsheet (Data source)
2. Tools > Script editor ...
3. Set EmailManager.ADMIN_EMAIL
4. Set EmailManager.SPREADSHEET_ID
5. Create template for newsletter (newsletter.html)
6. Publish > Deploy as web app ...

### Screen from Data source
![newsletter](https://raw.githubusercontent.com/Kibo/google_apps_scripts/master/screens/newsletter.png)

### Newsletter template
For good work use:
* http://htmlemailboilerplate.com/
* http://zurb.com/ink/

Be sure to insert a unsubscribe link. 
```html
<h3>Hello world</h3>
<p>
	<a href="<?= unsubscribeUrl ?>">Unsubscribe</a>
</p>
```

### Subscribe
This form place in your web page. Newsletter Service can manage many of your projects.
```html
<h3>Subscribe to the newsletter</h3>
<form action="https://script.google.com/YOUR_SCRIPT_URL" method="post" >
	<label>Email</label>
	<input type="text" name="email" >				

	<input type="hidden" name="action" value="subscribe">
	<input type="hidden" name="sheet" value="test_data_2">
	<input type="hidden" name="backUrl" value="http://www.YOUR_WEB.cz/">	
	
	<input type="submit" value="subscribe">					
</form>
```

![Subscribe](https://raw.githubusercontent.com/Kibo/google_apps_scripts/master/screens/subscribe_screen.png)

### Resources
- [Newsletter service with Google Apps Script](#)

###Recommendation
I was inspired by a great book (Google Apps Script for Beginners)[http://bit.ly/OBwIqz]<br>
[![Google Apps Script for Beginners](http://dgdsbygo8mp3h.cloudfront.net/sites/default/files/imagecache/productview_larger/2177OT_Google%20Apps.jpg)](http://bit.ly/OBwIqz)
The book contains:
- Spreadsheet automation
- Manipulate Forms
- Managing Email Account
- Script in text document
- Standalone Web application
