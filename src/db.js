import mysql from "mysql2/promise";

export const conmysql = await mysql.createConnection({
  host: "localhost",      // servidor local
  user: "root",           // usuario por defecto de XAMPP
  password: "",           // por defecto viene vacío en XAMPP
  database: "baseapp20252", // ⚠️ pon aquí el nombre real de tu BD
  port: 3306              // puerto por defecto de XAMPP
});
