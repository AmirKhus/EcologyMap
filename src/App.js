import Header from './components/Header'
import useUser from "./components/Util/User/useUser"
import YMap from './components/YMap'
import React from 'react'

function App() {
  // const {user, setUser} = useUser();

  // if (!user) {
  //   return <AuthenticatePage setUser={setUser}/>
  // }
  
  return (
    <div className="App">
        <Header/>
        <YMap/>
    </div>
  );
}

export default App;
