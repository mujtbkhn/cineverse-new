import React, { useRef, useState } from "react";
import Header from "./Header";
import { checkValidData } from "../../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../utils/firebase.config";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";
import { BACKGROUND, USER_AVATAR } from "../../utils/constants";

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonClick = () => {
    const message = checkValidData(email.current.value, password.current.value);
    setErrorMessage(message);

    if (message) return;

    if (!isSignInForm) {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          updateProfile(auth.currentUser, {
            displayName: name.current.value,
            photoURL: USER_AVATAR,
          })
            .then(() => {
              const { uid, email, displayName, photoURL } = auth.currentUser;

              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                  photoURL: photoURL,
                })
              );
            })
            .catch((error) => {
              setErrorMessage(error.message);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    } else {
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Header enableAuthentication={true} />
      
      <div className="absolute inset-0">
        <img
          className="object-cover w-full h-full md:h-screen"
          src={BACKGROUND}
          alt="background"
        />
      </div>

      <form
        className="relative flex flex-col w-[90%] max-w-lg mx-auto my-40 p-6 bg-black bg-opacity-80 rounded-2xl text-white space-y-4
                  md:w-1/2 md:my-40 lg:w-1/3"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl text-center">{isSignInForm ? "Sign In" : "Sign Up"}</h1>
        {!isSignInForm && (
          <input
            ref={name}
            className="w-full p-4 my-2 text-center text-black rounded-md"
            type="text"
            placeholder="Name"
          />
        )}
        <input
          ref={email}
          className="w-full p-4 my-2 text-center text-black rounded-md"
          type="text"
          placeholder="Email-address"
        />
        <input
          ref={password}
          className="w-full p-4 my-2 text-center text-black rounded-md"
          type="password"
          placeholder="Password"
        />
        <button
          onClick={handleButtonClick}
          className="w-full p-4 my-4 text-white bg-red-700 rounded-xl"
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>
        <p className="text-red-700">{errorMessage}</p>
        <p
          className="text-center underline cursor-pointer"
          onClick={toggleSignInForm}
        >
          {isSignInForm
            ? "New to Cineverse? Sign Up Now"
            : "Already Registered? Sign In now"}
        </p>
      </form>
    </div>
  );
};

export default Login;
