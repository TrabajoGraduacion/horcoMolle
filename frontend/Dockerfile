# Etapa de construcción
FROM node:18-slim AS build

WORKDIR /app

# Configurar variables de entorno para asegurar que se instalen todas las dependencias
ENV NODE_ENV=development

# Copiar solo package.json primero para mejorar el caching
COPY package.json ./

# Instalar todas las dependencias, incluyendo devDependencies
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && \
    npm cache clean --force && \
    npm install

# Copiar el código fuente
COPY . .

# Reinstalar esbuild específicamente para Linux
RUN npm uninstall esbuild && \
    npm install esbuild@0.18.20 @esbuild/linux-x64 --force && \
    npm install @rollup/rollup-linux-x64-gnu

# Cambiar a modo producción para el build
ENV NODE_ENV=production
ENV VITE_USER_NODE_ENV=production

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine

# Copiar la configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]