// Validación de nombres (nombre y apellido)
const validateName = (name) => {
  const regex = /^[A-Za-z\u00C0-\u024F]+(?: [A-Za-z\u00C0-\u024F]+)*$/;
  return (
    typeof name === "string" &&
    regex.test(name) &&
    name.length >= 2 &&
    name.length <= 50
  );
};

// Validación de apellido
const validateLastName = (lastName) => {
  const regex = /^[A-Za-z\u00C0-\u024F]+(?: [A-Za-z\u00C0-\u024F]+)*$/;
  return (
    typeof lastName === "string" &&
    regex.test(lastName) &&
    lastName.length >= 2 &&
    lastName.length <= 50
  );
};

// Validación de correo
const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return (
    typeof email === "string" &&
    regex.test(email) &&
    email.length >= 5 &&
    email.length <= 100
  );
};

// Validación de contraseña
const validatePassword = (password) => {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    password.length <= 100
  );
};

// Validación de rol (solo acepta los roles definidos)
const validateRole = (role) => {
  const validRoles = ["Administrador", "Guardafauna", "Docente"];
  return validRoles.includes(role);
};

// Validación de estado activo (booleano)
const validateActiveStatus = (isActive) => {
  return typeof isActive === "boolean";
};

// Exporta las validaciones
module.exports = {
  validateName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateRole,
  validateActiveStatus,
};
