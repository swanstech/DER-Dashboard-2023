# DER Dashboard 2023

## Overview

The DER Dashboard 2023 is a comprehensive dashboard application designed to monitor Distributed Energy Resources (DER) devices. Built with TypeScript and powered by AWS RDS, the application offers a robust and scalable solution for real-time monitoring and management of DER devices.

## Features

- **Real-Time Monitoring:** Get live updates on the status of your DER devices.
- **Command Center:** A centralized interface for controlling and managing DER devices.
- **Device Setup:** Easily configure device information, hardware, network, and software settings.
- **Authentication:** Secure access to the dashboard using NextAuth.
- **Database:** Utilizes AWS RDS for reliable and scalable data storage.
- **API Integration:** Leverages Amazon API Gateway for secure and efficient API calls to the database.
- **Stats View:** Visualize key performance indicators through various statistical cards.

## Technologies Used

- TypeScript
- Next.js
- AWS RDS
- NextAuth
- Prisma ORM
- Amazon API Gateway

## Getting Started

### Prerequisites

- Node.js
- AWS RDS instance
- Amazon API Gateway
- Yarn or npm

### Installation

1. Clone the repository.

2. Navigate to the project directory.

3. Install dependencies.

4. Set up environment variables for AWS RDS, NextAuth, and Amazon API Gateway in a `.env` file.

5. Run the development server.

### File Structure

- `next.config.mjs`: Next.js configuration file.
- `package.json`: Lists package dependencies.
- `prisma/schema.prisma`: Prisma ORM schema for the database.
- `src/`: Contains the source code for the application.
  - `components/`: Reusable UI components.
  - `pages/`: Next.js pages and API routes.
  - `server/`: Server-side logic for authentication and database.

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.

## Acknowledgments

- Next.js
- AWS RDS
- NextAuth
- Prisma
- Amazon API Gateway
