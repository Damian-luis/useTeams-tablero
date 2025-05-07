FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 3007

ENV PORT 3007
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "run", "dev"] 