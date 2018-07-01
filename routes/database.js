// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('../database/mynote.db');
//
// function getAllUser() {
//     var sql = "select * from user";
//     db.each(sql, function(err, row) {
//         console.log( "row:",row);
//     });
//     db.close();
// }
//
//
// function addUser(data) {
//     var sql = db.prepare("insert into user values(?,?,?,?,?,?)");
//     var obj = JSON.parse(data);
//     sql.bind(obj["userID"], obj["userName"], obj["password"], obj["email"], obj["phoneNumber"], obj["privilege"]);
//     // sql.bind("1", "DCRUNNN", "Dengcong1996", "458891338@qq.com", "1351586313", "1");
//     sql.run();
//     sql.finalize();
//     db.close();
// }
//
//
//
// db.serialize(function () {
//     // var createUserTable="CREATE TABLE user(\n" +
//     //     "   userID TEXT PRIMARY KEY NOT NULL,\n" +
//     //     "   userName TEXT NOT NULL,\n" +
//     //     "   password TEXT NOT NULL,\n" +
//     //     "   email TEXT NOT NULL,\n" +
//     //     "   phoneNumber TEXT NOT NULL,\n" +
//     //     "   privilege INTEGER NOT NULL\n" +
//     //     ")";
//     //
//     // db.run(createUserTable);
//     var data = {
//         "userID": "1",
//         "userName":"DCRUNNN",
//         "password":"Dengcong1996",
//         "email":"458891338@qq.com",
//         "phoneNumber":"13151586313",
//         "privilege":"1"
//     };
//     // addUser(JSON.stringify(data));
// });
//
