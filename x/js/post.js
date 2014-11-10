$("input").click(function(){
	var code = $('#code').val();
	var input_data = $('#input_data').val();
	var show = $('#show');

	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:1337",
		data:{"code":code,"data":input_data},
		success:function(message) {
//			console.log(mess);
//			var message = JSON.parse(mess);
			var p1 = '<p> 状态：' +message.statuscode+ '</p>';
			//正则表达式式去首尾引号
			//p += "<p> 结果：" +mess.data.replace(/^\'?|\'?$/g,'') + "</p>";
//			var p2 = '<p> 结果：' + message.data.substring(1,message.data.length - 1) + '</p>';
			var p2 = '<p> 结果：' + message.data + '</p>';
			show.append(p1);
			show.append(p2);
		},
		dataType: "JSON"
	});
})
