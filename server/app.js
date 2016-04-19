var http = require('http');
var fs = require('fs');
var express = require('express');
var __path = '.';
var app = express();
var db = require('./userapi'); // This is done to show the exports feature of ES6

app.use(express.static(db.staticFiles));

app.get('/del', function (req, res) {
   fs.readFile( db.get("emp.json"), 'utf8', function (err, data) {
       users = JSON.parse( data||'{}' );
       var user = users[req.query.id];
	   if(user==null){
			res.send({status:true,msg:'User with id:'+req.query.id+' does not exist'});
			return
	   } 
       delete users[req.query.id];
	   fs.writeFile(db.get("emp.json"),JSON.stringify(users),function(err,dd){
			res.send({status:true,msg:'Delete successful for id:'+req.query.id})
	   });
   });
});
app.get('/save', function (req, res) {
   var k = JSON.parse(req.query.d||'{}');
   fs.readFile(db.get("emp.json"), 'utf8', function (err, data) {
	   users = JSON.parse( data||'{}' );
	   if(users==null)users={};
	   users[k.id] = k;
       fs.writeFile(db.get("emp.json"),JSON.stringify(users),function(err,dd){
			res.send({status:true,msg:'Save successful'})
	   });
   });
});
app.get('/load', function (req, res) {
   fs.readFile(db.get("emp.json"), 'utf8', function (err, data) {
	   users = JSON.parse( data||'{}' );
		var d = [];
		for(var i in users)d.push(users[i]);
		res.send(d);
   });
});
app.get('/',function(req,res){
	res.sendFile(__path+'/files/index.html');
});

var server = app.listen(8081,function(){
	console.log('done');
});