import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../scripts/database.js";

export default function SignInForm() {
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <form id="sign-in" onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label htmlFor="email">email:</label>
                        </td>
                        <td>
                            <input name="email" type="email" id="email" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label htmlFor="password">password:</label>
                        </td>
                        <td>
                            <input
                                name="password"
                                type="password"
                                id="password"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <button>sign in</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p id="sign-in-error">{errorMessage}</p>
        </form>
    );

    async function handleSignIn(e) {
        e.preventDefault();
        let { email, password } = e.target;
        email = email.value;
        password = password.value;
        await signInWithEmailAndPassword(auth, email, password)
            .then()
            .catch((error) => {
                const { code, message } = error;
                console.error(code);
                setErrorMessage(message);
            });
    }
}
