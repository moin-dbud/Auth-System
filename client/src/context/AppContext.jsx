import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext()

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Set global axios defaults
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = backendUrl;
        
        // Check authentication status on mount
        getUserData();
    }, [backendUrl]);

    const getUserData = async () => {
        setIsLoading(true);
        try {
            console.log('Fetching user data from:', backendUrl + '/api/user/data');
            const {data} = await axios.get('/api/user/data');
            console.log('User data response:', data);
            
            if (data.success) {
                setUserData(data.userData);
                setIsLoggedIn(true);
                console.log('User authenticated:', data.userData);
            } else {
                setIsLoggedIn(false);
                setUserData(null);
                console.log('Authentication failed:', data.message);
                // Only show error toast for non-unauthorized messages
                if (data.message !== 'Unauthorized Access') {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setIsLoggedIn(false);
            setUserData(null);
            // Don't show error toast for authentication failures
            if (error.response?.status !== 401 && !error.message.includes('Network Error')) {
                toast.error(error.response?.data?.message || error.message);
            }
        } finally {
            setIsLoading(false);
        }
    }
 
    const clearAuthState = () => {
        setIsLoggedIn(false);
        setUserData(null);
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