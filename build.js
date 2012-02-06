//**********************************************
// 使用 nodejs 进行合并
//**********************************************

var OUTPUT_FILE_NAME = '../ztool.all.js';
var ROOT = './';
var IGNORE_FILE_LIST = [
    'build.js',
    OUTPUT_FILE_NAME
];
var COMBINE_FILE_LIST = [
    'z.core.js',
    'z.base.js',
    'z.class.js',
    'z.array.js',
    'z.browser.js',
    'z.delay.js',
    'z.dom.js',
    'z.json.js',
    'z.message.js',
    'z.string.js',
    'z.timetaken.js',
    'z.beater.js',
    'z.util.js'
];

//**********************************************
// 以上是配置
//**********************************************

var fs = require('fs');
var path = require('path');

var fileList = COMBINE_FILE_LIST;//fs.readdirSync(ROOT);
var data = '', fileName;
for(var i in fileList){
    fileName = fileList[i];
    if(/.*\.js/.test(fileName) && IGNORE_FILE_LIST.indexOf(fileName) == -1){
        data += fs.readFileSync(fileName, 'utf8') + '\n';
    }
}

//write it
fs.writeFileSync(OUTPUT_FILE_NAME, data, 'utf8');

console.log('done');











