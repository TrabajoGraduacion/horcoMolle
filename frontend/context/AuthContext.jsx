import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const URL = import.meta.env.VITE_API_USUARIO;

    const login = async (values) => { //ver q onda los status
        try {
            const response = await axios.post(`${URL}login`, values);
            if(response.status === 200){
                const token = response.data.token;
                const decodedToken = jwtDecode(token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                localStorage.setItem("token", token);
                setAuthenticated(true);
                setUser(decodedToken);
                return {
                    message: response.data.message,
                    status: response.status
                }
            }
            else{
                throw new Error();
            }
        } catch (error) {
            if(error.response) return {
                message: error.response.data.message,
                status: error.response.status
            };
            return {
                message: error.message,
            };
        }
    };

    const logout = () => {
        setUser(null);
        setAuthenticated(false);
        axios.defaults.headers.common["Authorization"] = "";
        localStorage.removeItem("token");
        return "Logout: hacerlo con un sweetalert"; //Devuelve un string q debe ser usado en un sweet alert
    };

    const getAuth = useCallback(() => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setAuthenticated(false);
                setLoading(false);
                return false;
            }
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const decodedToken = jwtDecode(token);
            setUser(decodedToken);
            setAuthenticated(true);
            setLoading(false);
            return true;
        } catch (error) {
            setAuthenticated(false);
            setLoading(false);
            toast.error("Error de autenticación. Ingrese nuevamente");
            return false;
        }
    }, []); // No hay dependencias porque no usa ningún estado o prop

    useEffect(() => {
        getAuth();
    }, [getAuth]);

    if (loading) {
        return <div>Loading...</div>; // O cualquier componente de carga que prefieras
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                authenticated,
                login,
                logout,
                getAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;