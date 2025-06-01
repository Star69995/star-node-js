# Star Node.js Backend

This is the backend service for the **Star Fullstack Application**, built using Node.js.

## Features

- RESTful API endpoints
- Database integration
- Authentication and authorization
- Error handling and logging
- Scalable architecture

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A running instance of the database (e.g., MongoDB, PostgreSQL)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Star69995/star-node-js.git
    cd star-node-js
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and configure the following:
    ```
    PORT=3000
    DATABASE_URL=your-database-url
    JWT_SECRET=your-secret-key
    ```

## Usage

### Development

Start the server:
```bash
npm run dev
```

## Scripts

- `npm run dev`: Start the server with hot-reloading.
- `npm start`: Start the server.



## User API Endpoints

| No. | URL           | Method | Authorization               | Action                   | Note                | Returns           |
|-----|---------------|--------|-----------------------------|--------------------------|---------------------|-------------------|
| 1   | /users        | POST   | All                         | Register user            | Unique email        | New user          |
| 2   | /users/login  | POST   | All                         | Login                    |                     | Encrypted token   |
| 3   | /users        | GET    | Admin                       | Get all users            |                     | Array of users    |
| 4   | /users/:id    | GET    | Registered user or admin    | Get user                 |                     | User              |
| 5   | /users/:id    | PUT    | Registered user             | Edit user                |                     | User              |
| 6   | /users/:id    | PATCH  | Registered user             | Change isBusiness status |                     | User              |
| 7   | /users/:id    | DELETE | Registered user or admin    | Delete user              |                     | Deleted user      |

### Endpoint Descriptions

1. **POST `/users`**  
   Register a new user.  
   **Authorization:** Anyone  
   **Note:** Requires unique email  
   **Returns:** Newly created user object

2. **POST `/users/login`**  
   Log in as a user.  
   **Authorization:** Anyone  
   **Returns:** Encrypted authentication token

3. **GET `/users`**  
   Retrieve all users.  
   **Authorization:** Admin only  
   **Returns:** Array of user objects

4. **GET `/users/:id`**  
   Retrieve a user by ID.  
   **Authorization:** Registered user or admin  
   **Returns:** User object

5. **PUT `/users/:id`**  
   Update user details.  
   **Authorization:** The registered user  
   **Returns:** Updated user object

6. **PATCH `/users/:id`**  
   Change `isBusiness` status of the user.  
   **Authorization:** The registered user  
   **Returns:** Updated user object

7. **DELETE `/users/:id`**  
   Delete a user by ID.  
   **Authorization:** Registered user or admin  
   **Returns:** Deleted user object

# Cards API Endpoints

| No. | URL              | Method | Authorization                            | Action               | Return               |
|-----|------------------|--------|------------------------------------------|----------------------|----------------------|
| 1   | `/cards`         | GET    | All                                      | All cards            | Array of 2 cards     |
| 2   | `/cards/my-cards`| GET    | The registered user                      | Get user cards       | Array of cards       |
| 3   | `/cards/:id`     | GET    | All                                      | Get card             | Card                 |
| 4   | `/cards`         | POST   | Business user                            | Create new card      | Card                 |
| 5   | `/cards/:id`     | PUT    | The user who created the card            | Edit card            | Card                 |
| 6   | `/cards/:id`     | PATCH  | A registered user                        | Like card            | Card                 |
| 7   | `/cards/:id`     | DELETE | The user who created the card or admin   | Delete card          | Deleted card         |

---

## Endpoint Descriptions

### Endpoint Descriptions

1. **GET `/cards`**  
   Retrieve all cards.  
   **Authorization:** Anyone  
   **Returns:** Array of 2 cards

2. **GET `/cards/my-cards`**  
   Retrieve all cards created by the logged-in user.  
   **Authorization:** Registered user  
   **Returns:** Array of cards

3. **GET `/cards/:id`**  
   Retrieve a card by its ID.  
   **Authorization:** Anyone  
   **Returns:** A card object

4. **POST `/cards`**  
   Create a new card.  
   **Authorization:** Business user  
   **Returns:** Newly created card object

5. **PUT `/cards/:id`**  
   Edit an existing card.  
   **Authorization:** The user who created the card  
   **Returns:** Updated card object

6. **PATCH `/cards/:id`**  
   Like a card.  
   **Authorization:** Registered user  
   **Returns:** Updated card object

7. **DELETE `/cards/:id`**  
   Delete a card.  
   **Authorization:** The user who created the card or an admin  
   **Returns:** Deleted card object
