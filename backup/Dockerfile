# Frontend Dockerfile

# Use Node.js image as a parent image
FROM node:18-alpine AS build

# Set the Working Directory inside the container
WORKDIR /app

# Copy the frontend source code from the build directory to the container
COPY . /app

# Move to the frontend directory
WORKDIR /app

# Install dependencies
RUN yarn install

# Build the React app
RUN yarn build

# Use an Nginx image to serve the frontend
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
