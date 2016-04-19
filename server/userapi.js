exports.staticFiles = './files';

var dbPath = './db'
exports.get = function(file){
	return dbPath + '/' + file;
};