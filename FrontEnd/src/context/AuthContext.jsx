import AuthDataContext from './AuthDataContext'


function AuthContext ({children}) {
  let serverUrl = "https://one-k-rt-znad.vercel.app"
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
