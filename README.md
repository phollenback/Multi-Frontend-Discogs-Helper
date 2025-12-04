# Grailtopia - Application Overview

Test it out <a href="https://grail-topia.com">HERE</a>

Grailtopia is a production-ready, full-stack web application deployed on AWS EC2 with a fully automated CI/CD pipeline powered by GitHub Actions. The deployment workflow automatically runs comprehensive unit and integration tests using Jest before deploying to production, ensuring code quality and reliability. The application is containerized using Docker Compose with a multi-service architecture including a MySQL 8.0 database, Node.js/Express.js TypeScript backend API, and React frontend served via Nginx. The deployment process handles SSL/TLS certificate management through Let's Encrypt, configures Nginx as a reverse proxy, and orchestrates all services with health checks and dependency management. The entire deployment completes in under two minutes, with the workflow automatically pulling the latest code, building Docker images, starting containers, and verifying service health before marking the deployment as successful.

The application features a complete OAuth 1.0a implementation for secure integration with the Discogs API, allowing users to authenticate and sync their vinyl record collections and wantlists directly from their Discogs accounts. This OAuth integration enables advanced features such as real-time price suggestions from the Discogs marketplace, which provides condition-based pricing data (Mint, Near Mint, Very Good, etc.) to help collectors make informed purchasing decisions. Users can track their collection's total value through the Discogs API, which calculates minimum, median, and maximum estimated values based on current marketplace data. Additional features include personalized release recommendations based on user preferences, a social networking system for following other collectors and artists, comprehensive search functionality across the Discogs database, and detailed release pages with track listings, statistics, and metadata. The application also supports manual record entry for items not in the Discogs database, custom folder organization, rating and ranking systems, and price threshold alerts for wantlist items.

The codebase maintains high code quality through comprehensive test coverage, with unit tests for individual components and integration tests for API endpoints and database operations. The backend follows a layered architecture pattern with clear separation between controllers, data access objects (DAOs), services, and models, all written in TypeScript for type safety. The frontend consists of 35+ reusable React components with a custom CSS variable-based theme system that provides a consistent, modern user experience across all pages. The application is fully responsive, supporting mobile, tablet, and desktop devices, and includes features such as user profiles, collection management, wantlist tracking, artist and label following, and a personalized discovery system. All user data is securely stored in a normalized MySQL database with proper indexing for optimal query performance, and the application implements JWT-based authentication with role-based access control for secure user sessions and admin functionality.

# Key Technology in this Project

## Frontend Technologies

### React 18 & React Router
Built the entire user interface using React 18 with React Router DOM for client-side routing. The application consists of 35+ reusable components that provide a seamless single-page application experience with protected routes and dynamic navigation.

### React Hook Form
Powered most forms included in the app, including login, registration, collection management, and search forms. Allowed for effortless form behavior management by providing register, handleSubmit, and validation functions tied into the forms' behavior, reducing boilerplate code and improving user experience.

### Context API & React Cookies
Utilized React Context API to create a global authentication state management system. This includes cookie management using the react-cookie library to persist user sessions across page refreshes, enabling seamless authentication flow and route protection throughout the application.

### Custom CSS Theme System
Developed a comprehensive CSS variable-based theme system (Grail Theme) that provides consistent styling across all components. The theme system uses CSS custom properties for colors, spacing, typography, and responsive breakpoints, enabling easy theming and maintaining design consistency.

## Backend Technologies

### TypeScript & Express.js
Built a fully type-safe backend API using TypeScript 5.6 and Express.js 4.21. The backend follows a layered architecture pattern with clear separation between controllers, data access objects (DAOs), services, and models, ensuring maintainable and scalable code structure.

### MySQL 8.0
Implemented a normalized relational database schema with 7+ tables including users, records, collections, follows, and entity follows. Designed proper indexes for optimal query performance and used parameterized queries to prevent SQL injection attacks.

### JWT Authentication
Implemented secure JSON Web Token (JWT) authentication for user sessions. The system generates tokens with user information and admin status, validates tokens on protected routes, and manages token expiration and refresh logic.

### OAuth 1.0a Implementation
Developed a complete OAuth 1.0a flow for secure integration with the Discogs API. This includes signature generation, request token exchange, access token management, and authenticated API calls, enabling users to sync their Discogs collections and wantlists securely.

## DevOps & Infrastructure

### Docker & Docker Compose
Containerized the entire application using Docker with a multi-service architecture. Docker Compose orchestrates three containers: MySQL database, Node.js API server, and React frontend served via Nginx, with health checks and service dependencies ensuring proper startup order.

### GitHub Actions CI/CD
Implemented a fully automated CI/CD pipeline that runs on every push to the main branch. The workflow executes comprehensive unit and integration tests using Jest, builds Docker images, and deploys to AWS EC2 via SSH, completing the entire process in under two minutes.

### AWS EC2 & Nginx
Deployed the production application on AWS EC2 with Nginx as a reverse proxy. Nginx handles SSL/TLS termination, routes API requests to the backend, serves static frontend files, and manages HTTP to HTTPS redirects for secure connections.

### Let's Encrypt SSL/TLS
Integrated Let's Encrypt certificate management for production HTTPS. The deployment workflow automatically obtains and renews SSL certificates, ensuring secure encrypted connections for all user data and API communications.

## Testing & Quality Assurance

### Jest & TypeScript Testing
Comprehensive test suite using Jest with ts-jest for TypeScript support. Implemented both unit tests for individual functions and components, and integration tests for API endpoints and database operations, ensuring code reliability and preventing regressions.

## API Integration

### Axios
Standard HTTP request library used throughout both frontend and backend. Axios provides easy-to-use, readable request code to utilize backend services and the Discogs API. It's particularly helpful because it easily provides useful error messages and allows for extra complexity when necessary, especially when leveraging third-party services like the Discogs API.

### Discogs REST API
Leveraged the Discogs API to manage personal collections, search vinyl releases, retrieve marketplace price suggestions, and sync user data. Implemented proper OAuth 1.0a authentication, handled rate limiting, and created robust error handling for API failures. The integration provides access to millions of vinyl records, real-time pricing data, and user collection information.

## Security

### Helmet.js & CORS
Implemented security middleware using Helmet.js to set secure HTTP headers and prevent common vulnerabilities. Configured CORS (Cross-Origin Resource Sharing) to control which domains can access the API, ensuring secure cross-origin requests.

### Environment Variables & Secrets Management
Used environment variables for sensitive configuration including database credentials, JWT secrets, OAuth keys, and API tokens. This approach keeps secrets out of the codebase and allows for different configurations across development, staging, and production environments.
