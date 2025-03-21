# 📌 Tesis HorcoMolle - Deploy

Este repositorio contiene la configuración para desplegar en producción el **Sistema de Gestión REHM**, incluyendo:  
- **Frontend** (React + Vite)  
- **Backend** (Node.js + Express)  
- **Base de datos** (MongoDB)  
- **Servidor web** (Nginx)  
- **Docker Compose** para levantar los servicios  

---

## 🚀 Requisitos  
Asegúrate de tener instalado en tu sistema:  
- [Docker](https://docs.docker.com/get-docker/)  
- [Docker Compose](https://docs.docker.com/compose/install/)  

---

## ⚙️ Configuración  

### 1️⃣ Clonar el repositorio  
```sh
git clone https://github.com/TrabajoGraduacion/tesis-horcoMolle-deploy.git
cd tesis-horcoMolle-deploy
```

### 2️⃣ Desplegar con Docker Compose  
Para levantar todos los servicios en modo producción, ejecuta:  
```sh
docker-compose up --build -d
```

> *El flag `-d` ejecuta los contenedores en segundo plano.*

Para detener los servicios:  
```sh
docker-compose down
```

---

## 🛠️ Estructura del Repositorio  
```
tesis-horcoMolle-deploy/
│── backend/      # Código del backend (Node.js + Express)
│── frontend/     # Código del frontend (React + Vite)
│── docker-compose.yml  # Configuración de Docker Compose
│── README.md     # Documentación del repositorio
```

---

## 🔥 Endpoints del Backend  
| Método | Ruta        | Descripción          |
|--------|------------|----------------------|
| GET    | `/`        | Prueba de conexión   |
| GET    | `/api/...` | Endpoints del sistema |

> *Para más detalles, revisa la documentación del backend.*

---

## 🌎 Acceso a la Aplicación  
Después de levantar los contenedores:  
- **Frontend:** `http://localhost:80`  
- **Backend:** `http://localhost:4500`  
- **MongoDB:** `mongodb://localhost:27017/horcomolle`  

### 🛡️ Cuenta de Administrador
Al iniciar la aplicación, se crea automáticamente una cuenta con las siguientes credenciales:
- **Correo:** administrador@rehm.com
- **Contraseña:** rehmdev1234

---

## 📸 Consideraciones para Implementaciones Futuras
El sistema actualmente utiliza **Cloudinary** para el almacenamiento y gestión de imágenes. En futuras implementaciones o despliegues, será necesario:

- Crear una cuenta en Cloudinary y configurar las credenciales correspondientes
- Actualizar las variables de entorno relacionadas con el servicio de imágenes
- Considerar la posibilidad de migrar a un servicio de almacenamiento local o alternativo si se requiere

> *El uso de servicios de terceros como Cloudinary puede implicar costos adicionales según el volumen de almacenamiento y transferencia de datos.*

---