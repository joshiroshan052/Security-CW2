const { check, validationResult } = require('express-validator');
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("../models/AuthTokens");
const axios = require("axios");
const qs = require("qs");
const xss = require("xss");
const { SendMail } = require("../utils/sendMail");


// Register a new user with validation

// Register a new user with validation
exports.registerUser = [
  // Validation middleware
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[\W_]/).withMessage('Password must contain at least one special character'),
  check('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm password does not match the password');
      }
      return true;
    }),

  async (req, res) => {
    // Find validation errors in this request and wrap them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const isUser = await User.findOne({ email: xss(req.body.email) });
      if (isUser)
        return res.status(400).send({
          success: false,
          message: "User already exists",
        });

      // Hash the password and create the user
      const hashedPassword = await bcrypt.hash(xss(req.body.password), 10);

      const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        name: req.body.name,
        password: hashedPassword,
      });
      const user = await newUser.save();

      const access_token = jwt.sign({ _id: user._id }, process.env.JWT_Secret, {
        expiresIn: "30m",
      });

      const refresh_token = jwt.sign(
        { _id: user._id },
        process.env.JWT_Refresh_Secret,
        { expiresIn: "1h" }  // Set refresh token expiration to 1 hour
      );

      const refToken = new Token({ token: refresh_token });
      await refToken.save();

      res.send({
        success: true,
        user,
        access_token,
        refresh_token,
      });
z
    } catch (err) {
      res.status(400).send({
        success: false,
        message: err.message,
      });
    }
  }
];

// Login a user with validation
exports.loginUser = [
  // Validation middleware
  check('text').notEmpty().withMessage('Email or username is required'),
  check('password').notEmpty().withMessage('Password is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const user = await User.findOne({
        $or: [{ email: xss(req.body.text) }, { username: xss(req.body.text) }],
      });

      if (!user) {
        return res.status(401).send({
          success: false,
          message: "User doesn't exist",
        });
      }

      if (user.isLocked && user.lockUntil > Date.now()) {
        const lockTimeLeft = Math.round((user.lockUntil - Date.now()) / 1000 / 60);
        return res.status(423).send({
          success: false,
          message: `Account is temporarily locked. Try again in ${lockTimeLeft} minutes.`,
        });
      } else if (user.isLocked && user.lockUntil <= Date.now()) {
        user.isLocked = false;
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();
      }

      const isPasswordCorrect = await user.comparePassword(xss(req.body.password));

      if (!isPasswordCorrect) {
        user.loginAttempts += 1;

        if (user.loginAttempts >= 3) {
          user.isLocked = true;
          user.lockUntil = Date.now() + 15 * 60 * 1000; // Lock account for 15 minutes
          await user.save();

          // Send the email when the attempts reach 3
          await SendMail(user.email);

          return res.status(423).send({
            success: false,
            message: "Too many failed login attempts. Your account has been locked for 15 minutes.",
          });
        } else {
          await user.save();
          const attemptsLeft = 3 - user.loginAttempts;
          return res.status(400).send({
            success: false,
            message: `Invalid credentials. ${attemptsLeft} attempt(s) left.`,
          });
        }
      }

      // If login is successful, reset loginAttempts and lock status
      if (user.isLocked || user.loginAttempts > 0) {
        user.loginAttempts = 0;
        user.isLocked = false;
        user.lockUntil = undefined;
        await user.save();
      }

      const access_token = jwt.sign({ _id: user._id }, process.env.JWT_Secret, {
        expiresIn: "1h",
      });
    
      const refresh_token = jwt.sign(
        { _id: user._id },
        process.env.JWT_Refresh_Secret,
        { expiresIn: "1h" }  // Set refresh token expiration to 1 hour
      );
    
      const refToken = new Token({ token: refresh_token });
      await refToken.save();
    

      user.password = undefined;
      res.send({
        success: true,
        user,
        access_token,
        refresh_token,
      });

    } catch (err) {
      res.status(400).send({
        success: false,
        message: err.message,
      });
    }
  }
];

exports.tokenManage = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).send({
        success: false,
        message: "No Refresh Token Provided",
      });
    const isToken = await Token.findOne({ token });
    if (!isToken)
      return res.status(400).send({
        success: false,
        message: "Invalid Refresh Token",
      });
    const decode = jwt.verify(token, process.env.JWT_Refresh_Secret);

    const accessToken = jwt.sign({ _id: decode._id }, process.env.JWT_Secret, {
      expiresIn: "1h",
    });

    res.send({
      access_token: accessToken,
    });

  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id); // Assuming you are storing the user id in req.user

    if (user) {
      user.token = null; // Assuming you're storing the token in the user's record
      await user.save();
    }

    await Token.deleteOne({ token }); // Remove the refresh token from the database

    res.status(200).send({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};


exports.googleoauth = async (req, res) => {
  try {
    const { id_token, access_token } = await getUserFromCode(req.query.code);
    const user = await userDetails(access_token, id_token);
    let isUser = await User.findOne({ email: user.email });
    if (!isUser) {
      const temp = new User({
        username: user.name.split(" ").join(""),
        name: user.name,
        email: user.email,
        avatar: user.picture,
      });
      isUser = temp.save();
    }
    const access_token_server = jwt.sign(
      { _id: isUser._id },
      process.env.JWT_Secret,
      {
        expiresIn: "1h",
      }
    );

    const refresh_token_server = jwt.sign(
      { _id: isUser._id },
      process.env.JWT_Refresh_Secret,
      { expiresIn: "1h" }  // Set refresh token expiration to 1 hour
    );

    const refToken = new Token({
      token: refresh_token_server,
    });
    await refToken.save();

    const options = {
      success: true,
      access_token_server,
      refresh_token_server,
    };
    res.redirect(
      `${process.env.CLIENT_URL}/oauth/redirect?uid=${isUser._id}&access_token=${access_token_server}&refresh_token=${refresh_token_server}`
    );
  } catch (err) {
    console.log(err);
    res.send("Something unexpected happened.");
  }
};

async function getUserFromCode(code) {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: process.env.clientid,
    client_secret: process.env.clientsecret,
    redirect_uri: process.env.redirect_url,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    // throw new Error(error);
  }
}

async function userDetails(access_token, id_token) {
  return axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });
}


