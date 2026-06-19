import AuthDataContext from './AuthDataContext'


function AuthContext ({children}) {
  let serverUrl = "https://one-k-rt-hs6u.vercel.app"
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
