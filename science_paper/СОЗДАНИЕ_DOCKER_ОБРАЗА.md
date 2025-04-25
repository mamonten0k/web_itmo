# СОЗДАНИЕ DOCKER-ОБРАЗА

Для обеспечения портативности и воспроизводимости веб-сервиса для оценки метрик Web-Vitals был разработан Docker-образ, который инкапсулирует все необходимые зависимости и конфигурации. В данном разделе описывается процесс создания Docker-образа и его конфигурация.

## Требования к Docker-образу

При разработке Docker-образа были учтены следующие требования:

1. **Минимальный размер**: Образ должен содержать только необходимые компоненты для работы веб-сервиса.
2. **Безопасность**: Образ должен быть защищен от известных уязвимостей.
3. **Воспроизводимость**: Образ должен обеспечивать идентичное окружение при каждом запуске.
4. **Эффективность**: Образ должен быть оптимизирован для быстрого запуска и минимального потребления ресурсов.
5. **Поддержка Chrome/Puppeteer**: Образ должен включать Chrome и Puppeteer для анализа веб-страниц.

## Структура Dockerfile

Для создания Docker-образа был разработан следующий Dockerfile:

```dockerfile
# Используем Node.js в качестве базового образа
FROM node:20-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости для Chrome и Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем переменные окружения для Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "run", "serve"]
```

## Особенности реализации

### Выбор базового образа

В качестве базового образа был выбран `node:20-slim`, который обеспечивает:
- Актуальную версию Node.js (20.x)
- Минимальный размер образа благодаря варианту "slim"
- Совместимость с большинством npm-пакетов

### Установка Chrome и Puppeteer

Для работы с Lighthouse и анализа веб-страниц необходимы Chrome и Puppeteer. В Dockerfile:
- Устанавливается Chromium вместо полной версии Chrome для уменьшения размера образа
- Настраиваются переменные окружения для использования системного Chromium вместо загрузки отдельной копии
- Устанавливаются необходимые шрифты для корректного отображения различных языков

### Оптимизация установки зависимостей

Для оптимизации процесса сборки и размера образа:
- Используется `npm ci` вместо `npm install` для детерминированной установки зависимостей
- Флаг `--only=production` исключает установку dev-зависимостей
- Копирование `package.json` и `package-lock.json` выполняется отдельно от основного кода для лучшего использования кэша Docker

### Многоэтапная сборка

Для дальнейшей оптимизации размера образа можно использовать многоэтапную сборку:

```dockerfile
# Этап сборки
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Этап production
FROM node:20-slim
WORKDIR /app
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "run", "serve"]
```

Этот подход позволяет:
- Использовать полный образ Node.js для сборки
- Использовать минимальный образ для production
- Копировать только необходимые файлы из этапа сборки

## Конфигурация Docker Compose

Для упрощения запуска и управления веб-сервисом был разработан файл Docker Compose:

```yaml
version: '3.8'

services:
  web-vitals:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```

### Особенности конфигурации Docker Compose

1. **Проброс портов**: Порт 3000 контейнера проброшен на порт 3000 хоста для доступа к веб-сервису.
2. **Переменные окружения**: Установлена переменная `NODE_ENV=production` для оптимизации работы Node.js.
3. **Политика перезапуска**: Контейнер будет автоматически перезапускаться в случае сбоя (`restart: unless-stopped`).
4. **Проверка работоспособности**: Настроен healthcheck для мониторинга работоспособности сервиса.

## Конфигурация для удаленного сервера

Для развертывания на удаленном сервере был создан отдельный файл `server-docker-compose.yml`:

```yaml
version: '3.8'

services:
  web-vitals:
    image: ${DOCKER_USERNAME}/science_paper:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```

Основные отличия от локальной конфигурации:
- Использование готового образа из Docker Hub вместо локальной сборки
- Использование переменной `${DOCKER_USERNAME}` для указания имени пользователя Docker Hub

## Оптимизация Docker-образа

Для оптимизации Docker-образа были применены следующие техники:

1. **Минимизация слоев**: Объединение команд RUN для уменьшения количества слоев.
2. **Очистка кэша**: Удаление кэша apt и временных файлов после установки пакетов.
3. **Использование .dockerignore**: Исключение ненужных файлов из контекста сборки.

Содержимое файла `.dockerignore`:

```
node_modules
npm-debug.log
Dockerfile
