// Sample config file
// Should be changed to `config.js` when development enviornment is changed.

export const socketUrl = (process.env.NODE_ENV === "development") ? 
                          "http://localhost:3231" : 
                          "[YOUR_PRODUCTION_SERVER_URL]" 

export const facebookAppId = "[APP_ID]"