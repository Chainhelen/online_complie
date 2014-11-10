var fs = require('fs');
var http = require('http');
var cp = require('child_process');
var url = require('url');
var query = require('querystring');
var path = require('path');
var url = require('url');

http.createServer(function(req,res){
	//GET
	req.setEncoding('utf8');
	if(req.method == "GET"){
		//解析url
		var pathname = path.normalize(__dirname+url.parse(req.url).pathname);
		fs.readFile(pathname,function(err,data){
			if(err){
				res.writeHead(404,{'Content-Type':'text/html'});
				res.end();
			};
			//判断文件类型，写request头
			var ext = path.basename(url.parse(req.url).pathname).split('.')[1];
			if(ext === 'js'){
				res.writeHead(200,{'Content-Type':'application/x-javascript'});
			}else if(ext === 'css'){
				res.writeHead(200,{'Content-Type':'text/css'});
			}else{
				res.writeHead(200,{'Content-Type':'text/html'});
			}
			res.end(data);
		});
	}else{ //POST
		res.writeHead(200,{'Content-Type':'text/json'});
		var post = '';
		req.on('data', function(chunk){
			post += chunk;
		})
		req.on('end',function(){
			//解析
			var params = query.parse(post);
			var exe = {
				"statuscode":'',
				"data":'',
			};
			//post 写入 .cpp
			fs.writeFile('main.cpp',params['code'],function(err){
				if(err){
					res.end('server error');
					throw err;
				}
				console.log('write .cpp has finished');
				//执行make	
				cp.exec('make',function(error,stdout,stderr){
					if(error){
						console.log("\n\033[31m compile error!!! \033[0m");
						//写入尾
						//res.end("compile error!!:\n\n" + error.toString());
						exe.statuscode = 'compile error';
						exe.data = error.toString();
						res.end(JSON.stringify(exe));
					}else{
						cp.exec('echo '+params['data']+' | main.exe',function(error,stdout,stderr){
							if(error){
								console.log("\n\033[31m runtime error!!! \033[0m");
								console.log(error.toString());
							//	res.end("runtime error!!:\n\n" + error.toString());
								exe.statuscode = 'runtime error';
								exe.data = error.toString();
								res.end(JSON.stringify(exe));
							}else{
								console.log("\n\033[42m run ok!!! \033[0m");
								//res.end("run ok!!:\n\n" + stdout);
								exe.statuscode = 'run ok';
								exe.data = JSON.stringify(stdout);
								//console.log(exe.data);
								res.end(JSON.stringify(exe));
							}
						});
					}
				});
			});
		});
	}
}).listen(1337,'127.0.0.1');
console.log("Server running at http://127.0.0.1:1337/");

function del(){
	cp.exec('make clean',function(error,stdout,stderr){});
}
