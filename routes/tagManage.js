var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var {sequelize} = require("../config/db");

var User = sequelize.import("../models/user");
var Notebook = sequelize.import('../models/notebook');
var Page = sequelize.import('../models/page');
var Tag = sequelize.import('../models/tag');

/* GET users listing. */

router.get('/getNotebookByTag', function (request, response, next) {
  let notebookTag = request.query.notebookTag;

  if (notebookTag === "所有") {
    return response.json({
      message: 'success',
      data: request.cookies.notebook
    });
  } else {
    Notebook.findAll({
      where: {
        userID: request.cookies.user.userID,
        tag: notebookTag
      }
    }).then(function (message) {
      let notebookResult = JSON.stringify(message);
      return response.json({
        message: 'success',
        data: JSON.parse(notebookResult)
      });

    });
  }

});

router.get('/getPageByTag', function (request, response, next) {
  let pageTag = request.query.pageTag;

  if (pageTag === "所有") {
    return response.json({
      message: 'success',
      data: request.cookies.pageResultForTag
    });
  } else {
    Page.findAll({
      where: {
        userID: request.cookies.user.userID,
        tag: pageTag
      }
    }).then(function (message) {
      let pageResult = JSON.stringify(message);
      return response.json({
        message: 'success',
        data: JSON.parse(pageResult)
      });

    });
  }

});

router.get('/addNotebookTag', function (request, response, next) {
  var notebookTag = request.query.notebookTag;

  var tag = {
    tagID: "",
    type: "笔记本",
    value: notebookTag,
    userID: request.cookies.user.userID
  };

  Tag.create(tag).then(function (msg) {
    Tag.findAll({
      where: {
        type: "笔记本",
        userID: request.cookies.user.userID

      }
    }).then(function (message) {
      var notebookTagResult = JSON.stringify(message);
      response.cookie('notebookTagResult', JSON.parse(notebookTagResult));
      return response.json({
        message: 'success'
      })
    });
  });

});

router.get('/addPageTag', function (request, response, next) {
  var pageTag = request.query.pageTag;

  var tag = {
    tagID: "",
    type: "笔记",
    value: pageTag,
    userID: request.cookies.user.userID
  };

  Tag.create(tag).then(function (msg) {
    Tag.findAll({
      where: {
        type: "笔记",
        userID: request.cookies.user.userID
      }
    }).then(function (message) {
      var pageTagResult = JSON.stringify(message);
      response.cookie('pageTagResult', JSON.parse(pageTagResult));
      // response.render('index', { title: 'My Note', user: request.cookies.user, note:JSON.parse(notebookResult),pageMenu:request.cookies.pageMenu,pageContent:request.cookies.pageContent });
      return response.json({
        message: 'success'
      })
    });
  });

});

router.get('/showPageContent', function (request, response, next) {
  var pageID = request.query.pageID;
  Page.findOne({
    where: {
      pageID: pageID
    }
  }).then(function (message) {
    var pageResult = JSON.stringify(message);
    pageResult = JSON.parse(pageResult);
    response.cookie('pageContent', pageResult);
    response.json({message: 'success', pageContent: pageResult});
    // response.render('index', { title: 'My Note', user:request.cookies.user, note:request.cookies.notebook, pageMenu:request.cookies.pageMenu,pageContent:pageResult,currentNotebook:request.cookies.currentNotebook});

  });

})

router.get('/getAllPageTag', function (request, response, next) {
  Tag.findAll({
    where: {
      type: "笔记",
      userID: request.cookies.user.userID
    }
  }).then(function (message) {
    var pageTagResult = JSON.stringify(message);
    response.cookie('pageTagResult', JSON.parse(pageTagResult));
    response.json({
      message: 'success',
      data: JSON.parse(pageTagResult)
    });

  });
})

router.get('/modifyPage', function (request, response, next) {

  Page.update({
    title: request.query.title,
    tag: request.query.tag,
  }, {
    where: {
      pageID: request.query.pageID
    }
  }).then(function (message) {
    // var pageResult = JSON.stringify(message);
    var success = message[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
    if (success == true) {
      return response.json({
        message: 'success',
      })
    } else {
      return response.json({
        message: 'error'
      })
    }
  });

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
    var success = message[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
    if (success == true) {
      return response.json({
        message: 'success',
      })
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
    // var pageResult = JSON.stringify(message);
    var success = message[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
    if (success == true) {
      Page.destroy({
        where: {
          notebookID: request.query.notebookID
        }
      }).then(function (message) {
        // var pageResult = JSON.stringify(message);
        var success = message[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
        if (success == true) {
          return response.json({
            message: 'success'
          })
        } else {
          return response.json({
            message: 'error'
          })
        }
      });
    } else {
      return response.json({
        message: 'error'
      })
    }
  });

})

router.get('/deletePage', function (request, response, next) {
  Page.destroy({
    where: {
      pageID: request.query.pageID
    }
  }).then(function (message) {
    // var pageResult = JSON.stringify(message);
    var success = message[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
    if (success == true) {
      return response.json({
        message: 'success'
      })
    } else {
      return response.json({
        message: 'error'
      })
    }
  });

})

router.get('/deletePageTag', function (request, response, next) {
  Tag.destroy({
    where: {
      value: request.query.value,
      type: "笔记"
    }
  }).then(function (message) {
    // var pageResult = JSON.stringify(message);
    var success = message[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
    if (success == true) {
      return response.json({
        message: 'success'
      })
    } else {
      return response.json({
        message: 'error'
      })
    }
  });

})

router.get('/deleteNotebookTag', function (request, response, next) {
  Tag.destroy({
    where: {
      value: request.query.value,
      type: "笔记本"
    }
  }).then(function (message) {
    // var pageResult = JSON.stringify(message);
    var success = message[0] != "0"; //message[0]是影响的行数，为0则修改失败，否则成功
    if (success == true) {
      return response.json({
        message: 'success'
      })
    } else {
      return response.json({
        message: 'error'
      })
    }
  });

})

module.exports = router;
