var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var {sequelize} = require("../config/db");

var User = sequelize.import("../models/user");
var Notebook = sequelize.import('../models/notebook');
var Page = sequelize.import('../models/page');
var Tag = sequelize.import('../models/tag');
var Friends = sequelize.import('../models/friends');
var SharedPage = sequelize.import('../models/sharedPage');

var page = [];
var currentNotebook = {title: '笔记本'};
var currentPage = [];

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//

router.get('/ajax', function (req, res, next) {
  res.render('ajax');
});

router.get('', function (request, response, next) {
  if (request.cookies.user === undefined || request.cookies.user === '') {
    // response.render('404',{message:'请输入用户名和密码'});
    response.redirect('/login');
    return;
  } else {
    response.render('index', {
      title: 'My Note',
      user: request.cookies.user,
      note: [],
      pageMenu: [],
      pageContent: {},
      currentNotebook: currentNotebook
    });
  }
});

router.get('/', function (request, response, next) {
  if (request.cookies.user === undefined || request.cookies.user === '') {
    // response.render('404',{message:'请输入用户名和密码'});
    response.redirect('/login');
    return;
  } else {
    response.render('index', {
      title: 'My Note',
      user: request.cookies.user,
      note: [],
      pageMenu: [],
      pageContent: {},
      currentNotebook: currentNotebook
    });
  }
});

router.get('/index', function (request, response, next) {
  if (request.cookies.username === undefined || request.cookies.username === '') {
    response.render('404', {message: '请输入用户名和密码'});
    response.redirect('/');
    return;
  } else {
    response.render('index', {
      title: 'My Note',
      user: request.cookies.user,
      note: [],
      pageMenu: [],
      pageContent: [],
      currentNotebook: currentNotebook
    });
  }
});

function getPageParentID(sectionID) {
  Page.findAll({
    where: {
      sectionID: sectionID
    }
  }).then(function (message, callback) {
    var returnResult = [];
    var pageResult = JSON.stringify(message);
    pageResult = JSON.parse(pageResult);
    if (pageResult == null) {
      pageResult = {title: '还没有内容呢！', content: '还没有内容呢！快来记录一下吧！'};
    }
  })

}

router.get('/userManage', function (request, response, next) {
  User.findAll({}).then(function (message) {
    var userResult = JSON.stringify(message);
    response.cookie('allUser', JSON.parse(userResult));
    response.render('userManage', {
      title: 'My Note',
      user: request.cookies.user,
      note: request.cookies.notebook,
      users: JSON.parse(userResult)
    });

    // response.cookie('user', user);
    // response.cookie('notebook', JSON.parse(notebookResult));
    // response.render('index', { title: 'My Note', user: user, note:JSON.parse(notebookResult),pageMenu:[],pageContent:[],currentNotebook:[] });

  });
});

router.get('/tagManage', function (request, response, next) {

  Tag.findAll({
    where: {
      type: "笔记本",
      userID: request.cookies.user.userID
    }
  }).then(function (message) {
    var notebookTagResult = JSON.stringify(message);

    response.cookie('notebookTagResult', JSON.parse(notebookTagResult));

    Tag.findAll({
      where: {
        type: "笔记",
        userID: request.cookies.user.userID
      }
    }).then(function (message2) {
      var pageTagResult = JSON.stringify(message2);
      response.cookie('pageTagResult', JSON.parse(pageTagResult));

      Page.findAll({
        where: {
          userID: request.cookies.user.userID
        }
      }).then(function (message3) {
        var pageTagResultForTag = JSON.stringify(message3);
        response.cookie('pageResultForTag', JSON.parse(pageTagResultForTag));

        Notebook.findAll({
          where: {
            userID: request.cookies.user.userID
          }
        }).then(function (message) {
          var notebookResult = JSON.stringify(message);
          // console.log(notebookResult)

          response.cookie('notebook', JSON.parse(notebookResult));
          response.render('tagManage', {
            title: 'My Note',
            user: request.cookies.user,
            note: JSON.parse(notebookResult),
            notebookTags: JSON.parse(notebookTagResult),
            pageTags: JSON.parse(pageTagResult),
            allPages: JSON.parse(pageTagResultForTag)
          });

        });
      });
    });
  });
});

