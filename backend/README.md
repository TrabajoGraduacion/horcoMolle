# 🐾 Backend del Sistema de Gestión de Bienestar Animal para la Reserva Experimental "Horco Molle"

Este es el backend del **Sistema de Gestión de Bienestar Animal** para la Reserva Experimental "Horco Molle". Este proyecto está desarrollado utilizando **Node.js** junto con el framework **Express** y una base de datos **MongoDB** para almacenar y gestionar información sobre los animales y recintos de la reserva.

## 🚀 Características

- 🔒 **Autenticación JWT**: Permite gestionar roles de usuario (guardafauna y docentes).
- 🐘 **Gestión de Animales y Recintos**: Registra, actualiza y consulta información de animales y sus eventos clínicos.
- 🗄️ **Integración con MongoDB**: Almacena y gestiona los datos del sistema en una base de datos NoSQL.
- 📡 **API RESTful**: Provee endpoints para interactuar con el sistema de forma segura y eficiente.

## 📋 Requisitos

- Node.js (v14 o superior)
- MongoDB (local o servicio en la nube como MongoDB Atlas)

## ⚙️ Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/TrabajoGraduacion/back-tesis-horcoMolle.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd back-tesis-horcoMolle
   ```

3. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

4. Crea un archivo .env en la raíz del proyecto con las siguientes variables de entorno:

   ```bash
    URI=tu_url_de_mongodb
    JWT=tu_secreto_jwt
    PORT=
   ```

5. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

El servidor estará disponible en http://localhost:3000.

## 🧪 Pruebas

Para ejecutar las pruebas, utiliza el siguiente comando:

   ```bash
   npm run test
   ```

Esto ejecutará las pruebas definidas en el proyecto para asegurar que las funcionalidades críticas estén cubiertas.

## 📞 Contacto

Para más información, puedes contactarnos:

- Luis Eugenio Medina Raed - luiseugeniomr@gmail.com

- Marcos Isaías Padrós - Isaiaspadros2@gmail.com
