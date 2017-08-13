/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-26 14:25:15
 * @version $Id$
 */

var getString = function(data) {

    var arry = [];

    for (var item in data) {
        arry.push('"' + data[item] + '"');
    }

    return arry.join(',');
};

module.exports = getString;