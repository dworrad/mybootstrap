module.exports = environment = process.env.NODE_ENV || 'local'
module.exports = conf = {

    production: {
        database_connection:        "mongodb://PROJECT_DB",
        dns:                        "http://PROJECT_DNS",
        standarderror:              "Something went wrong! Someone has been dispatched to sort this out.",
        EmailsFrom:                 "PROJECT_NAME Team <admin@PROJECT_DNS>"
    },

    staging: {
        database_connection:        "mongodb://PROJECT_DB",
        dns:                        "http://PROJECT_DNS",
        standarderror:              "Something went wrong! Someone has been dispatched to sort this out.",
        EmailsFrom:                 "PROJECT_NAME Team <admin@PROJECT_DNS>"
    },

    test: {
        database_connection:        "mongodb://PROJECT_DB",
        dns:                        "http://PROJECT_DNS",
        standarderror:              "Something went wrong! Someone has been dispatched to sort this out.",
        EmailsFrom:                 "Test PROJECT_NAME Team <admin@PROJECT_DNS>"
    },

    local: {
        database_connection:        "mongodb://localhost:27017/PROJECT_DB",
        dns:                        "http://localhost:3000",
        standarderror:              "Something went wrong! Someone has been dispatched to sort this out.",
        EmailsFrom:                 "Local PROJECT_NAME Team <admin@dogeshit.com>",
        testemailaddress:           "YOUR_EMAIL_ADDRESS"
    }

}
