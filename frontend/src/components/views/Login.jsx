import React, { useState, useContext, useEffect } from "react";
import "../../css/login.css";
import logo from "../../assets/LogoAncho.png";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Login = () => {
  const [isChecked, setChecked] = useState(false);
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errors, setErrors] = useState({});

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    if (rememberMe) {
      const savedCorreo = localStorage.getItem("correo") || "";
      setCorreo(savedCorreo);
      setChecked(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    switch (name) {
      case "correo":
        setCorreo(value);
        break;
      case "contrasena":
        setContrasena(value);
        break;
      default:
        break;
    }
  };

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!correo) {
      validationErrors.correo = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(correo)) {
      validationErrors.correo = "Ingrese un correo electrónico válido";
    }

    if (!contrasena) {
      validationErrors.contrasena = "La contraseña es obligatoria";
    } else if (contrasena.length < 8) {
      validationErrors.contrasena = "La contraseña debe tener al menos 8 caracteres";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const results = await login({ correo, contrasena });
        if (results.status === 200) {
          localStorage.setItem("userId", results.userId);

          Swal.fire({
            title: '¡Bienvenido!',
            text: 'Has iniciado sesión correctamente',
            icon: 'success',
            showConfirmButton: true,
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#70AA68',
            timer: 2000,
            timerProgressBar: true,
            customClass: {
              popup: 'swal2-show',
              title: 'text-lg font-semibold',
              confirmButton: 'px-4 py-2 rounded-lg'
            }
          });
          
          navigate("/");
          
          if (isChecked) {
            localStorage.setItem("correo", correo);
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("correo");
            localStorage.removeItem("rememberMe");
          }
        } else {
          throw new Error(results.message);
        }
      } catch (error) {
        Swal.fire({
          title: 'Error de acceso',
          text: error.message || 'No se pudo iniciar sesión. Por favor, verifica tus credenciales.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#70AA68',
          timer: 2000,
          timerProgressBar: true
        });
      }
    }
  };

  return (
    <>
      <section className="ordenGeneralLogin">
        <img src={logo} alt="logo Reserva" className="imagenLogo" />
        <h2 className="tituloLogin">
          Bienvenido, por favor inicie sesión para continuar
        </h2>
        <form className="loginForm" onSubmit={handleSubmit}>
          <article className="inputOrden" style={{ width: '100%', maxWidth: '400px' }}>
            <input
              type="email"
              placeholder="Ingrese su correo electrónico"
              className="inputLogin"
              value={correo}
              onChange={handleChange}
              name="correo"
              maxLength={50}
              style={{ width: '100%', marginBottom: '15px' }}
            />
            {errors.correo && (
              <p className="errorLogin">{errors.correo}</p>
            )}
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              className="inputLogin"
              value={contrasena}
              onChange={handleChange}
              name="contrasena"
              maxLength={30}
              style={{ width: '100%', marginBottom: '15px' }}
            />
            {errors.contrasena && (
              <p className="errorLogin">{errors.contrasena}</p>
            )}
            <div className="ordenInputCasillas" style={{ width: '100%', marginBottom: '15px' }}>
              <label className="casillaLogin">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="inputCasilla"
                />
                Recordarme
              </label>
            </div>
            <button 
              type="submit" 
              className="botonLogin"
              style={{ 
                width: '100%',
                height: '45px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#70AA68',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5C8F55'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#70AA68'}
            >
              Iniciar sesión
            </button>
          </article>
        </form>
      </section>
    </>
  );
};
