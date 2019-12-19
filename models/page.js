/**
 * 笔记本page类
 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("page", {
    pageID: {
      type: DataTypes.INTEGER,
      allowNull: false, //非空
      autoIncrement: true, //自动递增
      primaryKey: true //主键
    },
    notebookID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notebookTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false, //取消默认生成的createdAt、updatedAt字段
  });
}