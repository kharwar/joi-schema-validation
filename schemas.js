const express = require("express");
const Joi = require("joi");
const personID = Joi.string().guid({ version: "uuidv4" });
const name = Joi.string().regex(/^[A-Z][a-z]+&/);

const ageSchema = Joi.alternatives().try(
  Joi.number().integer().greater(6).required(),
  Joi.string()
    .replace(/^([7-9]|[1-9]\d+)(y|yr|yrs|years)?$/i, "$1")
    .required()
);

const personDataSchema = Joi.object()
  .keys({
    id: personID.required(),
    firstname: name,
    lastname: name,
    fullname: Joi.string()
      .regex(/^[A-Z][a-z]+[A-Z][a-z]+$/i)
      .uppercase(),
    type: Joi.string().valid("STUDENT", "TEACHER").uppercase().required(),

    age: Joi.when("type", {
      is: "STUDENT",
      then: ageSchema.required(),
      otherwise: ageSchema,
    }),
  })
  .xor("firstname", "fullname")
  .and("firstname", "lastname")
  .without("fullname", ["firstname", "lastname"]);

const authDataScheme = Joi.object({
  teacherId: personID.required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(7).required().strict(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().strict(),
});

const feesDataSchema = Joi.object({
  studentId: personID.required(),
  amount: Joi.number().positive().greater(1).precision(2).required(),
  cardNumber: Joi.string().creditCard().required(),
  completedAt: Joi.date().timestamp().required(),
});

module.exports = {
  "/people": personDataSchema,
  "/auth": authDataScheme,
  "/fees": feesDataSchema,
};
