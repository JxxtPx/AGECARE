// middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    // Log error in console
    console.error("🔥 Server Error:", err.stack || err);
  
    // Determine response status code
    const statusCode = err.statusCode || 500;
  
    // Send response to client
    res.status(statusCode).json({
      success: false,
      message: err.message || "Something went wrong. Please try again later.",
      // Only show stack trace in development mode
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  };
  
  module.exports = errorHandler;
  