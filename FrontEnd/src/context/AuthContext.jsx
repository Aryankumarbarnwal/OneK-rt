import AuthDataContext from './AuthDataContext'


function AuthContext ({children}) {
  let serverUrl = "https://vercel.com/aryankumarbarnwals-projects/one-k-rt/3AY7BqKoBqomdureRowqoAAbNU7g"
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
