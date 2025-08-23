import React, { Children } from 'react'
import { RegistrationForm } from './features/auth/components/RegistrationForm';
import { AuthProvider, useAuth } from './context/AuthProvider';
import {BrowserRouter as Router , Routes , Route , Link, useNavigate, Navigate } from 'react-router-dom'
import { AuthPage } from './features/auth/pages/AuthPage';
import { LoginForm } from './features/auth/components/LoginForm';

const HomePage = () => {
  const {logout} = useAuth();
  return (
    <div>
      <h1>Welcome to the chat</h1>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
};
//This component protects routes that require athentication
const ProtectedRoute = ({children} : {children : React.ReactNode }) => {
  const {isAuthenticated} = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />
};

//This component handles redirecting away from the auth page if already logged in
const AuthRedirector = ({children} : {children : React.ReactNode }) => {
  const {isAuthenticated} = useAuth();
  return isAuthenticated ? <Navigate to="/" replace/> : <>{children}</>;

}
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main home page route */}
          <Route 
             path='/' 
             element={
                <ProtectedRoute>
                   <HomePage/>
                </ProtectedRoute>
              } 
          />

          {/* Authentication routes */}
          <Route 
              path='/auth' 
              element={
              <AuthRedirector>
                <AuthPage/>
              </AuthRedirector>
              } 
          />
        </Routes>
      </Router>
    </AuthProvider>
      );
}
