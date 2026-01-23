# Etapa 1: Dependencias
FROM node:23-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm install

# Etapa 2: Construcción (Aquí es donde definimos el alias "builder")
FROM node:23-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Etapa 3: Producción (Runner)
FROM node:23-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NODE_OPTIONS="--max-old-space-size=128"
ENV PORT 3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos el standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copiamos los estáticos a la ruta que Next.js busca por defecto
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]