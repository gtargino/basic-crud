const express = require('express');

const server = express();
server.use(express.json());
server.listen(3000);

// CRUD - Create, Read, Update, Delete

// query params = ?/users
/* server.get('/users', (req,res) => {
    const name = req.query.name;
    //return res.send('hello');
    return res.json({message:`Hello ${name}`});
}); */

var users = [];

// run for all middlewares (whatever if is GET, POST, PUT, DEL)
server.use((req,res, next) => {
    console.log(`method: ${req.method}; URL: ${req.url}`);
    return next(); // continue
});

function checkUserExistis(req,res,next) {
    if(!req.body.name) {
        return res.status(400).json({error : 'user name is required'});
    }
    return next();
}

function checkUserInArray(req,res,next) {
    const user = users[req.params.index]
    if(!user) {
        return res.status(400).json({error : 'user does not exists'});
    }
    req.user = user;
    return next();
}

// route params = /users/1
 server.get('/users/:index', checkUserInArray, (req,res) => {
    return res.json(req.user);
});

server.get('/users/', (req,res) => {
    return res.json(users);
});

server.put('/users/:index', checkUserExistis, checkUserInArray, (req,res) => {
    const { index } = req.params;
    const { name } = req.body;
    users[index] = name;
    return res.json(users);
});

server.delete('/users/:index', checkUserInArray, (req,res) => {
    const { index } = req.params;
    users.splice(index,1);
    return res.send();
});

server.post('/users', checkUserExistis, (req,res) => {
    const { name } = req.body;
    users.push(name);
    
    return res.json(users);
});