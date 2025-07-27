import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    // Check for token in cookies
    let token = req.cookies.token;
    
    // If no token in cookies, check Authorization header
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
            console.log('Token found in Authorization header');
        }
    }

    if (!token) {
        console.log('No token found in cookies or Authorization header');
        return res.json({ success: false, message: 'Unauthorized Access' });
    }

    try {
        console.log('Verifying token:', token.substring(0, 20) + '...');
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', tokenDecode);
        
        if (tokenDecode.id) {
            req.user = { id: tokenDecode.id };
            console.log('User ID set in request:', tokenDecode.id);
        } else {
            console.log('No ID found in token');
            return res.json({ success: false, message: 'Unauthorized Access' });
        }
        next();

    } catch (error) {
        console.error('Token verification error:', error);
        res.json({ success: false, message: error.message });
    }
}

export default userAuth;