var http = require('http');
var fs = require('fs');
var express = require('express');
var __path = '/Users/Dammy/server';
var app = express();

app.use(express.static(__path+'/files'));

app.get('/del', function (req, res) {
   fs.readFile( __path + "/files/" + "users.json", 'utf8', function (err, data) {
       users = JSON.parse( data||'{}' );
       var user = users[req.query.id];
	   if(user==null){
			res.send({status:true,msg:'User with id:'+req.query.id+' does not exist'});
			console.log( user );
			return
	   }
       console.log( user );
       delete users[req.query.id];
	   fs.writeFile(__path + "/files/" + "emp.json",JSON.stringify(users),function(err,dd){
			res.send({status:true,msg:'Delete successful for id:'+req.query.id})
	   });
   });
});
app.get('/save', function (req, res) {
   var k = JSON.parse(req.query.d||'{}');
   fs.readFile( __path + "/files/" + "emp.json", 'utf8', function (err, data) {
	   users = JSON.parse( data||'{}' );
	   if(users==null)users={};
	   users[k.id] = k;
       fs.writeFile(__path + "/files/" + "emp.json",JSON.stringify(users),function(err,dd){
			res.send({status:true,msg:'Save successful'})
	   });
   });
});
app.get('/load', function (req, res) {
   fs.readFile( __path + "/files/" + "emp.json", 'utf8', function (err, data) {
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