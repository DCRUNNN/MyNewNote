/**
 * 标签类
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define("tag", {
        tagID: {
            type: DataTypes.INTEGER,
            allowNull: false, //非空
            autoIncrement: true, //自动递增
            primaryKey: true //主键
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true //主键
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },{
        freezeTableName: true,
        timestamps: false, //取消默认生成的createdAt、updatedAt字段
    });
}
