import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database.js";

async function handleSignIn(e) {
    e.preventDefault();
    let { email, password } = e.target;
    email = email.value;
    password = password.value;
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
        })
        .catch((error) => {
            const { code, message } = error,
                errorElem = document.querySelector("#sign-in-error");
            console.error(code);
            errorElem.textContent = message;
        });
}

export { handleSignIn };
