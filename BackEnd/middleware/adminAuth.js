import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    const { adminToken } = req.cookies;

    if (!adminToken) {
      return res.status(400).json({ message: "Not Authorized, login again" });
    }

    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(400).json({ message: "Not Authorized, invalid admin" });
    }

    req.adminEmail = decoded.email;
    next();
  } catch (error) {
    console.log("adminAuth error", error);
    return res.status(400).json({ message: "Not Authorized, invalid token" });
  }
};

export default adminAuth;
