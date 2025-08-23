import React, { useState } from 'react'
import {RegistrationForm} from '../components/RegistrationForm.tsx'
import { LoginForm } from '../components/LoginForm.tsx'

export const AuthPage = () => {
    const [isloggedIn , setIsLoggedIn] = useState(true);
    return(
        <div>
            <div>
                { isloggedIn ? <LoginForm/> : <RegistrationForm/> }
                <button onClick={() => {setIsLoggedIn(!isloggedIn)}} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-4 rounded-md hover:from-blue-600 hover:to-purple-600 transition duration-300 ease-in-out disabled:opacity-50">
            {isloggedIn ? 'Register' : 'Already Have an account'}
          </button>
            </div>
            
        </div>
    )
}
