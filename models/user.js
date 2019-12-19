/**
 * 用户类
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("user", {
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false, //非空
      autoIncrement: true, //自动递增
      primaryKey: true //主键
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: true
    },
    privilege: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: true
    }
  }, {
    freezeTableName: true,
    timestamps: false, //取消默认生成的createdAt、updatedAt字段
  });
}

// const User = sequelize.define("user", {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false, //非空
//         autoIncrement: true, //自动递增
//         primaryKey: true //主键
//     },
//     username: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     password: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     phoneNumber: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         defaultValue: true
//     },
//     privilege: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         defaultValue: true
//     }
// },{
//     // freezeTableName: true,
//         timestamps: false, //取消默认生成的createdAt、updatedAt字段
// }
// );

// User.sync();

// sequelize.sync().then(function() {
//     return User.create({
//         id:'1',
//         username:'DC',
//         password:'Dengcong1996',
//         privilege:'1'
//     });
// }).then(function(jane) {
//     console.log(jane.get({
//         plain: true
//     }));
// });

// sequelize.authenticate().then(function() {
//     console.log("数据库连接成功");
// }).catch(function(err) {
//     //数据库连接失败时打印输出
//     console.error(err);
//     throw err;
// });

// module.exports = User;