import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { conmysql } from "../db.js";

const SECRET = "mi_secreto_super_seguro";

// Registrar usuario
export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "Faltan datos" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await conmysql.query(
            "INSERT INTO users(username, password) VALUES (?, ?)",
            [username, hashedPassword]
        );

        res.status(201).json({ message: "Usuario registrado", user_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

// Login de usuario
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const [rows] = await conmysql.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );
        if (rows.length === 0) return res.status(400).json({ message: "Usuario no encontrado" });

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });

        const token = jwt.sign({ user_id: user.id, username: user.usr_usuario }, SECRET, { expiresIn: "1h" });

        res.json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};