router.get('/myInfo', function (request, response, next) {
  response.render('myInfo', {
    title: 'My Note',
    user: request.cookies.user,
    note: request.cookies.notebook
  });
});

router.get('/myFriends', function (request, response, next) {

  Friends.findAll({
    where: {
      userID: request.cookies.user.userID
    }
  }).then(function (message) {
    var friendsResult = JSON.stringify(message);
    response.cookie('friends', JSON.parse(friendsResult));
    console.log(JSON.parse(friendsResult));
    response.render('friends', {
      title: 'My Note',
      user: request.cookies.user,
      note: request.cookies.notebook,
      allFriends: JSON.parse(friendsResult)
    });

  });

});

router.get('/getAllFriends', function (request, response, next) {

  Friends.findAll({
    where: {
      userID: request.cookies.user.userID
    }
  }).then(function (message) {
    var friendsResult = JSON.stringify(message);
    response.cookie('friends', JSON.parse(friendsResult));
    return response.json({
      message: 'success',
      data: JSON.parse(friendsResult)
    });

  });

});

router.get('/sharePage', function (request, response, next) {

  var userList = request.query.userList;

  for (var i = 0; i < userList.length; i++) {
    var sharedPage = {
      sharedID: "",
      fromUserID: request.cookies.user.userID,
      fromUsername: request.cookies.user.username,
      toUserID: userList[i].friendID,
      toUsername: userList[i].friendUsername,
      title: request.query.title,
      content: request.query.content,
      privilege: request.query.privilege,
      pageID: request.query.pageID,
      thumbs: 0
    };
    SharedPage.create(sharedPage).then(function (msg) {
    });
  }

  return response.json({
    message: "success"
  })

});

router.get('/sharedPage', function (request, response, next) {

  SharedPage.findAll({
    where: {
      toUserID: request.cookies.user.userID
    }
  }).then(function (message) {
    var toMeSharedPageResult = JSON.stringify(message);
    response.cookie('toMeSharedPage', JSON.parse(toMeSharedPageResult));

    SharedPage.findAll({
      where: {
        fromUserID: request.cookies.user.userID
      }
    }).then(function (message) {
      var fromMeSharedPageResult = JSON.stringify(message);
      response.cookie('fromMeSharedPage', JSON.parse(fromMeSharedPageResult));

      response.render('sharedPage', {
        title: 'My Note',
        user: request.cookies.user,
        note: request.cookies.notebook,
        toMeSharedPage: JSON.parse(toMeSharedPageResult),
        fromMeSharedPage: JSON.parse(fromMeSharedPageResult)
      });

    });

  });

});

router.get('/getAllPageTags', function (request, response, next) {

  Tag.findAll({
    where: {
      type: "笔记",
      userID: request.cookies.user.userID
    }
  }).then(function (message) {
    var pageTagResult = JSON.stringify(message);
    return response.json({
      message: 'success',
      data: JSON.parse(pageTagResult)
    });
  });

});

router.get('/getAllNotebookTags', function (request, response, next) {

  Tag.findAll({
    where: {
      type: "笔记本",
      userID: request.cookies.user.userID
    }
  }).then(function (message) {
    var notebookTagResult = JSON.stringify(message);
    return response.json({
      message: 'success',
      data: JSON.parse(notebookTagResult)
    });
  });

});

router.get('/addNotebook', function (request, response, next) {
  let title = request.query.title;
  let tag = request.query.tag;
  let notebook = {
    notebookID: "",
    userID: request.cookies.user.userID,
    title: title,
    tag: tag
  };

  Notebook.create(notebook).then(function (msg) {
    Notebook.findAll({
      where: {
        userID: request.cookies.user.userID
      }
    }).then(function (message) {
      let notebookResult = JSON.stringify(message);
      response.cookie('notebook', JSON.parse(notebookResult));
      return response.json({
        message: 'success'
      })
    });
  });

  //使用id自增，无需找到最大ID然后+1再插入
  // Notebook.find({
  //     where:{
  //         userID:request.cookies.user.userID
  //     },
  //     attributes: [
  //         [sequelize.fn('max', sequelize.col('notebookID')),'maxID']
  //     ]
  // }, {
  //     raw: true
  // }).then(function (message) {
  //     var maxID=JSON.parse(JSON.stringify(message)).maxID;
  //     var thisID = maxID + 1;
  //
  //
  //
  // });

  // Notebook.findAll({
  //     where: {
  //         userID: request.cookies.user.userID
  //     },
  //     order: sequelize.col('notebookID','DESC')
  // }).then(function (message) {
  //     console.log(message)
  // });

  // Notebook.findOne({
  //     order:[
  //         sequelize.fn('max', sequelize.col('notebookID'))
  //     ]
  // }).then(function (message) {
  //     console.log(message);
  // });
})

