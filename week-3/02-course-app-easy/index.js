const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const PORT = 3000;

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
  } else {
    ADMINS.push(admin);
    res.status(200).json({ message: 'Admin created successfully' });
  }
});

app.post('/admin/login', authAdmin, (req, res) => {
  // logic to log in admin
    res.json({ message: 'Logged in successfully' });
  });

app.post('/admin/courses', authAdmin, (req, res) => {
  // logic to create a course
  const course = req.body;
  if(course){
    course.id = Math.floor(Math.random()*100);
    COURSES.push(course)
    res.json({ message: 'Course created successfully', courseId: course.id });
  }
});

app.put('/admin/courses/:courseId', authAdmin, (req, res) => {
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

app.get('/admin/courses', authAdmin, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});



// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
    // logic to sign up admin
    let user = {
      username: req.body.username,
      password: req.body.password
    }
  
    const userAlreadyPresent = USERS.find(a => a.username === user.username);
    if (userAlreadyPresent) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      user.purchasedCourses = [];
      USERS.push(user);
      res.status(200).json({ message: 'User created successfully' });
    }
});

app.post('/users/login', authUser, (req, res) => {
  // logic to log in user
  res.json({ message: "Logged in successfully"})
});

app.get('/users/courses', authUser, (req, res) => {
  // logic to list all courses
  let courses = [];
  for(var x of COURSES){
    if(x.published){
      courses.push(x);
    }
  }
  res.json({courses: courses});
});

app.post('/users/courses/:courseId', authUser, (req, res) => {
  // logic to purchase a course
  var courseId = parseInt(req.params.courseId);
  const course = COURSES.find(a => a.id === courseId && a.published)
  if(course){
    req.user.purchasedCourses.push(course);
    res.json({message: 'Course purchased successfully'});
  }
  else{
    res.json({message: 'Course not found'});
  }
});

app.get('/users/purchasedCourses', authUser, (req, res) => {
  // logic to view purchased courses
  res.json({purchasedCourses: req.user.purchasedCourses});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
