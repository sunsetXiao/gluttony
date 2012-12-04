var config = require('../config')
  , mongo = require('mongoskin')
  , db = mongo.db(config.db.url, {safe:true})
  , ObjectID = mongo.ObjectID
  , async = require('async');


var FileHandler = exports.FileHandler = function(){};

FileHandler.prototype.save = function(fileData, callback){
  db.gridfs().open(new ObjectID(), 'w', {metadata: { create_at: new Date() }}, function(err, gs){
    gs.write(fileData, function(err, storedFile){
      gs.close(function(err, storedFile){
        if (err) throw err;
        callback(err, storedFile._id);
      });
    });
  });
}

FileHandler.prototype.saveFromFile = function(filePath, callback){
  db.gridfs().open(new ObjectID(), 'w', {metadata: { create_at: new Date() }}, function(err, gs){
    gs.writeFile(filePath, function(err, storedFile){
      gs.close(function(err, storedFile){
        if (err) throw err;
        callback(err, storedFile._id);
      });
    });
  });
}

FileHandler.prototype.getByIdStr = function(fileIdStr, callback) {
  db.gridfs().open(new ObjectID(fileIdStr), 'r', function(err, gs){
    gs.read(function(err, fileData){
      callback(err, fileData);
    })
  });
}