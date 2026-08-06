module.exports = {
  AUTH: {
    TOKEN_MISSING: "Authorization token is missing.",
    INVALID_TOKEN: "The provided token is invalid or has expired.",
    TOKEN_EXPIRED: "Refresh Token has expired.",
    ACCESS_DENIED: "You do not have permission to access this resource.",
    ADMIN_ONLY: "Administrator privileges are required to perform this action.",
    REFRESH_TOKEN_REQUIRED: "A refresh token is required.",
    INTERNAL_API_KEY_MISSINGS: "Internal API key is missing.",
    INVALID_INTERNAL_API_KEY: "Invalid internal API key."
  },

  USER: {
    NOT_FOUND: "Account not found.",
    ALREADY_EXISTS: "An account with this email already exists.",
    INVALID_CREDENTIALS: "The email or password you entered is incorrect.",
    UNAUTHORIZED: "Unauthorized."
  },

  MOVIE: {
    NOT_FOUND: "Movie not found.",
    ALREADY_EXISTS: "A movie with the same details already exists.",
  },

  SHOWTIME: {
    NOT_FOUND: "Showtime not found.",
    INVALID_PRICE: "Price must be greater than zero.",
    INVALID_TIME_RANGE: "startTime must be before endTime.",
  },

  SEAT: {
    NOT_FOUND: "One or more seats not found.",
    ALREADY_BOOKED: "One or more seats are already booked.",
    JUST_BOOKED: "Seats have just been booked by another user.",
  },

  THEATER: {
    NOT_FOUND: "Theater not found.",
  },

  BOOKING: {
    NOT_FOUND: "Booking not found.",
    ALREADY_CANCELLED: "This booking has already been cancelled.",
    CANNOT_CANCEL: "This booking can no longer be cancelled.",
  },

  PAYMENT: {
    INVALID_AMOUNT: "Invalid Amount.",
  },

  WALLET: {
    INSUFFICIENT_BALANCE: "Your wallet balance is insufficient to complete this transaction.",
  },

  NOTIFICATION: {
    NOTIFICATION_FAIL: "Failed to send Notification"
  },

  INTERNAL: {
    ERROR: "An unexpected error occurred. Please try again later.",
  },

  VALIDATION: {
    INVALID_INPUT: "The provided data is invalid.",
    REQUIRED_FIELD: (field) => `${field} is required.`,
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_PHONE: "Please enter a valid phone number.",
  },

  SUCCESS: {
    CREATED: "Resource created successfully.",
    UPDATED: "Resource updated successfully.",
    DELETED: "Resource deleted successfully.",
    FETCHED: "Data retrieved successfully.",
  },

  GENERAL: {
    MISSING_FIELDS: "Please provide all required fields.",
    INTERNAL_SERVER_ERROR: "Internal Server Error.",
    INVALID_JSON: "Malformed JSON request body.",
    FOREIGN_KEY_CONSTRAINT: "Operation violates database relationship.",
    INVALID_REQUEST: "Invalid Request."
  },
};
