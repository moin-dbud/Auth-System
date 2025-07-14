import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        console.log('No token found in cookies');
        return res.json({ success: false, message: 'Unauthorized Access' });
    }

    try {
        console.log('Verifying token:', token.substring(0, 20) + '...');
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', tokenDecode);
        
        if (tokenDecode.id) {
            // Store user ID in req.user instead of req.body
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