const bodyValidation = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    return next();
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.issues[0].message);
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
