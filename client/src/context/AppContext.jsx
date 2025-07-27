import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    // Use environment variable or fallback to localhost for development
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Set global axios defaults
        axios.defaults.baseURL = backendUrl;
        axios.defaults.withCredentials = true;

        console.log('Backend URL set to:', backendUrl);
        
        // Check server health first
        checkServerHealth();
    }, [backendUrl]);

    const checkServerHealth = async () => {
        try {
            console.log('Checking server health...');
            const response = await axios.get('/');
            console.log('Server health check response:', response.data);
            
            // If server is healthy, proceed with authentication check
            getUserData();
        } catch (error) {
            console.error('Server health check failed:', error);
            toast.error('Cannot connect to server. Please make sure the backend is running.');
            setIsLoading(false);
        }
    };

    const getUserData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching user data from:', `${backendUrl}/api/user/data`);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
            console.log('Token found in localStorage:', token.substring(0, 20) + '...');
        } else {
            console.log('No token found in localStorage');
        }
        
        const { data } = await axios.get('/api/user/data', {
          withCredentials: true,  // Enable sending cookies
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }) // Add token if available
          }
        });

        console.log('User data response:', data);

        if (data.success) {
          setUserData(data.userData);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
          localStorage.removeItem('token'); // Clear token if unauthorized
          if (data.message !== 'Unauthorized Access') {
            toast.error(data.message);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        console.error('Error response:', error.response);
        setIsLoggedIn(false);
        setUserData(null);
        localStorage.removeItem('token'); // Clear token on error
        if (error.response?.status !== 401 && !error.message.includes('Network Error')) {
          toast.error(error.response?.data?.message || error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

 
    const clearAuthState = () => {
        setIsLoggedIn(false);
        setUserData(null);
        localStorage.removeItem('token');
    }

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
        clearAuthState,
        isLoading
    }

    return (
        <AppContext.Provider value={value} >
            {props.children}
        </AppContext.Provider>
    )
}