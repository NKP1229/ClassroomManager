const router = require("express").Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const { prisma } = require("../common");
const bcrypt = require("bcrypt");

// Register a new instructor account
router.post("/register", async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const response = await prisma.instructor.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
      },
    });
    const token = jwt.sign({ id: response.id }, process.env.JWT, {
      expiresIn: "8h",
    });
    res.status(201).send({ token });
    // return response;
  } catch (error) {
    next(error);
  }
});

// Login to an existing instructor account
router.post("/login", async (req, res, next) => {
  try {
    const response = await prisma.instructor.findFirst({
      where: {
        username: req.body.username,
      },
    });
    const match = await bcrypt.compare(req.body.password, response.password);
    if (match) {
      const token = jwt.sign({ id: response.id }, process.env.JWT);
      res.send({ token });
    } else {
      res.send("incorrect username or password");
    }
  } catch (error) {
    next(error);
  }
});

// Get the currently logged in instructor
router.get("/me", async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).send("User is not authenticated.");
    }
    const response = await prisma.instructor.findFirst({
      where: {
        id: req.user?.id,
      },
    });
    res.send(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
