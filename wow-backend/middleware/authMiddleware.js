import jwt from 'jsonwebtoken';

// Strict verifier (fails if no token)
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. Please login.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretwowkey123');
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }
};

// Strict Admin verifier
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }
    next();
  });
};

// Flexible verifier (if token present, attaches user; if not, allows continuing)
export const optionalToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretwowkey123');
      req.userId = decoded.id;
      req.userRole = decoded.role;
    } catch (err) {
      // Token invalid or expired, continue without userId
    }
  }
  next();
};
