var express = require('express');
var nunjucks = require('nunjucks');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

nunjucks.configure('views', {
   autoescape: true,
   express: app
});


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){

	
	url = 'http://www.vocativ.com/html-sitemap/news/';
	request(url, function(error, response, html){

		var articles = {};
		var index = 0;
		var $ = cheerio.load(html);
		$(' article ul a ').not($('.pager li a')).each(function(){
			url = 'http://vocativ.com'+$(this).attr('href');
			request(url, function(error, response, html){
				if(!error){

					var $ = cheerio.load(html);
					var article = $('article');
					var headline = article.find('h1').text();
					var allContent = "";
					article.find('p').each(function(){
						allContent= allContent+" "+$(this).text();
					});

					articleJSON = {headline:headline, content:allContent};
					articles[index] = articleJSON;
					index++;
					
				}
				fs.writeFile('public/articles.json', JSON.stringify(articles, null, 4));
			});

		})
		res.render('index.html');

			
	});
})


app.listen('8000')
//console.log('Magic happens on port 8000');
exports = module.exports = app; 