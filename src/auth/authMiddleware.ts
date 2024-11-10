import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'your_jwt_secret';

/**
 * @swagger
 * /auth/protected:
 *   get:
 *     summary: Acceder a un recurso protegido
 *     description: Accede a un recurso que requiere autenticación mediante un token JWT válido.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acceso exitoso
 *       401:
 *         description: Acceso denegado, no se proporcionó un token
 *       403:
 *         description: Token inválido
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Acceso denegado' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { userId: string; username: string };
        req.body.user = { userId: decoded.userId, username: decoded.username }; // Asignar ambos valores a req.user
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token inválido' });
    }
};
