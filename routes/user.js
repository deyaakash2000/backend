
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userinfo = require("../models/userInfo");
const fetchAdmin = require('../middleware/fetchadmin');
const { NotBeforeError } = require("jsonwebtoken");
// Rout 1 :fetch all Info get "/api/notes/allinfo" login require
router.get("/allinfo", fetchAdmin, async (req, res) => {
  try {
    const note = await userinfo.find({ user: req.user.id });
    res.json(note);
    // res.json([])
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "error occcoure" });
  }
});

router.post(
    "/adduserdetails", fetchAdmin,
    [
      body("title", "Enter a name").isLength({ min: 3 }),
      body("email", "Enter email").isLength({ min: 3 }),
      body("department", "Enter department").isLength({ min: 2 }),
      body("roll", "Enter roll").isNumeric(),
    ],
    async (req, res) => {
      try {
        const { title, email, department ,roll } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const userInfo = new userinfo({
            title,
            email,
            department,
            roll,
            user:req.user.id
        });
        const saveData = await userInfo.save();
        res.json(saveData);
      } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "error occcoure" });
      }
    }
  );
  router.get("/getInfo/:roll", async (req, res) => {
    try {
      let note =  await userinfo.find({roll:req.params.roll});  
      //if notes is note present
        res.json(note)
      
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "error occcoure" });
    }
  });
module.exports =router