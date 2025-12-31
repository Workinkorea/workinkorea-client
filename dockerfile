# workinkorea-client Dockerfile
# multi-stage build

FROM node:20-alpine AS base

# 1. 의존성 설치
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
# install 대신 ci 사용 
# 빌드 시점마다 다른 버전이 설치되는 것을 방지
RUN npm ci 


# 2. 빌드
FROM base AS builder


WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 환경변수 설정
ARG NEXT_PUBLIC_API_URL
ARG BACKEND_API_URL=http://localhost:8000

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV BACKEND_API_URL=$BACKEND_API_URL

RUN npm run build

RUN npm run build


# 3. 실행
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# 리눅스 그룹과 유저 생성
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# runner 이미지에 추가해주기 위해 복사
COPY --from=builder /app/public ./public

# 필요한 파일만 포함 'standalone' 옵션 사용
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 리눅스 사용자
USER nextjs

ENV PORT=3000
EXPOSE 3000

ENV BACKEND_API_URL=""

# 'standalone' 옵션 사용 시 server.js 사용
CMD ["node", "server.js"]