router.get('/modifyNotebook', function (request, response, next) {

  Notebook.update({
    title: request.query.title,
    tag: request.query.tag,
  }, {
    where: {
      notebookID: request.query.notebookID
    }
  }).then(function (message) {
    // var pageResult = JSON.stringify(message);
    var success = message[0] !== "0"; //message[0]是影响的行数，为0则修改失败，否则成功
    if (success) {
      Notebook.findAll({
        where: {
          userID: request.cookies.user.userID
        }
      }).then(function (message2) {
        var notebookResult = JSON.stringify(message2);
        // console.log(notebookResult)
        response.cookie('notebook', JSON.parse(notebookResult));
        response.render('index', {
          title: 'My Note',
          user: request.cookies.user,
          note: JSON.parse(notebookResult),
          pageMenu: [],
          pageContent: [],
          currentNotebook: []
        });
      });
    } else {
      return response.json({
        message: 'error'
      })
    }
  });

})

router.get('/deleteNotebook', function (request, response, next) {
  Notebook.destroy({
    where: {
      notebookID: request.query.notebookID
    }
  }).then(function (message) {
    let success = message[0] !== "0"; //message[0]是影响的行数，为0则修改失败，否则成功
    if (success) {
      Page.destroy({
        where: {
          notebookID: request.query.notebookID
        }
      }).then(function (message2) {
        Notebook.findAll({
          where: {
            userID: request.cookies.user.userID
          }
        }).then(function (message3) {
          let notebookResult = JSON.stringify(message3);
          response.cookie('notebook', JSON.parse(notebookResult));
          response.render('index', {
            title: 'My Note',
            user: request.cookies.user,
            note: [],
            pageMenu: [],
            pageContent: {},
            currentNotebook: {}
          });
        });
      });
    } else {
      return response.json({
        message: 'error'
      })
    }
  });
});

router.get('/addPage', function (request, response, next) {
  var title = request.query.title;
  var tag = request.query.tag;
  var notebookID = request.query.notebookID;
  var notebookTitle = request.query.notebookTitle;
  var page = {
    pageID: "",
    notebookID: notebookID,
    notebookTitle: notebookTitle,
    title: title,
    tag: tag,
    content: "",
    userID: request.cookies.user.userID
  };

  Page.create(page).then(function (msg) {
    Page.findAll({
      where: {
        notebookID: notebookID

      }
    }).then(function (message) {
      var pageResult = JSON.stringify(message);
      response.cookie('pageMenu', JSON.parse(pageResult));
      // response.render('index', { title: 'My Note', user: request.cookies.user, note:JSON.parse(notebookResult),pageMenu:request.cookies.pageMenu,pageContent:request.cookies.pageContent });
      return response.json({
        message: 'success'
      })
    });
  });

})

router.get('/deletePage', function (request, response, next) {
  Page.destroy({
    where: {
      pageID: request.query.pageID
    }
  }).then(function (message) {
    // var pageResult = JSON.stringify(message);
    let success = message[0] !== "0"; //message[0]是影响的行数，为0则修改失败，否则成功
    if (success) {
      Page.findAll({
        where: {
          notebookID: request.cookies.currentNotebook.notebookID
        }
      }).then(function (message2) {
        let pageResult = JSON.stringify(message2);
        pageResult = JSON.parse(pageResult);
        if (pageResult == null) {
          pageResult = {title: '还没有内容呢！', content: '还没有内容呢！快来记录一下吧！'};
        }
        response.cookie('pageMenu', pageResult);
        response.render('index', {
          title: 'My Note',
          user: request.cookies.user,
          note: request.cookies.notebook,
          pageMenu: pageResult,
          pageContent: {content: '请选择笔记！'},
          currentNotebook: currentNotebook
        });

      });
    } else {
      return response.json({
        message: 'error'
      })
    }
  });

});

