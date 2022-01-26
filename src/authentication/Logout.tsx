import { useAuth } from "context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    const { setAuthToken } = useAuth();
    useEffect(() => {
        localStorage.clear();
        sessionStorage.clear();
        setAuthToken('');
        navigate("/");
    }, []);

    return null
}
export default Logout;