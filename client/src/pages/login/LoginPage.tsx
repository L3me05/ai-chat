import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        } else {
            loginWithRedirect();
        }
    }, [isAuthenticated, navigate, loginWithRedirect]);

    return (
        <div className="flex items-center justify-center h-full">
            <div>Reindirizzamento al login...</div>
        </div>
    );
}

export default LoginPage;