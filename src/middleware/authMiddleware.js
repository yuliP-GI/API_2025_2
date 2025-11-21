import jwt from "jsonwebtoken";
const SECRET = "mi_secreto_super_seguro";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "Token no proporcionado" });

    const token = authHeader.split(" ")[1]; // "Bearer token"
    if (!token) return res.status(401).json({ message: "Token inválido" });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // guardamos info del usuario
        next();
    } catch (error) {
        res.status(403).json({ message: "Token inválido o expirado" });
    }
};
