import React, { useContext, useEffect } from 'react'
import AuthDataContext from './AuthDataContext';
import { useState } from 'react';
import axios from 'axios';
import UserDataContext  from './UserDataContext';

function UserContext({ children }) {
    let [userData, setUserData] = useState("")
    let {serverUrl} = useContext(AuthDataContext);

    const getCurrentUser = async () => {
        try {
            let result = await axios.get(
                serverUrl + '/api/user/getcurrentuser',
                {withCredentials:true})

            setUserData(result.data)
            console.log(result.data)

        } catch (error) {
            setUserData(null)
            console.log(error)
        }
    }
    useEffect(() => {
        getCurrentUser()
    },[])

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