import { useState } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({
    name: "",
    email: "",
    phone: "",
    createPassword: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState({
    name: "",
    email: "",
    phone: "",
    createPassword: "",
    confirmPassword: "",
  });
  function onSubmitRegister(e) {
    e.preventDefault();
    let errors = {
      name: "",
      email: "",
      phone: "",
      createPassword: "",
      confirmPassword: "",
      terms: "",
    };
    let isValue = true;

    if (!formValue.name) {
      errors.name = "Please enter your Full Name";
      isValue = false;
    }
    if (!formValue.email) {
      errors.email = "Please enter Email Id.";
      isValue = false;
    } else if (!formValue.email.endsWith(".com")) {
      errors.email = "Email should end with .com";
      isValue = false;
    }
    if (!formValue.phone) {
      errors.phone = "Please enter Phone Number";
      isValue = false;
    } else if (formValue.phone.length !== 10) {
      errors.phone = "Phone number must be 10 digits";
      isValue = false;
    }
    if (!formValue.confirmPassword) {
      errors.confirmPassword = "Please confirm password";
      isValue = false;
    } else if (formValue.createPassword !== formValue.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValue = false;
    } else if(formValue.confirmPassword.length <= 5){
      errors.confirmPassword = "Password must be more then 5 letters"
      isValue= false;
    }
    const termsChecked = document.getElementById("terms").checked;
    if (!termsChecked) {
      errors.terms = "You must agree to the terms";
      isValue = false;
    }
    setFormError(errors);
    if (!isValue) {
      return;
    }

    
    // taking existing or empty array of users from localStorage
   const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

   //add new user in localstorage
   const newUser = {
    name: formValue.name,
    email: formValue.email,
    phone: formValue.phone,
    password: formValue.createPassword,
   }

   const emailExists = existingUsers.some(
    (user)=>user.email === newUser.email
   );
 
   if(emailExists){
    alert("Email already registered!");
    return;
   }

   existingUsers.push(newUser);
   localStorage.setItem("users",JSON.stringify(existingUsers));

   alert("Account created successfully!")
    setFormValue({
       name: "",
    email: "",
    phone: "",
    createPassword: "",
    confirmPassword: "",
    });
    navigate("/login");
  }
  return (
    <form onSubmit={onSubmitRegister}>
      <div className="signupDiv">
        <div className="signup-image">
          <img src="./login.jpg" alt="Register image" />
        </div>
        <div className="signup-form">
          <div className="formLink">
            <Link to="/"> 🏠Home</Link>
          </div>
          <h2>Sign Up</h2>
          <p className="pDiv">Create your account in a seconds</p>
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              className={formError.name ? "errorInput" : ""}
              value={formValue.name}
              onChange={(e) => {
                setFormValue({ ...formValue, name: e.target.value });
              }}
              placeholder={"eg.Ram Prasad Koirala"}
            />
            {formError.name && <p className="errorDiv">{formError.name}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              className={formError.email ? "errorInput" : ""}
              value={formValue.email}
              onChange={(e) => {
                setFormValue({ ...formValue, email: e.target.value });
              }}
              placeholder="eg.example@gmail.com"
            />
            {formError.email && <p className="errorDiv">{formError.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="num">Phone Number:</label>
            <input
              type="tel"
              id="num"
              className={formError.phone ? "errorInput" : ""}
              value={formValue.phone}
              onChange={(e) => {
                setFormValue({ ...formValue, phone: e.target.value });
              }}
              placeholder="98xxxxxxxx"
            />
            {formError.phone && <p className="errorDiv">{formError.phone}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Create Password:</label>
            <input
              type="password"
              id="password"
              className={formError.createPassword ? "errorInput" : ""}
              value={formValue.createPassword}
              onChange={(e) => {
                setFormValue({ ...formValue, createPassword: e.target.value });
              }}
              placeholder="********"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm_password">Confirm Password:</label>
            <input
              type="password"
              id="confirm_password"
              className={formError.confirmPassword ? "errorInput" : ""}
              value={formValue.confirmPassword}
              onChange={(e) => {
                setFormValue({ ...formValue, confirmPassword: e.target.value });
              }}
              placeholder="********"
            />
            {formError.confirmPassword && <p className="errorDiv">{formError.confirmPassword}</p>}
          </div>
          <div className="checkbox-group">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">
              I agree to the terms and privacy policy
            </label>
            {formError.terms && <p className="errorDiv">{formError.terms}</p>}
          </div>
          <button type="submit" className="signup-btn">
            Create an account
          </button>
          <div className="signupLink">
            <Link to="/login">Already Have an Account</Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Signup;
