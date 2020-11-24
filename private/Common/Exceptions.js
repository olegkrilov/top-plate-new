const
  ERRORS = {
    _GET: (status = 500, message = 'Something went wrong') => ({
      error: true,
      status,
      message
    })
  };

Object.defineProperties(ERRORS, {
  BAD_REQUEST: {
    get: () => ERRORS._GET(400, 'Form is corrupted, bad request')
  },
  REQUIRED_FIELDS_ARE_MISSING: {
    get: () => ERRORS._GET(400, 'Missing required fields')
  },
  REQUIRED_FILES_ARE_MISSING: {
    get: () => ERRORS._GET(400, 'Missing required files')
  },
  BAD_CREDENTIALS: {
    get: () => ERRORS._GET(401, 'Login and/or password incorrect')
  },
  NOT_AUTHORIZED: {
    get: () => ERRORS._GET(401, 'Unauthorized')
  },
  ALREADY_EXISTS: {
    get: () => ERRORS._GET(403, 'Already exists')
  },
  ITEM_NOT_FOUND: {
    get: () => ERRORS._GET(404, 'Item not found')
  },
  SOMETHING_WENT_WRONG: {
    get: () => ERRORS._GET()
  }
});

module.exports = ERRORS;
