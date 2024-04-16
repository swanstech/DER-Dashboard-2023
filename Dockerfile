# Use an official Node runtime as a parent image
FROM node:16

#AWS credentials
ENV AWS_ACCESS_KEY_ID=AKIAXNKZET2FRUOO6NJY
ENV AWS_SECRET_ACCESS_KEY=N8c1VivIbIk1nFPdKlV7NQbiUURAuDhIltg50GUbc

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Install Python and required packages
# RUN apt-get update && apt-get install -y python3 python3-pip \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

RUN apt-get update \
    && apt-get install -y python3.9 python3.9-distutils python3.9-dev python3-pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
# Install Python packages
RUN pip3 install pymodbus boto3 AWSIoTPythonSDK

# Build the Next.js application
RUN npm run build

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["npm", "start"]
