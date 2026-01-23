# Etapa 1: Instalación de dependencias
FROM node:23-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiamos archivos de dependencias
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install

# Etapa 2: Construcción
FROM node:23-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desactivamos telemetría de Next.js durante el build
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Etapa 3: Ejecución (Standalone)
FROM node:23-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Aquí forzamos el límite de RAM que querías (128MB)
ENV NODE_OPTIONS="--max-old-space-size=128"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos solo lo necesario del modo standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Ejecutamos el servidor directamente
CMD ["node", "server.js"]