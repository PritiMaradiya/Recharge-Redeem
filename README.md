# Wallet Management System - MERN Stack Developer Assessment

## Project Description
This project implements a wallet management system with the following functionalities:
- User recharge and redeem wallet balance.
- Secure Node.js API for backend operations.
- MongoDB Atlas for database management.
- React Admin panel for admin interaction.

---

## Prerequisites
1. Node.js v16+
2. MongoDB Atlas account
3. Yarn or npm
4. React Admin installed

---

## Backend Setup (`server` Folder)
1. **Install dependencies**:
   cd server
   yarn install
2. Add .env file 
   JWT_SECRET=<your_jwt_secret>
   MONGO_URI=<your_mongodb_atlas_connection_string>
   PORT=5000
3. Run the Server
     yarn start

## Wallet API Routes

The `server/Routes/walletRoutes.js` file contains the API routes for wallet operations, including Recharge and Redeem functionalities.

### API Endpoints

1. **Recharge Wallet**
   - **Endpoint:** `/api/wallet/recharge`
   - **Method:** POST
   - **Description:** Allows users to recharge their wallet by specifying the amount and user ID.
   - **Request Body:**
     ```json
     {
       "amount": "number"
     }
     ```
   - **Response:**
     - **Success:** Returns the updated wallet balance.
     - **Error:** Returns an error message if the recharge fails.

2. **Redeem Wallet**
   - **Endpoint:** `/api/wallet/redeem`
   - **Method:** POST
   - **Description:** Allows users to redeem an amount from their wallet for specific transactions.
   - **Request Body:**
     ```json
     {
       "amount": "number",
     }
     ```
   - **Response:**
     - **Success:** Returns the remaining wallet balance and transaction confirmation.
     - **Error:** Returns an error message if the redemption fails.

### Notes
- Ensure proper authentication before accessing these routes.
- Validation is performed on the request body for user ID and amount fields.
- Error handling includes scenarios such as insufficient balance or invalid user ID.



---

## Frontend setup (marmelab-panel Folder)
1. **Install dependencies**:
    cd marmelab-panel
     yarn install

3. Run the Server
     yarn start

