/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-28 16:07:57
 * @version $Id$
 */

var getString = require('./unit/readyData');
var connection = require('./unit/connection');

var userModels = {

    getTempList: function(type, callback) {
        var queryString = 'select * from templates where type = "' + type + '"';
        connection.query(queryString, callback);
    },

    addTemplate: function(data, callback) {
        var string = getString(data);
        var queryString = 'insert into templates (username,password) values(' + string + ')';
        connection.query(queryString, callback);
    },

    deleteTemplate: function(id, callback) {
        var queryString = 'delete from templates where id = "' + id + '"';
        connection.query(queryString, callback);
    },

    updatesTemplate: function(data) {
        var queryString = 'update templates set js=' + data.js + 'where id =' + data.id;
        connection.query(queryString, function(err, rows, fields) {
            callback(err, rows, fields);
            if (err) {
                throw err;
            }
            if (rows) {
                for (var i = 0; i < rows.length; i++) {
                    console.log("%d\t%s\t%s", rows[i].id, rows[i].username, rows[i].password);
                }
            }
        });
    }
};

// connection.end();

module.exports = userModels