router.get('/updatePage', function (request, response, next) {
  var content = request.query.content;
  var notebookID = request.cookies.currentNotebook.notebookID;
  var title = request.query.title;
  var newTitle = request.query.newTitle;
  var pageID = request.query.pageID;

  var page = {
    content: content,
    notebookID: notebookID,
    newTitle: newTitle
  };

  Page.update({
    content: content,
    title: newTitle
  }, {
    where: {
      notebookID: notebookID,
      pageID: pageID,
    }

  }).then(function (message) {
    // var pageResult = JSON.stringify(message);

    let success = message[0] !== "0"; //message[0]是影响的行数，为0则修改失败，否则成功
    if (success) {

      SharedPage.update({
        content: content,
        title: newTitle
      }, {
        where: {
          pageID: pageID,
        }
      }).then(function (message) {
        return response.json({
          message: 'success', page: JSON.parse(JSON.stringify(page))
        })
      });
    } else {
      return response.json({
        message: 'error', page: JSON.parse(JSON.stringify(page))
      })
    }
  })
})

router.get('/showPageMenu/:notebookID', function (request, response, next) {
  var notebookID = request.params.notebookID;
  Notebook.findOne({
    where: {
      notebookID: notebookID
    }
  }).then(function (message) {
    var notebookResult = JSON.stringify(message);
    currentNotebook = JSON.parse(notebookResult);
    response.cookie('currentNotebook', currentNotebook);
    Page.findAll({
      where: {
        notebookID: notebookID
      }
    }).then(function (message) {
      var pageResult = JSON.stringify(message);
      pageResult = JSON.parse(pageResult);
      if (pageResult == null) {
        pageResult = {title: '还没有内容呢！', content: '还没有内容呢！快来记录一下吧！'};
      }
      response.cookie('pageMenu', pageResult);
      // response.json(pageResult);
      response.render('index', {
        title: 'My Note',
        user: request.cookies.user,
        note: request.cookies.notebook,
        pageMenu: pageResult,
        pageContent: {content: '请选择笔记！'},
        currentNotebook: currentNotebook
      });
    });
  })

});

router.get('/showPageContent/:pageID', function (request, response, next) {
  var pageID = request.params.pageID;
  Page.findOne({
    where: {
      pageID: pageID
    }
  }).then(function (message) {
    var pageResult = JSON.stringify(message);
    pageResult = JSON.parse(pageResult);

    if (pageResult == null) {
      pageResult = {title: '还没有内容呢！', content: '还没有内容呢！快来记录一下吧！'};
    }
    response.cookie('pageContent', pageResult);
    response.json({message: 'success', pageContent: pageResult});
  });
});

router.get('/mySearch', function (request, response, next) {
  var input = request.query.input;

  Notebook.findAll({
    where: {
      title: {
        $like: "%" + input + "%"
      }
    }
  }).then(function (message) {
    var result1 = JSON.stringify(message);
    Page.findAll({
      where: {
        title: {
          $like: "%" + input + "%"
        }
      }
    }).then(function (message2) {
      var result2 = JSON.stringify(message2);
      return response.json({
        message: 'success',
        notebookData: JSON.parse(result1),
        pageData: JSON.parse(result2)
      });
    });
  });

})

router.get('/uploader', function (req, res) {

  console.log("sjfklsdjfsdklfjsdlkfj!!!")
  var fs = require('fs');

  fs.readFile(req.files.upload.path, function (err, data) {
    var newPath = __dirname + '/../public/uploads/' + req.files.upload.name;
    fs.writeFile(newPath, data, function (err) {
      if (err) {
        console.log({err: err});
      } else {
        html = "";
        html += "<script type='text/javascript'>";
        html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
        html += "    var url     = \"/uploads/" + req.files.upload.name + "\";";
        html += "    var message = \"Uploaded file successfully\";";
        html += "";
        html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
        html += "</script>";

        res.send(html);
      }
    });
  });
});

module.exports = router;

