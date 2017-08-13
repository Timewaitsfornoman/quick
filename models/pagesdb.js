/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-28 16:07:57
 * @version $Id$
 */

var getString = require('./unit/readyData');
var getInsertString = require('./unit/insertString');
var getUpdateString = require('./unit/updateString');
var connection = require('./unit/connection');

var userModels = {

    index: function(id, callback) {
        var queryString = 'select * from pages where user_id = "' + id + '"';
        connection.query(queryString, callback);
    },

    addPages: function(data, callback) {
        var string = getString(data);
        var insertString = getInsertString(data);
        var queryString = 'insert into pages (' + insertString + ') values(' + string + ')';
        connection.query(queryString, callback);
    },

    deletePage: function(id, callback) {
        var queryString = 'delete from pages where id = "' + id + '"';
        connection.query(queryString, callback);
    },

    updatePages: function(data,callback) {
        var id = Number(data.id);
        data.id && delete data.id;
        var updateString = getUpdateString(data);
        var queryString = 'update pages set ' + updateString + ' where id = ' + id;
        connection.query(queryString,callback);
    }
};

// connection.end();
module.exports = userModels