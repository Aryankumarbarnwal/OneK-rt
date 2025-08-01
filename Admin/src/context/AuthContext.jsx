import AuthDataContext from "./AuthDataContext.jsx"

function AuthContext({children}) {

    let serverUrl = "https://onek-rt-backend.onrender.com"

    let value = {
        serverUrl
    }

  return (
    <AuthDataContext.Provider value={value}>
        {children}
    </AuthDataContext.Provider>
  )
}

export default AuthContext
