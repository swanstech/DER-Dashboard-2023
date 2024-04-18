# # Use an official Node runtime as a parent image
# FROM node:16

# #AWS credentials
# ENV AWS_ACCESS_KEY_ID=AKIAXNKZET2FRUOO6NJY
# ENV AWS_SECRET_ACCESS_KEY=N8c1VivIbIk1nFPdKlV7NQbiUURAuDhIltg50GUbc

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Copy the current directory contents into the container at /usr/src/app
# COPY . .

# # Install any needed packages specified in package.json
# RUN npm install

# #Install Python and required packages
# RUN apt-get update && apt-get install -y python3 python3-pip \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*
# # RUN apt-get install python3.10

# # Install Python packages
# RUN pip3 install pymodbus boto3 AWSIoTPythonSDK

# # Build the Next.js application
# RUN npm run build

# # Make port 3000 available to the world outside this container
# EXPOSE 3000

# # Run the app when the container launches
# CMD ["npm", "start"]

# Use an official Node runtime as a parent image
# FROM node:16

# # Install system dependencies
# RUN apt-get update && apt-get install -y \
#     curl \
#     build-essential \
#     libssl-dev \
#     zlib1g-dev \
#     libbz2-dev \
#     libreadline-dev \
#     libsqlite3-dev \
#     wget \
#     curl \
#     llvm \
#     libncurses5-dev \
#     libncursesw5-dev \
#     xz-utils \
#     tk-dev \
#     libffi-dev \
#     liblzma-dev \
#     python-openssl \
#     git\
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# # Install pyenv
# RUN curl https://pyenv.run | bash

# # Add pyenv to PATH
# ENV PYENV_ROOT="/root/.pyenv"
# ENV PATH="$PYENV_ROOT/bin:$PATH"

# # Install Python 3.8.10
# RUN pyenv install 3.8.10

# # Set Python 3.8.10 as the global version
# RUN pyenv global 3.8.10

# # Update PATH to include pyenv shims
# ENV PATH="$PYENV_ROOT/shims:$PATH"

# # Activate Python 3.8.10 environment
# RUN eval "$(pyenv init --path)"

# # Install pip3
# RUN python3 -m ensurepip

# # Set environment variables for AWS credentials
# ENV AWS_ACCESS_KEY_ID=AKIAXNKZET2FRUOO6NJY
# ENV AWS_SECRET_ACCESS_KEY=N8c1VivIbIk1nFPdKlV7NQbiUURAuDhIltg50GUbc

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Copy the current directory contents into the container at /usr/src/app
# COPY . .

# # Install any needed packages specified in package.json
# RUN npm install

# # Install Python packages
# RUN pip3 install pymodbus==2.4.0 boto3==1.34.72 AWSIoTPythonSDK

# # Print Python version
# RUN python3 --version

# RUN pip3 list

# # Build the Next.js application
# RUN npm run build

# # Make port 3000 available to the world outside this container
# EXPOSE 3000

# # Run the app when the container launches
# CMD ["npm", "start"]

# Use an official Node runtime as a parent image
FROM node:16

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libssl-dev \
    zlib1g-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    wget \
    curl \
    llvm \
    libncurses5-dev \
    libncursesw5-dev \
    xz-utils \
    tk-dev \
    libffi-dev \
    liblzma-dev \
    python-openssl \
    git\
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pyenv
RUN curl https://pyenv.run | bash

# Add pyenv to PATH
ENV PYENV_ROOT="/root/.pyenv"
ENV PATH="$PYENV_ROOT/bin:$PATH"

# Install Python 3.8.10
RUN pyenv install 3.8.10

# Set Python 3.8.10 as the global version
RUN pyenv global 3.8.10

# Update PATH to include pyenv shims
ENV PATH="$PYENV_ROOT/shims:$PATH"

# Activate Python 3.8.10 environment
RUN eval "$(pyenv init --path)"

# Install pip3
RUN python3 -m ensurepip

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Install Python packages
RUN pip3 install pymodbus==2.4.0 boto3==1.34.72 AWSIoTPythonSDK \
    certifi chardet idna urllib3
# Print Python version
RUN python3 --version

RUN pip3 list

# Build the Next.js application
RUN npm run build

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["npm", "start"]



