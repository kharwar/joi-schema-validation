const express = require("express");
const router = express.Router();

const SchemaValidator = require("./schemaValidator");
const validateRequest = SchemaValidator(true);

const genericHandler = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: req.body,
  });
};

router.post("/people", validateRequest, genericHandler);
router.post("/auth", validateRequest, genericHandler);
router.post("/fees", validateRequest, genericHandler);

module.exports = router;
