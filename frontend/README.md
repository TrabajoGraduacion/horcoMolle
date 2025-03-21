# 🎨 Frontend del Sistema de Gestión de Bienestar Animal para la Reserva Experimental "Horco Molle"

Este es el frontend del **Sistema de Gestión de Bienestar Animal** para la Reserva Experimental "Horco Molle". Este proyecto está desarrollado utilizando **React** junto con **Vite** para una experiencia de desarrollo rápida y optimizada.

## 🚀 Características

- 🎭 **Interfaz moderna y responsive**: Diseñada con **Bootstrap** y **styled-components**.
- 🔐 **Autenticación con JWT**: Permite gestionar roles de usuario (guardafauna y docentes).
- 📊 **Visualización de datos**: Uso de **ECharts** para gráficos interactivos.
- 📸 **Carga y visualización de imágenes**: Integración con **Cloudinary**.
- 🌍 **Enrutamiento eficiente**: Implementado con **React Router DOM**.

## 📋 Requisitos

- Node.js (v14 o superior)

## ⚙️ Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/TrabajoGraduacion/front-tesis-horcoMolle.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd front-tesis-horcoMolle
   ```

3. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

La aplicación estará disponible en http://localhost:3000.

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

## 🐋 Docker

Para ejecutar la aplicación usando Docker:

1. Construir la imagen:
   ```bash
   docker build -t frontend-horcomolle .
   ```

2. Ejecutar el contenedor:
   ```bash
   docker run -p 80:80 --name horcomolle-frontend frontend-horcomolle
   ```

Comandos útiles:

```bash
# Ver logs del contenedor
docker logs horcomolle-frontend

# Detener el contenedor
docker stop horcomolle-frontend

# Eliminar el contenedor
docker rm horcomolle-frontend

# Ver contenedores en ejecución
docker ps

# Ver todos los contenedores (incluso los detenidos)
docker ps -a