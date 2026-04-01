import { useState } from "react";
import "./login.css";
import { Link, useNavigate  } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const[formValue, setFormValue] = useState({
    email:"",
    password:"",
  });
  const[formError, setFormError] = useState({
    email: "",
    password: "",
  })

  function onSubmit(e){
    e.preventDefault();
    let errors= {
      email: "",
      password: ""
    };
    let isValue = true;

    if(!formValue.email){
      errors.email = "Please enter Email Id."
      isValue= false;
    }
    else if(!formValue.email.endsWith(".com")){
      errors.email = "Email should end with .com"
      isValue= false;
    }
    if(!formValue.password){
      errors.password = "Please enter Password."
      isValue= false;
    }
    else if(formValue.password.length <= 5){
      errors.password = "Password must be more than 5 Letters"
      isValue= false;
    }
    setFormError(errors);
    if(!isValue){
      return;
    }

    // Check credentials from localStorage
const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

const matchedUser = existingUsers.find(
  (user) => user.email === formValue.email && user.password === formValue.password
);

if (!matchedUser) {
  setFormError({ ...errors, password: "Invalid email or password" });
  return;
}

alert("Login Successful!");
setFormValue({ email: "", password: "" });
navigate("/");

     setFormValue({
    email: "",
    password: "",
  });

  }

  return (
    <form onSubmit={onSubmit}>
    <div className="login">
          <div className="login-image">
            <img src="./login.jpg" alt="login image" />
          </div>
          <div className="login-form">
            <div className="loginHome"><Link to="/">  🏠Home</Link></div>
            <p className="pClass">Sign In</p>
            <div className="login-group">
              <label htmlFor="email">
                Email:
              </label>
              <input type="email"  className={formError.email ? "errorInput" : ""} id="email" value={formValue.email} onChange={(e)=>{setFormValue({...formValue, email:e.target.value})}}/>
              {formError.email && <p className="errorDiv">{formError.email}</p>}
            </div>
            <div className="login-group">
              <label htmlFor="password">
                 Password:
              </label>
              <input type="password" className={formError.password ? "errorInput" : ""} id="password" value={formValue.password} onChange={(e)=>{setFormValue({...formValue, password:e.target.value})}} />
              {formError.password && <p className="errorDiv">{formError.password}</p>}
            </div>
              <button type="submit" className="login-btn">Login</button>
            <div className="loginLink" >Don't have an account? <Link to="/signup">Sign up</Link></div>
          </div>
        </div>
        </form>
  );
}

export default Login;
