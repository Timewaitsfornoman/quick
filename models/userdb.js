/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-26 13:31:46
 * @version $Id$
 */

var getString = require('./unit/readyData');
var connection = require('./unit/connection');

var userModels = {

    regist: function(data,callback) {

        var string = getString(data);
        console.log(string);
        var queryString = 'insert into user (username,password) values(' + string + ')';
        connection.query(queryString, callback);
    },

    login: function(data,callback) {
        var queryString = 'select * from user where username = "' + data.username + '"';
        connection.query(queryString,callback);
    },



    updatePassword: function(data) {
        var queryString = 'update user set password = "' + data.password + '"where username = "' + data.username + '"';
        connection.query(queryString, function(err, rows, fields) {
            callback(err,rows,fields);
            if (err) {
                throw err;
            }
            if (rows) {
                for (var i = 0; i < rows.length; i++) {
                    console.log("%d\t%s\t%s", rows[i].id, rows[i].username, rows[i].password);
                }
            }
        });
    },

    index: function(id,callback){
        var queryString = 'select * from pages where user_id =' + id;
        connection.query(queryString,callback);
    }
};

// connection.end();

module.exports = userModels

