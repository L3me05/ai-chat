import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

interface AuthButtonsProps {
    className?: string;
}

function AuthButtons({ className }: AuthButtonsProps) {
    const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

    const handleLogin = useCallback(() => {
        loginWithRedirect();
    }, [loginWithRedirect]);

    const handleLogout = useCallback(() => {
        logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
    }, [logout]);

    if(isLoading) {
        return <div>Caricamento...</div>;
    }

    return (
        <div className={className}>
            {isAuthenticated ? (
                <>
                    {/*<span>Ciao, {user?.name}</span>*/}
                    <button onClick={handleLogout} type="button" aria-label="Esci dall'account" className="hover:text-sky-500 transition-colors">
                        Logout
                    </button>
                </>
            ) : (
                <button onClick={handleLogin} type="button" aria-label="Accedi al tuo account" className="hover:text-sky-500 transition-colors">
                    Login
                </button>
            )}
        </div>
    )
}

export default AuthButtons;