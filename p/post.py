import requests
url = 'http://127.0.0.1:1337'
data = open('test.cpp').read();
r = requests.post(url,data);
print r.text
