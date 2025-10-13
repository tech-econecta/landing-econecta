# Guía de Despliegue - Econecta.io

## 📋 Resumen de Configuraciones Actualizadas

Se han actualizado las siguientes configuraciones para un despliegue correcto:

### 1. **docker-compose.yml**

- ✅ Ahora expone puerto 80 (HTTP) y 443 (HTTPS)
- ✅ Configuración de certbot para SSL automático

### 2. **Dockerfile**

- ✅ Build multi-etapa optimizado
- ✅ Modo standalone para menor tamaño de imagen
- ✅ Usuario no-root para mayor seguridad
- ✅ Variables de entorno configuradas

### 3. **next.config.ts**

- ✅ Output standalone habilitado
- ✅ Dominios permitidos configurados
- ✅ Headers de seguridad añadidos
- ✅ Compresión habilitada

### 4. **nginx/default.conf**

- ✅ Configurado para HTTPS (puerto 443)
- ✅ Configurado para HTTP (puerto 80 con redirección a HTTPS)
- ✅ Optimizado con caché para archivos estáticos
- ✅ Headers de seguridad configurados
- ⚠️ **NOTA**: Necesitas obtener certificados SSL antes de que funcione HTTPS

---

## 🚀 Pasos para Desplegar en el Servidor

### Paso 1: Subir los Archivos Actualizados al Servidor

```bash
# Desde tu máquina local, sube los archivos al servidor
scp -r docker-compose.yml Dockerfile next.config.ts nginx/ root@74.50.88.2:/ruta/del/proyecto/
```

O si usas Git:

```bash
# Haz commit de los cambios
git add .
git commit -m "Actualizar configuraciones de despliegue"
git push

# En el servidor, haz pull de los cambios
ssh root@74.50.88.2
cd /ruta/del/proyecto
git pull
```

### Paso 2: Reconstruir y Reiniciar los Contenedores

```bash
# Conectarte al servidor
ssh root@74.50.88.2

# Navegar al directorio del proyecto
cd /ruta/del/proyecto

# Detener los contenedores actuales
docker-compose down

# Reconstruir las imágenes (importante después de cambiar Dockerfile)
docker-compose build --no-cache

# Iniciar los contenedores
docker-compose up -d

# Verificar que estén corriendo
docker-compose ps
```

### Paso 3: Verificar los Logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs solo de la app
docker-compose logs -f app

# Ver logs solo de nginx
docker-compose logs -f nginx
```

### Paso 4: Obtener Certificados SSL

Una vez que los contenedores estén corriendo y el dominio apunte correctamente:

```bash
# Obtener certificados SSL para econecta.io y www.econecta.io
docker-compose run --rm certbot certonly --webroot \
  --webroot-path /var/www/certbot \
  --email tu-email@ejemplo.com \
  --agree-tos \
  --no-eff-email \
  -d econecta.io \
  -d www.econecta.io
```

### Paso 5: Activar HTTPS en Nginx

Después de obtener los certificados SSL:

1. Edita `nginx/default.conf`
2. Descomenta las líneas del bloque HTTPS (líneas 74-108)
3. Reinicia nginx:

```bash
docker-compose restart nginx
```

---

## 🔍 Verificaciones

### Verificar que los DNS están propagados:

```bash
# Desde cualquier máquina
nslookup econecta.io
nslookup www.econecta.io

# Deberían devolver: 74.50.88.2
```

### Verificar que los puertos están abiertos:

```bash
# Verificar puerto 80
curl -I http://econecta.io

# Verificar puerto 443 (después de configurar SSL)
curl -I https://econecta.io
```

### Verificar contenedores:

```bash
# Ver contenedores corriendo
docker-compose ps

# Deberías ver:
# - app (running)
# - nginx (running)
# - certbot (running)
```

---

## 🐛 Solución de Problemas

### Problema: "Connection refused" al acceder al dominio

**Causa**: Los contenedores no están corriendo o los puertos no están abiertos.

**Solución**:

```bash
# Verificar que los contenedores estén corriendo
docker-compose ps

# Verificar firewall del servidor
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Problema: "502 Bad Gateway"

**Causa**: Nginx no puede conectarse a la aplicación Next.js.

**Solución**:

```bash
# Ver logs de la app
docker-compose logs app

# Verificar que la app esté escuchando en puerto 3000
docker-compose exec app netstat -tuln | grep 3000
```

### Problema: El sitio carga pero las imágenes no

**Causa**: Configuración de Next.js para imágenes.

**Solución**: Ya está configurado en `next.config.ts`, pero verifica que uses `next/image` correctamente.

### Problema: Certificados SSL no se generan

**Causa**: El dominio no está apuntando correctamente o Let's Encrypt no puede validar.

**Solución**:

```bash
# Verificar que nginx esté sirviendo en puerto 80
curl -I http://econecta.io/.well-known/acme-challenge/test

# Ver logs de certbot
docker-compose logs certbot
```

---

## 📊 Comandos Útiles

```bash
# Ver estado de todos los servicios
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar un servicio específico
docker-compose restart nginx

# Reconstruir y reiniciar todo
docker-compose down && docker-compose build --no-cache && docker-compose up -d

# Limpiar imágenes antiguas
docker image prune -a

# Ver uso de recursos
docker stats

# Entrar a un contenedor
docker-compose exec app sh
```

---

## 🔒 Seguridad

### Configuraciones de seguridad ya implementadas:

- ✅ Usuario no-root en el contenedor
- ✅ Headers de seguridad en Next.js
- ✅ Preparado para SSL/TLS
- ✅ Renovación automática de certificados SSL

### Recomendaciones adicionales:

1. **Firewall**: Asegúrate de que solo los puertos 80, 443 y SSH estén abiertos
2. **Variables de entorno**: Usa archivos `.env` para secretos (no los incluyas en el código)
3. **Backups**: Configura backups automáticos de tu base de datos y certificados SSL
4. **Monitoreo**: Considera usar herramientas como Portainer o Grafana para monitoreo

---

## 📝 Notas Finales

- Los DNS pueden tardar hasta 48 horas en propagarse completamente (aunque usualmente es más rápido)
- Los certificados SSL de Let's Encrypt se renuevan automáticamente cada 90 días
- El modo `standalone` de Next.js reduce el tamaño de la imagen Docker significativamente
- Los logs de los contenedores se pueden ver con `docker-compose logs`

---

## 🆘 Soporte

Si tienes problemas, revisa:

1. Logs de los contenedores: `docker-compose logs -f`
2. Estado de los servicios: `docker-compose ps`
3. DNS propagación: https://dnschecker.org
4. Firewall del servidor: `sudo ufw status`
