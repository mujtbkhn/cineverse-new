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
    <>
      <div className="flex">
        <Header enableAuthentication={true} />
      </div>

      <div className="absolute ">
        <img
          className="object-cover h-screen md:object-none md:w-screen"
          src={BACKGROUND}
          alt="background"
        />
      </div>

      <form
        className="absolute left-0 right-0 flex flex-col mx-auto w-[90%] my-40 text-white bg-black md:w-3/12 m rounded-2xl bg-opacity-80 p-14"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl">{isSignInForm ? "Sign In" : "Sign Up"}</h1>
        {!isSignInForm && (
          <input
            ref={name}
            className="w-full p-4 my-8 text-center text-black rounded-md"
            type="text"
            placeholder="Name"
          />
        )}
        <input
          ref={email}
          className="w-full p-4 my-8 text-center text-black rounded-md"
          type="text"
          placeholder="Email-address"
        />
        <input
          ref={password}
          className="w-full p-4 my-8 text-center text-black rounded-md"
          type="password"
          placeholder="password"
        />
        <button
          onClick={handleButtonClick}
          className="w-full p-4 my-8 bg-red-700 rounded-xl"
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>
        <p className="pb-5 text-red-700">{errorMessage}</p>
        <p className="cursor-pointer" onClick={toggleSignInForm}>
          {isSignInForm
            ? "New to Cineverse? Sign Up Now"
            : "Already Registered? Sign In now"}
        </p>
      </form>
    </>
  );
};

export default Login;
