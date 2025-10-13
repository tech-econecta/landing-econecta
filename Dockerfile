# Usar una imagen base oficial de Node.js
FROM node:22-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Construir la aplicación Next.js para producción
RUN npm run build

# Exponer el puerto en el que corre la app
EXPOSE 3000

# El comando para iniciar la aplicación
CMD [ "npm", "start" ]
