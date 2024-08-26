# Backend Dockerfile

# Use an official Golang runtime as a parent image
FROM golang:1.22.6-alpine AS build

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy the backend source code from the build directory to the container
COPY . /app

# Move to the backend directory if your Go files are there
WORKDIR /app/backend

ENV CGO_ENABLED=1
RUN apk add --no-cache gcc musl-dev
# Download dependencies
RUN go mod download

# Build the Go app
RUN go build -ldflags='-s -w -extldflags "-static"' -o main .

# Start a new stage from scratch
FROM alpine:latest

# Copy the Pre-built binary file from the build stage
COPY --from=build /app/backend/main /app/main
COPY --from=build /app/backend/.env /app/.env

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["/app/main"]
