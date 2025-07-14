import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.json({ success: false, message: 'User ID not found in request' });
        }
        
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        
        return res.json({ 
            success: true, 
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (error) {
        console.error('Error in getUserData:', error);
        return res.json({ success: false, message: error.message });
    } 
}

