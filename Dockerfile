FROM oven/bun:1.3.10 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN bun install --frozen-lockfile

FROM deps AS build
ARG DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/hr_easy?schema=public
ENV DATABASE_URL=${DATABASE_URL}
COPY . .
RUN bunx prisma generate
RUN bun run build

FROM oven/bun:1.3.10 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=build /app/public ./public
COPY --from=build /app/generated ./generated
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

CMD ["bun", "server.js"]