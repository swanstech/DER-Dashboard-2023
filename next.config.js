/** @type {import('next').NextConfig} */
const nextConfig = {
    // Define your allowed origins (replace "*" with specific origins if possible)
    source: '*',
    headers: [
      {
        key: 'Access-Control-Allow-Origin',
        value: '*',
      },
      {
        key: 'Access-Control-Allow-Methods',
        value: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      },
      {
        key: 'Access-Control-Allow-Headers',
        value: 'Origin, X-Requested-With, Content-Type, Accept',
      },
    ],
  }

module.exports = nextConfig
