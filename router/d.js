var fs = require("fs");

console.log("准备写入文件");
fs.writeFile('../build/assets/css/app/activities/x.html', '我是通过写入的文件内容！',  function(err) {
   if (err) {
       return console.error(err);
   }
   console.log('真的是个大肉包子');
});