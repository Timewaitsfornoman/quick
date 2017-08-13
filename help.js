/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-10-14 14:27:38
 * @version $Id$
 */

var fs = require("fs");

console.log("准备写入文件");
fs.writeFile('./build/assets/css/app/activities/' + page_name, '我是通过写入的文件内容！',  function(err) {
   if (err) {
       return console.error(err);
   }
   console.log(‘)
});