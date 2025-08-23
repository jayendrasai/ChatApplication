import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useMemo,
    Children
} from 'react';

interface AuthContextType {
    accessToken : string | null,
    isAuthenticated : boolean,
    login : (token : string) => void,
    logout : () => void; 
}

//creating the context with an initial undefined value

const AuthContext  = createContext <AuthContextType | undefined >(undefined);


export const AuthProvider = ({children } : {children : ReactNode}) => {


    const [accessToken , setAccessToken] =useState<string | null >(() => {
    return localStorage.getItem('accessToken')
});

const login = (token : string) => {
    setAccessToken(token);
    localStorage.setItem('accessToken' , token);
};

const logout = () => {
    console.log(`sasaa`)
    setAccessToken(null);
    localStorage.removeItem('accessToken')
}

const authContextValue = useMemo(() => ({
   accessToken,
   isAuthenticated : !!accessToken,
   login,
   logout,
}),[accessToken]);

return (
    <AuthContext.Provider value={authContextValue}>
        {children}
    </AuthContext.Provider>
)

};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be used within an Authprovider');
    }
    return context;
};