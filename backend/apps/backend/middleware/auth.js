const jwt = require('jsonwebtoken');

const RAW_SSO_PUBLIC_KEY = process.env.SSO_PUBLIC_KEY || '';
const SSO_PUBLIC_KEY = RAW_SSO_PUBLIC_KEY.replace(/\\n/g, '\n');
const SSO_ISSUER = process.env.SSO_ISSUER || 'http://localhost:3001/sso';

function verifyAccessToken(token) {
  if (!SSO_PUBLIC_KEY) {
    throw new Error('SSO public key is not configured');
  }
  try {
    return jwt.verify(token, SSO_PUBLIC_KEY, {
      algorithms: ['RS256'],
      issuer: SSO_ISSUER,
    });
  } catch (error) {
    return null;
  }
}

function verifyAdminToken(token) {
  if (!SSO_PUBLIC_KEY) {
    throw new Error('SSO public key is not configured');
  }
  try {
    return jwt.verify(token, SSO_PUBLIC_KEY, {
      algorithms: ['RS256'],
      issuer: SSO_ISSUER,
      audience: 'admin',
    });
  } catch (error) {
    return null;
  }
}

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = verifyAccessToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    req.user = {
      userId: decoded.userId,
      accountType: decoded.accountType,
      scope: decoded.scope,
      role: decoded.role,
      sessionId: decoded.sessionId,
      clientId: decoded.clientId,
    };

    next();
  } catch (error) {
    const status = error.message?.includes('public key')
      ? 500
      : 401;
    return res.status(status).json({
      success: false,
      message:
        status === 500
          ? 'Authentication configuration error'
          : 'Authentication failed',
    });
  }
};

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = verifyAdminToken(token);

    if (!decoded || !decoded.adminId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    if (
      decoded.role !== 'admin' &&
      decoded.role !== 'sub_admin' &&
      decoded.role !== 'super_admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    req.admin = {
      adminId: decoded.adminId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    const status = error.message?.includes('public key')
      ? 500
      : 401;
    return res.status(status).json({
      success: false,
      message:
        status === 500
          ? 'Authentication configuration error'
          : 'Authentication failed',
    });
  }
};

module.exports = { authenticate, authenticateAdmin };

