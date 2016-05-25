# Google Analytics script to convert Capriza user ids to emails

We send to Google Analytics user ids (integer number). We cannot send email addresses both due to Google ToS
and for security and privacy concerns of our customers.
This script runs in your browser, identifying user ids and replaces it with email addresses fetched from Capriza manage. This
happens in the browser, so no customer personal data is exposed.

### Installation
1. Open the [installation page](http://capriza.github.io/google-analytics-bookmarklet/index.html)
1. Drag the link to your browser's bookmarks bar.

### Usage
1. Make sure you are logged in to [Capriza Manage](https://manage.prod.capriza.com). Note that manage VPN is required.
1. Open [Google Analytics](https://analytics.google.com/analytics/web/).
1. Click the bookmark.
1. The script continuously monitors the page, replacing user ids with email addresses.
 
