
const express = require('express');
const fs = require('fs');

const app = express();
const port = 6003;

// Middleware to read JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Read student records
function readStudents() {
    return JSON.parse(fs.readFileSync('student.json', 'utf8'));
}

// Write student records
function mywrite(data) {
    fs.writeFileSync('student.json', JSON.stringify(data, null, 2));
}

// GET: Welcome message
app.get('/', function(req, res) {
    res.send('<h3>Welcome to Express REST API Server</h3>');
});

// GET: Display all students
app.get('/list', function(req, res) {
    const stu = readStudents();
    res.json(stu);
});

// POST: Insert a student
app.post('/', function(req, res) {
    const stu = readStudents();
    const newstu = req.body;

    if (!newstu.name || !newstu.roll) {
        return res.status(400).send('Name and Roll are required');
    }

    stu.push(newstu);
    mywrite(stu);

    res.send('Inserted Successfully');
});

// PUT: Update a student
app.put('/', function(req, res) {
    const stu = readStudents();
    const upstu = req.body;

    const index = stu.findIndex(s => s.roll == upstu.roll);

    if (index === -1) {
        return res.status(404).send('Student Not Found');
    }

    stu[index].name = upstu.name;
    mywrite(stu);

    res.send('Updated Successfully');
});

// DELETE: Delete a student
app.delete('/', function(req, res) {
    const stu = readStudents();
    const delstu = req.body;

    const index = stu.findIndex(s => s.roll == delstu.roll);

    if (index === -1) {
        return res.status(404).send('Student Not Found');
    }

    stu.splice(index, 1);
    mywrite(stu);

    res.send('Deleted Successfully');
});

// Start server
app.listen(port, function() {
    console.log('Server started on port ' + port);
});
