const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "superS3cr3t1";

const generateJwt = (user) => {
  const payload = { username: user.username, };

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

function authAdmin(req,res,next){
  let {username,password} = req.headers;
  let adminFound = ADMINS.find(item => item.username === username && item.password === password)
  if (adminFound)
  {
    req.admin = adminFound;
    next();
  }
  else{
    res.status(403).json({ message: 'User authentication failed' });
  }
}

const authUser = (req,res,next) => {
  let {username,password} = req.headers;
  let userFound = USERS.find(item => item.username === username && item.password === password)
  if (userFound)
  {
    req.user = userFound;
    next();
  }
  else{
    res.status(403).json({ message: 'User authentication failed' });
  }
}


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let admin = {
    username: req.body.username,
    password: req.body.password
  }

  const userAlreadyPresent = ADMINS.find(a => a.username === admin.username);
  if (userAlreadyPresent) {
    res.status(403).json({ message: 'Admin already exists' });
  } 
  else {
    ADMINS.push(admin);
    const token = generateJwt(admin);
    res.json({ message: 'Admin created successfully', token });
  }
});

app.post('/admin/login', authAdmin, (req, res) => {
  // logic to log in admin
  const token = generateJwt(req.admin);
  res.json({ message: 'Logged in successfully', token });
});

app.post('/admin/courses', authenticateJwt, (req, res) => {
  // logic to create a course
  const course = req.body;
  if(course){
    course.id = Math.floor(Math.random()*100);
    COURSES.push(course)
    res.json({ message: 'Course created successfully', courseId: course.id });
  }
});

app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
  // logic to edit a course
  const course = req.body;
  const courseId = parseInt(req.params.courseId);
  let courseFound = COURSES.find(a => a.id === courseId)
  
  if(courseFound){
    Object.assign(courseFound, course);
    res.json({ message: 'Course updated successfully' });
  }
  else{
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateJwt, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  const user = req.body;
  const existingUser = USERS.find(u => u.username === user.username);
  if (existingUser) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    USERS.push(user);
    const token = generateJwt(user);
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    const token = generateJwt(user);
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
});

app.get('/users/courses', authenticateJwt, (req, res) => {
  res.json({ courses: COURSES });
});

app.post('/users/courses/:courseId', authenticateJwt, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if (course && course.published) {
    const user = USERS.find(u => u.username === req.user.username);
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      user.purchasedCourses.push(course);
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authenticateJwt, (req, res) => {
  const user = USERS.find(u => u.username === req.user.username);
  if (user && user.purchasedCourses) {
    res.json({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(404).json({ message: 'No courses purchased' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
