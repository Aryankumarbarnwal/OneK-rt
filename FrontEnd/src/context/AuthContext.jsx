import AuthDataContext from './AuthDataContext'


function AuthContext ({children}) {
  let serverUrl = "http://localhost:8000"
    let value = {
      serverUrl
    };

  return (
    <AuthDataContext.Provider value={value}>
      {children}
    </AuthDataContext.Provider>
  )
}

export default AuthContext