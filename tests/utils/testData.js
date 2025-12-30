/*
 * Centralized Test Data file
 * Stores reusable login credentials and API payloads.
 * Avoids hardcoding values across tests.
 */

module.exports = {

    // Valid user credentials for successful login
    loginCredentials: {
        userEmail: "akashmech4006@gmail.com",
        userPassword: "Akash@123"
    },

    // Invalid user credentials used for negative login test
    invalidLoginCredentials: {
        userEmail: "akashmech4006@gmail.com",
        userPassword: "Akash@99"
    },

    // Payload used for creating orders through API
    orderPayLoad: {
        orders: [
            { country: "Peru", productOrderedId: "68a961459320a140fe1ca57a" }
        ]
    }
};