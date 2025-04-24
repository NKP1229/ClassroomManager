const router = require("express").Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const { prisma } = require("../common");
const bcrypt = require("bcrypt");

// Register a new instructor account
router.post("/register", async (req, res, next) => {
  // try {
  //   const {
  //     rows: [instructor],
  //   } = await db.query(
  //     "INSERT INTO instructor (username, password) VALUES ($1, $2) RETURNING *",
  //     [req.body.username, req.body.password]
  //   );

  //   // Create a token with the instructor id
  //   const token = jwt.sign({ id: instructor.id }, process.env.JWT);

  //   res.status(201).send({ token });
  // } catch (error) {
  //   next(error);
  // }
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
    const {
      rows: [instructor],
    } = await db.query(
      "SELECT * FROM instructor WHERE username = $1 AND password = $2",
      [req.body.username, req.body.password]
    );

    if (!instructor) {
      return res.status(401).send("Invalid login credentials.");
    }

    // Create a token with the instructor id
    const token = jwt.sign({ id: instructor.id }, process.env.JWT);

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

// Get the currently logged in instructor
router.get("/me", async (req, res, next) => {
  // try {
  //   const {
  //     rows: [instructor],
  //   } = await db.query("SELECT * FROM instructor WHERE id = $1", [
  //     req.user?.id,
  //   ]);

  //   res.send(instructor);
  // } catch (error) {
  //   next(error);
  // }
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
