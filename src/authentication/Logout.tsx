import { useAuth } from "context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
    const navigate = useNavigate();
    const { setAuthToken } = useAuth();
    useEffect(() => {
        localStorage.clear();
        setAuthToken('');
        navigate("/");
    }, []);

    return null
}