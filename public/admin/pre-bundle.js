import { onAuthStateChanged } from "firebase/auth";
import { addHandlers, toggleViews } from "./handlers.js";
import { getDbSuttaButtons } from "./display.js";
import { auth } from "../database.js";
import { handleSignIn } from "./auth.js";

onAuthStateChanged(auth, async (user) => {
    toggleViews({ isSignedIn: !!user });
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const { uid } = user;
        addHandlers();
        await getDbSuttaButtons();
    } else {
        const signInForm = document.querySelector("form#sign-in");
        signInForm.onsubmit = handleSignIn;
    }
});
