const bodyValidation = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    return next();
  } catch (err) {
    const path = err.issues[0].path[0];
    const message = err.issues[0].message;
    return res.status(400).json(`${path}:${message}`);
  }
};

const paramsvalidation = (schema) => (req, res, next) => {
  try {
    schema.parse(req.params);
    return next();
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.issues[0].message);
  }
};

module.exports = { bodyValidation, paramsvalidation };
