const Sequelize = require('sequelize');
const sequelize = new Sequelize('mynote','root','sqlite',
    {
        host: 'localhost',
        dialect: 'sqlite',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        storage: './database/mynote.sqlite'
    }
);

sequelize.authenticate().then(function() {
    console.log("数据库连接成功!");
}).catch(function(err) {
    //数据库连接失败时打印输出
    console.error(err);
    throw err;
});

exports.sequelize = sequelize;
exports.Sequelize = Sequelize;