/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-26 14:25:15
 * @version $Id$
 */

var getInsertString = function(data) {

    var arry = [];

    for (var item in data) {
        arry.push(item);
    }

    return arry.join(',');
};

module.exports = getInsertString;