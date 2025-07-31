import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import type { ReactElement } from "react";

interface PrivateRouteProps {
    children: ReactElement;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Caricamento…</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}