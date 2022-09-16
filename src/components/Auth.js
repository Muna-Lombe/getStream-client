import axios from 'axios'
import React, { useState } from 'react'
import Cookies from 'universal-cookie/es6'
import { UserError } from '.'
import { serverUrl } from '../App'
import signinImage from '../assets/signup.jpg'


const cookies = new Cookies();
        
const s = sessionStorage.setItem.bind(sessionStorage)
const initialState = {
    fullName:"",
    username:"",
    password:"",
    confirmPassword:"",
    phoneNumber:"",
    avatarUrl:""
};
export const dc = (en) => {
    const n = en.hash.toString().slice(en.hash.length - 4, en.hash.length).split("#")
    const ex = en.hash.slice(Number.parseInt(n[0]), (Number.parseInt(n[0]) + Number.parseInt(n[1])))
    // console.log("dehashed:",ex)
    return ex;
}
export const FA = async () => {
    const URL = 'http://localhost:5000/auth';
    const { data: res } = await axios.get(`${URL}/fetchauthor`)
    cookies.set('atlas', res);
    s('atlas', res)

    return dc(res)
}

const Auth =  () => {
    const [form, setForm] = useState(initialState)
    const [isSignup, setIsSignup] = useState(false);
    const [hasError, setHasError] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const handleChange = (event) =>{
        setForm({...form, [event.target.name]: event.target.value});
    };
    
    const handleSubmit = async (event) =>{
        event.preventDefault();
        
        const { username, password, phoneNumber, avatarUrl} = form;
        
        const URL = serverUrl+"/auth";

        const data = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {fullName: form.fullName, username, password, phoneNumber, avatarUrl}
        ).then((result) => {
            console.log("res", result)
            return result.data
        }).catch((error) => {
            return {errCode:2, message:error.message}
        });
        
        if (data.errCode) {
            (data.message.toString().includes("Request failed with status code 500"))
            ? setErrMsg("Looks like something is wrong on our side, please try again in a minute...")
            : setErrMsg('')
            !hasError && setHasError((prevState)=> !prevState)
            setTimeout(() => {
                setHasError(false)
            }, 60000);
        }
        if (data.token) {
            console.log("success")
            const { token, userId, hashedPassword, fullName, permissions, grants, api_key = FA().then(r => r) } = data
            //COMMENT THIS SECTION OUT TO TEST LASTER//
            cookies.set('token', token);
            cookies.set('userId', userId);
            cookies.set('username', username);
            cookies.set('fullName', fullName);

            ////REMOVE THIS AFTER VERIFY TEST////////
            cookies.set('permissions', permissions);
            cookies.set('grants', grants);
            console.log("permissions: ", permissions)
            console.log("grants: ",grants)
            ////////////////////////////////////////

            if(isSignup){
                cookies.set('phoneNumber', phoneNumber);
                cookies.set('avatarUrl', avatarUrl);
                cookies.set('hashedPassword', hashedPassword); 

            }
            /////////////////////////////////////////////

            // reload window
            window.location.reload();
        }

        

        
        
    }

    const switchMode = ()=>{
        if(hasError){setHasError(false)}
        setIsSignup((prevIsSignup) => !prevIsSignup);
    }
    
    // const Error ={
    const UserNotFound = UserError//()=>{ return(
    //             errMsg
    //             ? <p>{errMsg}</p>
    //             : <p >
    //                 You do not have an account yet, <span onClick={() => switchMode()}>create an account</span> to and login
    //               </p>
    //         )}//,
    // //     InvalidEmail:('')
    // // }
    return (
        <div className='auth__form-container'>
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <div className="auth__form-container_fields-content_header" >
                        <p>{isSignup ? "Sign up" : "Sign In"}</p>
                        {/* {hasError && <UserNotFound/>} */}
                    </div>
                    <div className='auth__form-error_no-user'>
                        {hasError && <UserNotFound errMsg={errMsg} switchMode={switchMode} />}
                    </div>
                        
                    <form onSubmit={()=>{}}>
                        
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input with_signup">
                                <label htmlFor="fullName">Full Name</label>
                                <input 
                                name="fullName"
                                type="text"
                                placeholder="Full name"
                                onChange={handleChange} 
                                required
                                />
                            </div>
                            
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="username">User name</label>
                            <input 
                            name="username"
                            type="text"
                            placeholder="User name"
                            onChange={handleChange} 
                            required
                            />
                        </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input with_signup">
                                <label htmlFor="phoneNumber">Phone number</label>
                                <input 
                                name="phoneNumber"
                                type="text"
                                placeholder="Phone number"
                                onChange={handleChange} 
                                required
                                />
                            </div>
                            
                        )}
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input with_signup">
                                <label htmlFor="avatarUrl">Avatar Url</label>
                                <input 
                                name="avatarUrl"
                                type="text"
                                placeholder="Avatar Url"
                                onChange={handleChange} 
                                required
                                />
                            </div>
                            
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="password">Password</label>
                            <input 
                            name="password"
                            type="password"
                            placeholder="Full name"
                            onChange={handleChange} 
                            required
                            />
                        </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input with_signup">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input 
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                onChange={handleChange} 
                                required
                                />
                            </div>
                            
                        )}
                        <div className="auth__form-container_fields-content_button">
                            <button onClick={handleSubmit}>
                            {isSignup ? "Sign Up" : "Sign In"}
                            </button>
                        </div>
                    </form>
                    <div className="auth__form-container_fields-account">
                        <p>
                            {isSignup
                                ? "Already have an account?"
                                : "Don't have an account?"
                            }
                            <span onClick={switchMode}>
                              {isSignup ? "Sign In" : "Sign Up"}
                            </span>

                        </p>
                    </div>
                </div>
            </div>
            <div className="auth__form-container_image">
                <img src={signinImage} alt="Sign in" />
            </div>
            
        </div>
    )
}

export default Auth
