var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var fs = require('fs');
var AipSpeechServer = require('baidu-aip-sdk').speech;

//设置appid/appkey/appsecret
var APP_ID = "8UhnZ1mWzbTmSbhmBqKpnm12";
var SECRET_KEY = "t3TW0zdTqQVMHeLuG7l6jfUQW7aBWiMo";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipSpeechServer(APP_ID, SECRET_KEY);

router.post('/test', function (request, response, next) {
  var form = new Multiparty.Form({uploadDir: './public/audio'});
  //上传完成后处理
  form.parse(request, function (error, fields, files) {
    var filesTemp = JSON.stringify(files, null, 2);
    if (error) {
      console.log('parse error: ' + err);
      response.json({
        ret: -1,
        data: {},
        message: '未知错误'
      });
    } else {
      //console.log('parse files: '+filesTemp);
      var inputFile = files.file[0];
      var uploadedPath = inputFile.path;
      var command = ffmpeg();
      command.addInput(uploadedPath)
      //.saveToFile('./public/audio/222.wav')//保存编码文件到文件夹 --保存成wav是可以的，但是pcm报错
      .saveToFile('./public/audio/16k.wav')
      .on('error', function (err) {
        console.log(err)
      })
      .on('end', function () {
        //调用百度语音合成接口
        var voice = fs.readFileSync('./public/audio/16k.wav');
        var voiceBuffer = new Buffer(voice);
        client.recognize(voiceBuffer, 'wav', 16000).then(function (result) {
          //console.log(result);
          var data = [];
          if (result.err_no === 0) {
            data = result.result;
          }
          response.json({
            ret: result.err_no,
            data: {
              data: data
            },
            message: result.err_msg
          });
        }, function (err) {
          console.log(err);
        });
        //语音识别 end

        //删除上传的临时音频文件
        fs.unlink(uploadedPath, function (err) {
          if (err) {
            console.log(uploadedPath + '文件删除失败');
            console.log(err);
          } else {
            console.log(uploadedPath + '文件删除成功');
          }
        });
        //删除mp3转成wav格式的音频
        fs.unlink('./public/audio/16k.wav', function (err) {
          if (err) {
            console.log('16k.wav文件删除失败');
            console.log(err);
          } else {
            console.log('16k.wav文件删除成功');
          }
        });
      });
    }
  });
});

router.post('/recognition', function (request, response, next) {
  //生成multiparty对象，并配置上传目标路径
  alert(111)
});

module.exports = router;