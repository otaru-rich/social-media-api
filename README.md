
# Social Media API

This is the backend API for the social media platform. It provides endpoints for user management, post management, likes, comments, and search functionalities.

## Prerequisites

Before running the project API, make sure you have the following prerequisites installed on your system:

- Node.js (version 18.16.0 or higher)
- MongoDB (version 6.0.X or higher)
## Project directory structure
```
social-media-api/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── comment.controller.ts
│   │   ├── follow.controller.ts
│   │   ├── like.controller.ts
│   │   ├── post.controller.ts
│   │   ├── search.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── models/
│   │   ├── comment.model.ts
│   │   ├── follow.model.ts
│   │   ├── like.model.ts
│   │   ├── post.model.ts
│   │   └── user.model.ts
│   ├── routes/
│   │   ├── post.routes.ts
│   │   ├── search.routes.ts
│   │   ├── user.routes.ts
│   │   └── routes.ts
│   ├── services/
│   │   ├── comment.service.ts
│   │   ├── follow.service.ts
│   │   ├── like.service.ts
│   │   ├── post.service.ts
│   │   └── search.service.js
│   ├── tests/
│   │   ├── auth.test.ts
│   │   ├── comment.test.ts
│   │   ├── follow.test.ts
│   │   ├── post.test.ts
│   │   └── search.test.ts
│   ├── types/
│   │   └── type.ts
│   ├── utils/
│   │   ├── errorHandler.ts
│   │   ├── logger.ts
│   │   └── response.ts
│   └── index.js
├── .env.example
├── .eslintrc.json
├── jest.config.js
├── package.json
├── package-lock.json
├── .README.md
├── social_media_api.postman_collection.json
└── tsconfig.json
```

 Here's the breakdown of the main directories and files in the `social-media-api`:

- `controllers/`: Contains the controller files responsible for handling the business logic of each module or functionality (e.g., user, post, like, comment).
- `models/`: Contains the model files defining the database schemas and interacting with the database.
- `routes/`: Contains the route files defining the API endpoints and their corresponding controller methods.
- `middleware/`: Contains the middleware files for handling authentication, error handling, and other middleware functionalities.
- `tests/`: Contains the unit test files for each module or functionality.
- `index.js`: The entry point of the application where the server and middleware are configured.
- `database.js`: Contains configuration variables or settings for the project.
- `package.json` and `package-lock.json`: Files for managing project dependencies and scripts.
- `.env`: The environment variable file for storing sensitive or configuration-specific information.
- `social_media_api.postman_collection.json`: The postman collection documentation, import it in postman software tool.
- `README.md`: The README file providing instructions, documentation, and other details about the project.

## Getting Started

To get started with the project API, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/otaru-rich/social-media-api.git
   ```

2. Install the dependencies:

   ```bash
   cd social-media-api
   npm install
   ```

3. Set up the environment variables:

    - Create a `.env` file in the root directory of the project.
    - Define the required environment variables in the `.env` file. For example:

      ```dotenv
      PORT=9000
      DB_URI=mongodb://localhost:27017/project-db
      JWT_SECRET=mysecretkey
      ```

      Replace the values with your desired configuration.

4. Start the API server:

   ```bash
   npm start
   ```

   The server will start running on the specified port (default is 9000) and connect to the MongoDB database.

5. The API is now ready to accept requests. You can use Postman routes collection in the root dir or cURL to make HTTP requests to the API endpoints.

## Testing

To run the unit tests for the project API, follow these steps:

1. Make sure you have the project dependencies installed (step 2 in the "Getting Started" section).

2. Run the following command:

   ```bash
   npm test
   ```

   The unit tests will be executed, and the results will be displayed in the console.

## API Documentation

The API documentation is available at [link-to-documentation](https://link-to-documentation). It provides detailed information about the available endpoints, request/response formats, and authentication requirements.

## Contribution

If you would like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature/bug fix.
3. Make the necessary changes and commit them.
4. Push your changes to your forked repository.
5. Submit a pull request with a clear description of the changes.

## Contact

For any inquiries or support, please contact [richotaru@gmail.com](mailto:your-email-address).
