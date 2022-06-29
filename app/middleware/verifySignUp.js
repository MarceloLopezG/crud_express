const db = require("../models");
const User = db.user;


isEmailExist = (req, res, next) => {
  let data = req.body;
  let email = data.email;

  // Avoid duplicate Email
  User.findOne({
    where: {
      email: email
    }
  }).then(user => {
    if (user) {
      res.status(400).json({ warning: "Failed! Email is already in use!" });
      return;
    }
    next();
  });

};


const verifySignUp = {
  isEmailExist: isEmailExist,
};


module.exports = verifySignUp;