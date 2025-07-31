import 'dotenv/config';
import { expressjwt as jwt } from 'express-jwt';
import jwks from 'jwks-rsa';

// Validazione delle variabili d'ambiente
const requiredEnvVars = ['AUTH0_DOMAIN', 'AUTH0_AUDIENCE'];
requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        throw new Error(`Variabile d'ambiente mancante: ${envVar}`);
    }
});

// Configurazione del middleware JWT
export const authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256'],
});

// Middleware per gestire gli errori di autenticazione
export const handleAuthError = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Token non valido',
            message: 'Accesso non autorizzato'
        });
    }
    next(err);
};