const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 6003;

const SECRET_KEY = 'mysecretkey';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read student data
function readStudents() {
    return JSON.parse(fs.readFileSync('student.json', 'utf8'));
}

// Write student data
function mywrite(data) {
    fs.writeFileSync('student.json', JSON.stringify(data, null, 2));
}

// LOGIN: Generate JWT token
app.post('/login', function(req, res) {

    const { username, password } = req.body;

    if (username === 'admin' && password === '12345') {

        const token = jwt.sign(
            { user: username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({ token: token });

    } else {
        res.status(401).send('Invalid Credentials');
    }
});

// JWT Verification Middleware
function verifyToken(req, res, next) {

    const bearerHeader = req.headers['authorization'];

    if (bearerHeader && bearerHeader.startsWith('Bearer ')) {

        const token = bearerHeader.split(' ')[1];

        try {
            const authData = jwt.verify(token, SECRET_KEY);
            req.user = authData;
            next();

        } catch (err) {
            return res.status(403).send('Invalid Token');
        }

    } else {
        return res.status(401).send('Token Missing');
    }
}

// Welcome route
app.get('/', function(req, res) {
    res.send('<h3>JWT Protected Express REST API</h3>');
});

// GET: Display all students
app.get('/list', verifyToken, function(req, res) {

    const stu = readStudents();
    res.json(stu);

});

// POST: Insert student
app.post('/', verifyToken, function(req, res) {

    const stu = readStudents();
    const newstu = req.body;

    if (!newstu.name || !newstu.roll) {
        return res.status(400).send('Invalid Student Data');
    }

    stu.push(newstu);
    mywrite(stu);

    res.send('Inserted Successfully');

});

// PUT: Update student
app.put('/', verifyToken, function(req, res) {

    const stu = readStudents();
    const upstu = req.body;

    let found = false;

    for (let s of stu) {

        if (s.roll == upstu.roll) {
            s.name = upstu.name;
            found = true;
            break;
        }

    }

    if (found) {
        mywrite(stu);
        res.send('Updated Successfully');
    } else {
        res.status(404).send('Student Not Found');
    }

});

// DELETE: Delete student
app.delete('/', verifyToken, function(req, res) {

    const stu = readStudents();
    const delstu = req.body;

    const newstu = stu.filter(s => s.roll != delstu.roll);

    if (newstu.length < stu.length) {
        mywrite(newstu);
        res.send('Deleted Successfully');
    } else {
        res.status(404).send('Student Not Found');
    }

});

// Start server
app.listen(port, function() {
    console.log('Server running on port ' + port);
});
