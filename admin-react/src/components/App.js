import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../scripts/database.js";
import SignInForm from "./SignInForm";
import Admin from "./Admin";

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => setIsLoggedIn(!!user));
    }, []);

    return isLoggedIn === null ? (
        <></>
    ) : isLoggedIn ? (
        <Admin />
    ) : (
        <SignInForm />
    );
}
