var fs = require('fs');
var http = require('http');
var cp = require('child_process');

http.createServer(function(req,res){
	var post = '';
	req.on('data', function(chunk){
		post += chunk;
	})
	req.on('end',function(){
		//写入头
		res.writeHead(200,{'Content-Type':'text/plain'});

		//post 写入 .cpp
		fs.writeFile('main.cpp',post,function(err){
			if(err){
				throw err;
			}
			console.log('write .cpp has finished');
			//执行make	
			cp.exec('make',function(error,stdout,stderr){
				if(error){
					console.log("\n\033[31m compile error!!! \033[0m");
		//			console.log("\n \033[32m " + error + " \033[0m\n");
					//写入尾
					res.end("compile error!!:\n\n" + error.toString());
				}
				//make成功
				cp.exec('main.exe',function(error,stdout,stderr){
					if(error){
						console.log("\n\033[31m runtime error!!! \033[0m");
						res.end("runtime error!!:\n\n" + error.toString());
					}
					res.end("run ok!!:\n\n" + stdout);
				});
			});
		});
	});
}).listen(1337,'127.0.0.1');
console.log("Server running at http://127.0.0.1:1337/");
