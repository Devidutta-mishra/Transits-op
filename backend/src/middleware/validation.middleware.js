import { validationResult } from "express-validator";

import { errorResponse } from "../utils/apiResponse.js";

export function validateRequest(req, _res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return _res.status(422).json(
      errorResponse(
        "Validation failed",
        errors.array().map((error) => ({
          field: error.path,
          message: error.msg
        }))
      )
    );
  }

  return next();
}
