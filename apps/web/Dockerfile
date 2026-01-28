# apps/web/Dockerfile
FROM oven/bun:1 AS runner
WORKDIR /app

# We copy the pre-built output from the host machine
# This bypasses the build errors in the Docker environment
COPY apps/web/.output ./.output
COPY apps/web/package.json ./

EXPOSE 3000
CMD ["bun", "run", ".output/server/index.mjs"]
