const http = require('http');
const electron = require('electron');
const url = require('url');
const path = require('path');
const request = require('request');

// Rest Client to call Bot Brain API
var Client = require('node-rest-client').Client;
var client = new Client();

//initializing Electron App and supporting components.
const {app, BrowserWindow, ipcMain, Menu} = electron;

let mainWindow;

// load the app and html content in browser window
app.on('ready',function(){
  mainWindow = new BrowserWindow({});
    mainWindow.setMaximizable(false);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(url.format({
    pathname:path.join(__dirname,'index.html'),
    protocol:'file',
    slashes:true
  }));  

});

//receive the message from user and respond
ipcMain.on('user:message', function(e, usermessage){
    //var conversation;
    var userRequest = new Object();
    userRequest.question = usermessage;

    var args = {
      data: JSON.stringify(userRequest),
      headers: { "Content-Type": "application/json" }
      };

    client.post("https://chatbot-api.cfapps.io/api/v1/answerme", args, function (data, response) {
          var body = JSON.stringify(data);
          var conversation = JSON.parse(body); 
          mainWindow.webContents.send('bot:answer',conversation.answer);   
    return;

  });
  
  
})




// To call REST APIs

//var options='http://jsonplaceholder.typicode.com/posts/1';


// var response= getJson(options, function(err,result){
//     if(err){console.log(err);}
//     //console.log(result.id);
//   });



function getJson(options, cb){
http.request(options,function(res){
  var body='';
  res.on('data',function(chunk){
    body+=chunk;
  });
  res.on('end', function(){
    var result =JSON.parse(body);
    cb(null,result);
  })
  res.on('error',cb);

})
.on('error',cb)
.end();
}