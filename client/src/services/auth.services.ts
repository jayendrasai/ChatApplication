import api from "../lib/axios";
import { generateKeys } from "../utils/keyUtils";

// Define the shape of the registration data
interface RegistrationData {
  username: string;
  email: string;
  password: string;
}
interface LoginData{
  email : string,
  password : string
}

export const registerUser = async (data: RegistrationData) => {
  // 1. Generate the cryptographic keys on the client
  const { publicKeyBase64, privateKeyBase64 } = await generateKeys();

  // 2. Securely store the private key in localStorage
  localStorage.setItem("privateKey", privateKeyBase64);

  // 3. Call the backend API with the user data and the public key
  console.log(`---${typeof(data.email)}`)
  const response = await api.post("/api/auth/register", {
    userName: data.username,
    Email: data.email,
    Password: data.password,
    publicKey: publicKeyBase64,
  });

  // 4. Return the server's response (which includes the accessToken)
  return response.data;
};

export const loginUser = async (data : LoginData) => {
   const response = await api.post("/api/auth/login",{
    email : data.email,
    password : data.password
   });

   const privateKey = localStorage.getItem('privateKey') ;
   if(!privateKey){
    throw new Error("Private Key not Found");
   }
   return response.data;
};