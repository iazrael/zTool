//**********************************************
// 使用 nodejs 进行合并
//**********************************************

var OUTPUT_FILE_NAME = 'ztool.all.js';
var ROOT = './';
var IGNORE_FILE_LIST = [
    'build.js',
    OUTPUT_FILE_NAME
];

//**********************************************
// 以上是配置
//**********************************************

var fs = require('fs');
var path = require('path');

var fileList = fs.readdirSync(ROOT);
var data = '', fileName;
for(var i in fileList){
    fileName = fileList[i];
    if(/.*\.js/.test(fileName) && IGNORE_FILE_LIST.indexOf(fileName) == -1){
        console.log('-' + fileName);
        data += fs.readFileSync(fileName, 'utf8');
    }
}

//write it
fs.writeFileSync(OUTPUT_FILE_NAME, data, 'utf8');

console.log('success');











