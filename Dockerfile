# ETAPA 1: Construcción (Node.js 22 - La versión que pide Vite)
FROM node:22-alpine AS build-stage
WORKDIR /app

# El resto se queda igual...
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ETAPA 2: Servidor (Nginx)
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
# Usamos /app/dist que es la carpeta que genera Vite por defecto
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]