import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

//If you're confused this(the useEffect below) works/makes sense when you are already loggedIn using login page and and now have moved on to another page or loading/re-loading as verifyJWT already decodes the token from the cookies(that are already stored in browser) in verifyJWT's request and get's the mongoDb userId and makes a DB call to find a user with that ID and stores that user in req.user and getCurrentUser basically returns req.user

useEffect(() => {
const fetchUser = async () => {
    try {
      const { data } = await getCurrentUser();
      setUser(data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
    };
  fetchUser();
}, []);

const logout = async () => {
  try {
    await logoutUser();
  } catch (error) {
    console.error(error);
  } finally {
    setUser(null);
  }
};

return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {/* This will be used by <App/>  */}
        {children}    
    </AuthContext.Provider>
)
  };

export const useAuth = () => useContext(AuthContext); //just like useState pass useContext your Context.

