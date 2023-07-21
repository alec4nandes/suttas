const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
const { getAnalytics, isSupported } = require("firebase/analytics");
const { firebaseConfig } = require("./db-config.js");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig),
    auth = getAuth(app),
    db = getFirestore(app),
    analytics = isSupported().then((yes) => yes && getAnalytics(app));

module.exports = { app, db, auth, analytics };
