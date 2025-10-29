# Use a lightweight Go image
FROM golang:1.16-alpine

# Set the working directory
WORKDIR /app

# Copy go.mod and go.sum first to leverage Docker cache
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the code
COPY . .

# Build the Go app
RUN go build -o api .

# Expose the application port
EXPOSE 8080

# Command to run the executable
CMD ["./api"]
