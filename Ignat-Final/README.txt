Final Project 
Tyo Ignat IT-2206

=========================================================================================================

Implemented features: 

1. User login/registration system
2. User session handling
3. REST API functionality: creation, update and deletion of the Objects from database using CRUD operations 
4. Different APIs for searching recipes: Recipe by API-Ninjas, Low Carb Recipes, The Cocktail DB
5. Email sendler using Nodemailer 

=========================================================================================================

How to use application: 

1. Install Node.js and necesssary packages: express, express-session, body-parser, path, axios, nodemailer, bcryptjs, multer.
You can install the packages using comand in your directory terminal: "npm install express express-session body-parser path axios nodemailer bcryptjs multer".
2. Run the "mongod" in the cmd to connect to the MongoDB.
3. Run the app using "node app.js" in your directory terminal. 
4. Open "localhost:3000" in your web browser. 

=========================================================================================================

Application design: 

When accessing localhost:3000, users are directed to the home page, where they encounter a navigation panel, a welcoming message, and listings comprising dish names,
main descriptions, three carousel images per dish, and timestamps reflecting the creation and modification of these listings, all of which are stored in MongoDB.
Below these listings, users find buttons leading to three separate pages housing recipe APIs: the Ninja Recycle API, Low Carb Recipes, and The Cocktail DB.
To access these pages, users must first log in to the site.

Two distinct user types exist: default users and admins. While all users may access and utilize all APIs, only admins possess the capability to modify home page listings by adding,
modifying, or deleting entries. Default users are restricted from accessing the Admin page.

On dedicated API search pages, users can input the desired dish or cocktail name into a designated field. Upon clicking the "search" button,
the system presents various recipes corresponding to the entered query.

=========================================================================================================

User Authentication and Login/Registration System Implementation

Implementation Details:

1. User Registration:

When a user submits the registration form, the backend verifies that the provided username does not already exist in the database.
The password is hashed securely using Bcrypt.js before storing it in the database.
After successful registration, a confirmation email is sent to the user's provided email address using Nodemailer.

2. User Login:

Upon submitting the login form, the backend retrieves the user's information from the database based on the provided username.
Bcrypt.js is used to compare the hashed password stored in the database with the password entered by the user.
If the login credentials are valid, a success email is sent to the user's email address using Nodemailer.

3. Session Management:

Express sessions are utilized for managing user sessions.
After successful login, the user object is stored in the session, allowing the server to recognize authenticated users across multiple requests.
The session is destroyed upon user logout, ensuring secure authentication and preventing unauthorized access.

4. Email Notifications:

Nodemailer is used to send email notifications to users for various events such as successful registration, login, and logout.

5. Route Protection:

Certain routes, such as accessing the home page and admin page, are protected to ensure that only authenticated users can access them.
Unauthorized users are redirected to the login page to authenticate themselves before accessing protected routes.


