import React, { useEffect, useState } from 'react'
import AdminDataContext from './AdminDataContext.jsx'
import { useContext } from 'react'
import AuthDataContext from './AuthDataContext.jsx'
import axios from 'axios'

function AdminContext({children}) {

    let [adminData, setAdminData] = useState(null)
    let {serverUrl} = useContext(AuthDataContext)

    const getAdmin = async ()=>{
      try {
        let result = await axios.get(serverUrl + "/api/user/getadmin", {withCredentials:true})

        setAdminData(result.data)

      } catch (error) {
        setAdminData(null)
        console.log(error)
      }
    }

    useEffect(()=>{
      getAdmin();
    },[])

    let value = {
      adminData, setAdminData,getAdmin
    }

  return (
    <div>
        <AdminDataContext.Provider value={value}>
            {children}
        </AdminDataContext.Provider>
    </div>
  )
}

export default AdminContext