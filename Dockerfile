# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Python and required packages
RUN apt-get update && apt-get install -y python3 python3-pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy all files from the current directory into the container
COPY . .

# Copy the Python files from the der-dashboard-demo directory into the container
COPY /home/sysadmin_arnav/Desktop/DER_Dashboard/der-dashboard-demo /usr/src/app/python_files

# Expose the port used by the application
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
