
const http = require('http');
const fs = require('fs');
const url = require('url');

const port = 6000;

const server = http.createServer(function(req, res) {

    res.setHeader('Content-Type', 'text/plain');

    const data = url.parse(req.url, true);
    const path = data.pathname;
    const query = data.query;

    // GET: Welcome message
    if (req.method === 'GET' && path === '/') {
        res.end('Welcome to REST API Server');
    }

    // GET: Display all students
    else if (req.method === 'GET' && path === '/list') {
        const stu = JSON.parse(fs.readFileSync('student.json'));
        res.end(JSON.stringify(stu));
    }

    // POST: Add a student
    else if (req.method === 'POST' && path === '/add') {
        const stu = JSON.parse(fs.readFileSync('student.json'));

        const newstu = {
            name: query.name,
            roll: query.roll
        };

        if (!newstu.name || !newstu.roll) {
            res.end('Name and Roll are required');
        } else {
            stu.push(newstu);
            fs.writeFileSync('student.json', JSON.stringify(stu, null, 2));
            res.end('Student Record Inserted');
        }
    }

    // PUT: Update a student
    else if (req.method === 'PUT' && path === '/update') {
        const stu = JSON.parse(fs.readFileSync('student.json'));

        const index = stu.findIndex(s => s.roll === query.roll);

        if (index !== -1) {
            stu[index].name = query.name;
            fs.writeFileSync('student.json', JSON.stringify(stu, null, 2));
            res.end('Student Data Updated');
        } else {
            res.end('Student Not Found');
        }
    }

    // DELETE: Delete a student
    else if (req.method === 'DELETE' && path === '/delete') {
        const stu = JSON.parse(fs.readFileSync('student.json'));

        const index = stu.findIndex(s => s.roll === query.roll);

        if (index !== -1) {
            stu.splice(index, 1);
            fs.writeFileSync('student.json', JSON.stringify(stu, null, 2));
            res.end('Student Deleted');
        } else {
            res.end('Student Not Found');
        }
    }

    else {
        res.statusCode = 404;
        res.end('Invalid Request');
    }

});

server.listen(port, function() {
    console.log('Server Started');
    console.log('Server is listening on port ' + port);
});
