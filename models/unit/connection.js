/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-26 14:25:15
 * @version $Id$
 */

var mysql = require('mysql');

var connection = null;

var config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'quick_db'
};

if (connection == null) {
    connection = mysql.createConnection(config);

    connection.connect(function(err) {

        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('mysql connected as id ' + connection.threadId);
    });
}

module.exports = connection;