export const checkValidData =( email, password) => {
    // const isNameValid = /^([a-zA-Z ]){2,30}$/.test(name)
    const isEmailValid =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
    const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);

    // if(!isNameValid) return "Name not valid"
    if(!isEmailValid) return "Email ID not valid"
    if(!isPasswordValid) return "Password not valid"

    return null
}