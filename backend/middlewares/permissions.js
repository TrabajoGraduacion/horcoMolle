const jwt = require("jsonwebtoken");
const userModel = require("../models/usuario.model");

// Función que comprueba la existencia de un token y si corresponde a un usuario válido lo pone a disposición de todo el sistema en req.user
const validateToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Token inválido" });
    const tokenParts = token.split(" ");

    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ message: "Token inválido" });
    }
    const jwtToken = tokenParts[1];
    const { _id } = jwt.verify(jwtToken, process.env.JWT);

    const user = await userModel.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Comprueba que el usuario sea Administrador
const verifyAdmin = async (req, res, next) => {
  try {
    await validateToken(req, res, () => {
      if (req.user?.activo && req.user?.rol === "Administrador") {
        next();
      } else {
        throw new Error("Acceso denegado");
      }
    });
  } catch (error) {
    res.status(401).json({ message: "Acceso denegado" });
  }
};

// Comprueba que el usuario sea Guardafauna
const verifyGuardafauna = async (req, res, next) => {
  try {
    await validateToken(req, res, () => {
      if (req.user?.activo && req.user?.rol === "Guardafauna") {
        next();
      } else {
        throw new Error("Acceso denegado");
      }
    });
  } catch (error) {
    res.status(401).json({ message: "Acceso denegado" });
  }
};

// Comprueba que el usuario sea Docente
const verifyDocente = async (req, res, next) => {
  try {
    await validateToken(req, res, () => {
      if (req.user?.activo && req.user?.rol === "Docente") {
        next();
      } else {
        throw new Error("Acceso denegado");
      }
    });
  } catch (error) {
    res.status(401).json({ message: "Acceso denegado" });
  }
};

// Comprueba que haya un usuario logueado (cualquier usuario autenticado)
const verifyUser = async (req, res, next) => {
  try {
    await validateToken(req, res, () => {
      if (req.user?.activo && req.user?._id) {
        next();
      } else {
        throw new Error("Acceso denegado");
      }
    });
  } catch (error) {
    res.status(401).json({ message: "Acceso denegado" });
  }
};

module.exports = { verifyAdmin, verifyGuardafauna, verifyDocente, verifyUser };
