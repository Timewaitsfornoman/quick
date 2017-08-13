/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-26 14:25:15
 * @version $Id$
 */

var getUpdateString = function(data) {

    var arry = [];

    for (var item in data) {
    	if(Number(+data[item])){
    		arry.push(item + "=" + data[item]);
    	}else{
    		arry.push(item + "= '" + data[item] + "'");
    	}
    }

    return arry.join(',');
};

module.exports = getUpdateString;