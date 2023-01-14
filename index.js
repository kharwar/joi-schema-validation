const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/test", (req, res, next) => {
  const Joi = require("joi");

  const data = req.body;

  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    phone: Joi.string()
      .regex(/^\d{10}$/)
      .required(),
  });
  const valid = schema.validate(data).error;
  const id = Math.ceil(Math.random() * 9999999);

  if (!valid) {
    res.status(422).json({
      status: "error",
      message: "Invalid request data",
      data: data,
    });
  } else {
    res.json({
      status: "success",
      message: "User created successfully",
      data: data,
    });
  }
});

const Routes = require("./routes");

app.use("/", Routes);
app.listen(port, () => console.log(`Example app listening!`));

/*
const Joi = require('joi');
const loginSchema = Joi.object().keys({
  username: Joi.string()
    .min(3),
    .max(10),
    .required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
});

app.post('/login', function(req, res) {
  const valid = Joi.validate(req.body, loginSchema).error === null;
  if (!valid) {
    res.status(422).json({
      status: 'error'
      message: 'Invalid request data'
      data: req.body
    });
  } else {
    // happy days - login user
    res.send(`ok`);
  }
});*/
