const express = require("express");
const User = require("../models/Admin");
const StudentLogin = require("../models/studentLogin");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchadmin = require("../middleware/fetchadmin");

// algo  : HS256 ,
//  Header{
//   "typ": "JWT",
//  }  payload
//  {
//   "sub": "1234567890",
//   "name": "John Doe",
//   "iat": 1516239022
//  } , verifiedSign{
//   JWT_SECRETE
//  }

const router = express.Router();
const JWT_SECRET = "aakashdeyisa@#$goodboy"; // change 
// Rout : 1 Create a user using: POST "/api/auth/createuser".No login requere
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // if there is errors return Bad request return the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check wheather the email is exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(500).json({ error: req.body.email, message: "Alredy exist" });
      }
      const salt = await bcrypt.genSaltSync(10);
      const hashSec = await bcrypt.hashSync(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: hashSec,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtData = jwt.sign(data, JWT_SECRET);
      res.json({ Authtoken: jwtData });

      // res.json({ nice: "store into database", user });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "error occcoure" });
    }
  }
);

// Rout : 2 Create a Logib user using: POST "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").exists(),
    body("password", "Enter a valid password").exists(),
  ],
  async (req, res) => {
    // if there is errors return Bad request return the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(500).json({ success,error: "Enter valid Email" });
      }
      const passworrdCompair = await bcrypt.compare(password, user.password);
      if (!passworrdCompair) {
        success = false
        return res.status(500).json({ success, success,error: "Enter valid password" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtData = jwt.sign(data, JWT_SECRET);
      let success = true
      res.json({ success,Authtoken: jwtData });
    } catch (error) {
      return res.status(500).json({ error: "internal server error" });
    }
  }
);
// Rout : 3 Details of Loiged in user details : POST "/api/auth/getadmin". login requere
router.post('/getadmin',fetchadmin,  async (req, res) => {

  try {
   const userId = req.user.id;
    const user = await User.findById(userId).select("-password") // select all information expect password select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
// router.get('/',(req,res)=>{
//   const data ={
//     a:'wefwe'
//   }
//   res.json(data)
// })

//Rout : 4 Create a Student: POST "/api/auth/createstudent".No login requere
router.post(
  "/createstudent",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
    body("roll", "Enter a valid University roll ").exists(),
  ],
  async (req, res) => {
    // if there is errors return Bad request return the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check wheather the email is exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(500).json({ error: req.body.email, message: "Alredy exist" });
      }
      const salt = await bcrypt.genSaltSync(10);
      const hashSec = await bcrypt.hashSync(req.body.password, salt);
      user = await StudentLogin.create({
        name: req.body.name,
        email: req.body.email,
        password: hashSec,
        roll : req.body.roll
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtData = jwt.sign(data, JWT_SECRET);
      res.json({ Authtoken: jwtData });

      // res.json({ nice: "store into database", user });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "error occcoure" });
    }
  }
);

// Rout : 5 Create a Logib user using: POST "/api/auth/studentlogin"
router.post(
  "/studentlogin",
  [
    body("roll", "Enter a valid University roll").isLength({ min: 3 }),
    body("password", "Enter a valid password").isLength({ min: 3 }),
  ],
  async (req, res) => {
    // if there is errors return Bad request return the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { roll, password } = req.body;
    try {
      let user = await StudentLogin.findOne({ roll });
      if (!user) {
        return res.status(500).json({ success,error: "Enter valid  University roll" });
      }
      const passworrdCompair = await bcrypt.compare(password, user.password);
      if (!passworrdCompair) {
        success = false
        return res.status(500).json({ success, success,error: "Enter valid password" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtData = jwt.sign(data, JWT_SECRET);
      let success = true
      res.json({ success,Authtoken: jwtData });
    } catch (error) {
      return res.status(500).json({ error: "internal server error" });
    }
  }
);
module.exports = router;
