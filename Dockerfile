# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Install SASS globally
RUN npm install -g sass

# Compile SASS to CSS
RUN sass scss/style.scss css/style.css

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application with node
CMD ["node", "app.js"]