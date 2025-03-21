# Usar una imagen base de Node.js oficial
FROM node:20-alpine

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json primero para aprovechar el caché de Docker
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer el puerto 4500 (corregido según el .env)
EXPOSE 4500

# Comando para iniciar la aplicación
CMD ["npm", "start"]