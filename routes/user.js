
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userinfo = require("../models/userInfo");
const fetchAdmin = require('../middleware/fetchadmin');
const { NotBeforeError } = require("jsonwebtoken");
router.post(
    "/adduserdetails", fetchAdmin,
    [
      body("name", "Enter a name").exists(),
      body("marks", "Enter marks").isNumeric(),
    ],
    async (req, res) => {
      try {
        const { name, marks, roll } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const userInfo = new userinfo({
            name,
            marks,
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