const STATUS_CODES = {
  OK: 200, // 200 OK
  CREATED: 201, // 201 Created
  ACCEPTED: 202, // 202 Accepted
  NO_CONTENT: 204, // 204 No Content
  BAD_REQUEST: 400, // 400 Bad Request
  UNAUTHORIZED: 401, // 401 Unauthorized
  FORBIDDEN: 403, // 403 Forbidden
  NOT_FOUND: 404, // 404 Not Found
  METHOD_NOT_ALLOWED: 405, // 405 Method Not Allowed
  CONFLICT: 409, // 409 Conflict
  INTERNAL_SERVER_ERROR: 500, // 500 Internal Server Error
  BAD_GATEWAY: 502, // 502 Bad Gateway
  SERVICE_UNAVAILABLE: 503, // 503 Service Unavailable
  GATEWAY_TIMEOUT: 504, // 504 Gateway Timeout
};

export default STATUS_CODES;
