/**
 * 用户类
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("friends", {
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false, //非空
      autoIncrement: true, //自动递增
      primaryKey: true //主键
    },
    friendID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    friendUsername: {
      type: DataTypes.STRING,
      allowNull: false
    },
    friendEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    friendPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: true
    }
  }, {
    freezeTableName: true,
    timestamps: false, //取消默认生成的createdAt、updatedAt字段
  });
}
