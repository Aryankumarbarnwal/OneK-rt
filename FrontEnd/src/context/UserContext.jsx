import React, { useContext, useEffect } from 'react'
import AuthDataContext from './AuthDataContext';
import { useState } from 'react';
import axios from 'axios';
import UserDataContext  from './UserDataContext';
import { toast } from 'react-toastify'

function UserContext({ children }) {
    let [userData, setUserData] = useState("")
    let {serverUrl} = useContext(AuthDataContext);

    const getCurrentUser = async () => {
        try {
            let result = await axios.get(
                serverUrl + '/api/user/getcurrentuser',
                {withCredentials:true})

            setUserData(result.data)
            return result.data;
            console.log(result.data)

        } catch (error) {
            setUserData(null)
            toast.error("User data load Failed");
            console.log(error)
        }
    }
    useEffect(() => {
      if (document.cookie.includes("token")) {
          console.log("Document.cookie:", document.cookie);
            getCurrentUser();  // 👈 tabhi call karo agar token hai
      }
    }, []);

    let value = {
        userData, setUserData, getCurrentUser
    }


    return (
        <div>
            <UserDataContext.Provider value={value}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}

export default UserContext
