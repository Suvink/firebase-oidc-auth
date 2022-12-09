import { createContext, useContext, useEffect, useState } from "react";
import { OAuthProvider, signOut, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

const authContext = createContext();

const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    const signInWithAuth0 = () => {
        const oidcProvider = new OAuthProvider('oidc.auth0');
        return signInWithPopup(auth, oidcProvider);
    }

    const signOutFromAuth0 = () => {
        return signOut(auth);
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => {
            unsubscribe();
        }
    }, [])

    return <authContext.Provider value={{ user, loading, signInWithAuth0, signOutFromAuth0 }}>
        {children}
    </authContext.Provider>
}

const useAuth = () => {
    return useContext(authContext);
}

export { AuthContextProvider, useAuth };