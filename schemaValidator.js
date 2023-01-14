const _ = require("lodash");
const Joi = require("joi");
const Schemas = require("./schemas");

module.exports = (useJoiError = false) => {
  // useJoiError determines if we should respond with the base Joi error
  // boolean: defaults to false
  const _useJoiError = _.isBoolean(useJoiError) && useJoiError;

  // enabled HTTP methods for request data validation
  const _supportedMethods = ["post", "put"];

  // return the validation middleware
  return (req, res, next) => {
    const route = req.route.path;
    const method = req.method.toLowerCase();

    if (_.includes(_supportedMethods, method) && _.has(Schemas, route)) {
      // get schema for the current route
      const _schema = _.get(Schemas, route);

      if (_schema) {
        let { error, data } = _schema.validate(req.body, {
          abortEarly: false, // abort after the last validation error
          allowUnknown: true, // allow unknown keys that will be ignored
          stripUnknown: true,
        });

        if (error) {
          return res.status(422).json({
            status: "failed",
            error: {
              original: error._object,
              // fetch only message and type from each error
              details: _.map(error.details, ({ message, type }) => ({
                message: message.replace(/['"]/g, ""),
                type,
              })),
            },
          });
        } else {
          // Replace req.body with the data after Joi validation
          data = req.body;
          next();
        }
      }
    }
    next();
  };
};
