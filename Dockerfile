# Etapa 3: Ejecución (Standalone)
FROM node:23-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NODE_OPTIONS="--max-old-space-size=128"
ENV HOSTNAME "0.0.0.0"
ENV PORT 3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 1. Copiamos el servidor standalone a la raíz de /app
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# 2. IMPORTANTE: Los estáticos deben ir dentro de .next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]