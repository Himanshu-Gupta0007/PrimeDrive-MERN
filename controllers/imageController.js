const imagekit = require("../config/imagekit");

exports.getAuthParams = (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.status(200).json(authParams);
  } catch (error) {
    res.status(500).json({ message: "ImageKit auth failed" });
  }
};
