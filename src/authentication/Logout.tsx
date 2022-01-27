import { useAuth } from "context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    const { setToken } = useAuth();
    useEffect(() => {
        localStorage.clear();
        sessionStorage.clear();
        setToken(undefined);
        navigate("/");
    }, []);

    return null
}
export default Logout;