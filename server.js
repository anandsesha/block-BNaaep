const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const url = require('url');

function handleRequest(req, res) {
  var store = '';

  var filePath = __dirname + '/assets/';
  //   console.log(filePath);

  var contactsPath = __dirname + `/contacts/`;

  req.on('data', (chunk) => {
    store += chunk;
  });

  req.on('end', () => {
    if (req.method === 'GET' && req.url === '/') {
      res.setHeader('Content-Type', 'text/html');

      fs.createReadStream('./index.html').pipe(res);
    }
    if (req.method === 'GET' && req.url === '/about') {
      res.setHeader('Content-Type', 'text/html');

      fs.createReadStream('./about.html').pipe(res);
    }
    if (req.method === 'GET' && req.url === '/index-styles') {
      fs.readFile(filePath + 'index.css', (err, content) => {
        if (err) {
          console.log(err);
        } else {
          res.setHeader('Content-Type', 'text/css');
          res.write(content);
          res.end();
        }
      });
    }
    if (req.method === 'GET' && req.url === '/about-styles') {
      fs.readFile(filePath + 'about.css', (err, content) => {
        if (err) {
          console.log(err);
        } else {
          res.setHeader('Content-Type', 'text/css');
          res.write(content);
          res.end();
        }
      });
    }
    if (req.method === 'GET' && req.url === '/index-image') {
      fs.readFile(filePath + 'index.png', (err, content) => {
        if (err) {
          console.log(err);
        } else {
          res.setHeader('Content-Type', 'image/png');
          res.write(content);
          res.end();
        }
      });
    }
    if (req.method === 'GET' && req.url === '/about-image') {
      fs.readFile(filePath + 'about.png', (err, content) => {
        if (err) {
          console.log(err);
        } else {
          res.setHeader('Content-Type', 'image/png');
          res.write(content);
          res.end();
        }
      });
    }

    // Handle HTML Form
    if (req.method === 'GET' && req.url === '/contact') {
      res.setHeader('Content-Type', 'text/html');
      fs.createReadStream('./form.html').pipe(res);
    }
    if (req.method === 'POST' && req.url === '/form') {
      res.statusCode = 201;

      //   console.log(store); // queryString
      let parsedFormData = qs.parse(store);
      //   console.log(parsedFormData); // object
      //   console.log(contactsPath);
      let stringJsonData = JSON.stringify(parsedFormData); //obj t string -> {"name":"Anand Seshadri","email":"anandseshadri16@gmail.com","username":"aseshad","age":"27","bio":"NodeJS Developer"}

      fs.open(
        contactsPath + `${parsedFormData.username}.json`,
        'wx',
        (err, fd) => {
          err
            ? console.log(`username taken !!!!!!!`)
            : fs.writeFile(
                contactsPath + `${parsedFormData.username}.json`,
                stringJsonData,
                (err) => {
                  err
                    ? console.log(err)
                    : fs.close(fd, (err, content) => {
                        err
                          ? console.log(`Error Closing File`)
                          : res.end(
                              `${parsedFormData.username}.json CREATED on Server!!!`
                            );
                      });
                }
              );
        }
      );
    }
    if (req.method === 'GET') {
      let parsedUrl = url.parse(req.url);
      let usernameObject = qs.parse(parsedUrl.query);
      let username = usernameObject.username; //aseshad <- string
      res.writeHead(200, { 'Content-Type': 'text/html' });

      fs.readFile(contactsPath + `${username}.json`, store, (err, content) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(content) // Buffer Json data
          let parsedContent = JSON.parse(content); // object of aseshad.json
          console.log(parsedContent);
          const htmlResponse = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>User Profile</title>
          </head>
          <body>
            <h1>User Profile: ${username}</h1>
            <p>Name: ${parsedContent.name}</p>
            <p>Email: ${parsedContent.email}</p>
            <p>Age: ${parsedContent.age}</p>
          </body>
          </html>
        `;
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(htmlResponse);
        }
      });
    }
  });
}
var server = http.createServer(handleRequest);
server.listen(5000, () => {
  console.log(`Server listening on Port 5000`);
});
