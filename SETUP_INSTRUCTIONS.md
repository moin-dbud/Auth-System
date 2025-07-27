# Authentication System Setup Instructions

## Environment Variables Setup

### ⚠️ CRITICAL: You MUST create these .env files for the application to work!

### Server (.env file in server directory)
Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (for nodemailer)
SENDER_EMAIL=your-email@gmail.com
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
```

### Client (.env file in client directory)
Create a `.env` file in the `client` directory with:

```env
VITE_BACKEND_URL=http://localhost:4000
```

## Issues Fixed

1. **Cookie Configuration**: Updated server to use conditional secure cookies (only secure in production)
2. **Token Management**: Improved client-side token handling in localStorage and Authorization headers
3. **Authentication Flow**: Fixed the getUserData function to properly check authentication status
4. **CORS Configuration**: Ensured proper CORS setup for development

## Running the Application

1. **Create Environment Files** (MANDATORY):
   - Create `.env` file in `server/` directory with the variables above
   - Create `.env` file in `client/` directory with `VITE_BACKEND_URL=http://localhost:4000`

2. **Start MongoDB** (make sure MongoDB is running locally)

3. **Start Server**: 
   ```bash
   cd server
   npm install
   npm run server
   ```

4. **Start Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

5. **Verify Server is Running**: You should see "Server is running on PORT: 4000" and "Database Connected Successfully" in the server console.

## Key Changes Made

### Server-side:
- Fixed cookie settings to work in development
- Added conditional secure flag based on NODE_ENV
- Improved error handling in authentication middleware

### Client-side:
- Enhanced token management in AppContext
- Improved getUserData function with proper error handling
- Better integration between localStorage and Authorization headers

The authentication should now work properly with both cookies and localStorage tokens.

## Troubleshooting

### Common Issues:

1. **"Unauthorized Access" Error**: 
   - Make sure you've created the `.env` file in the server directory
   - Ensure `JWT_SECRET` is set in your server `.env` file
   - Check that MongoDB is running and accessible

2. **"Cannot connect to server" Error**:
   - Make sure the server is running on port 4000
   - Check that you've created the client `.env` file with `VITE_BACKEND_URL=http://localhost:4000`
   - Verify no other application is using port 4000

3. **Login shows success but user not logged in**:
   - Check browser console for detailed error messages
   - Ensure both cookies and localStorage are working
   - Verify the token is being stored properly

4. **Database Connection Issues**:
   - Make sure MongoDB is installed and running
   - Check that `MONGODB_URI` is correct in your server `.env` file

## Email Service Configuration

The application uses Brevo (formerly Sendinblue) for email services. You'll need to:
1. Create an account at https://brevo.com
2. Get your SMTP credentials
3. Update the SMTP_USER and SMTP_PASSWORD in your .env file

Alternatively, you can modify the `server/config/nodemailer.js` file to use a different email service like Gmail. 