/**
 * 分享笔记类
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("sharedPage", {
    sharedID: {
      type: DataTypes.INTEGER,
      allowNull: false, //非空
      autoIncrement: true, //自动递增
      primaryKey: true //主键
    },
    fromUserID: {
      type: DataTypes.INTEGER,
      allowNull: false, //非空

    },
    fromUsername: {
      type: DataTypes.STRING,
      allowNull: false, //非空

    },
    toUserID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    toUsername: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: true
    },
    privilege: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pageID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    thumbs: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    timestamps: false, //取消默认生成的createdAt、updatedAt字段
  });
}
