// This is a placeholder file for Vercel deployment
// The actual server code is in the root server.js file
module.exports = (req, res) => {
  res.status(200).json({
    message: 'API is running',
    status: 'ok',
    environment: process.env.NODE_ENV
  });
};
