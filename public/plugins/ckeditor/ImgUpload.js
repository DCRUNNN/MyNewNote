function imgChange(e) {
    console.info(e.target.files[0]);//图片文件
    var dom = $("input[id^='imgTest']")[0];
    console.log(dom.value);//这个是文件的路径 C:\fakepath\icon (5).png
    console.log(e.target.value);//这个也是文件的路径和上面的dom.value是一样的
    var reader = new FileReader();
    reader.onload = (function (file) {
        return function (e) {
            console.log(this.result); //这个就是base64的数据了
            var sss = $("#showImage");
            $("#showImage")[0].src = this.result;

        };
    })(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);
}