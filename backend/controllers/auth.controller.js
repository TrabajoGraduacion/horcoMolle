const usuarioModel = require("../models/usuario.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validation = require("../helpers/validations.js");

//Registrar un nuevo usuario
const register = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena, rol } = req.body;

    // Validaciones
    if (!validation.validateName(nombre))
      return res.status(400).json({ message: "Nombre inválido" });
    if (!validation.validateLastName(apellido))
      return res.status(400).json({ message: "Apellido inválido" });
    if (!validation.validateEmail(correo))
      return res.status(400).json({ message: "Correo electrónico inválido" });
    if (!validation.validatePassword(contrasena))
      return res.status(400).json({ message: "Contraseña inválida" });

    // Verifica si el correo ya está registrado
    const repeatedEmail = await usuarioModel.findOne({ correo });
    if (repeatedEmail)
      return res.status(400).json({ message: "El correo ya está registrado" });

    // Encripta la contraseña
    const hash = await bcrypt.hash(contrasena, 10);

    // Crea un nuevo usuario
    const newUser = new usuarioModel({
      nombre,
      apellido,
      correo,
      contrasena: hash,
      rol,
    });

    await newUser.save();
    return res.status(201).json({
      nombre,
      apellido,
      correo,
      rol,
      message: "Registro exitoso",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Iniciar sesión
const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!validation.validateEmail(correo))
      return res.status(401).json({ message: "Correo electrónico inválido" });
    if (!validation.validatePassword(contrasena))
      return res.status(401).json({ message: "Contraseña inválida" });

    // Busca al usuario por correo
    const user = await usuarioModel.findOne({ correo });
    if (!user)
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrecta" });

    // Verifica si la contraseña es correcta
    const isPasswordCorrect = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordCorrect)
      return res
        .status(400)
        .json({ message: "Usuario o contraseña incorrecta" });

    if (!user.activo)
      return res
        .status(400)
        .json({ message: "Inicie sesión con un usuario activo" });

    // Genera el token JWT
    const token = jwt.sign(
      {
        _id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.rol,
        activo: user.activo,
      },
      process.env.JWT
    );

    // Respuesta con el userId (_id)
    res.status(200).header("Authorization", `Bearer ${token}`).json({
      message: "Ingresó con éxito",
      token,
      userId: user._id, // Agregado el userId aquí
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = { register, login };
