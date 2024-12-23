import { useState, useRef } from "react";
import LoginPage from "./Components/Auth/Loginpage.jsx";
import CustomAlert from "./Components/styles/Alert.jsx";
import IntroPage from "./Components/UI/IntroPage.jsx";
import Protected from "./Components/Auth/protectedRoute.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Components/UI/home.jsx";
import SocketProvider from "./Components/Context/socketProvider.context.jsx";
import VideoCallProvider from "./Components/Context/VideoCallContext.jsx";
import VideoCallScreen from "./Components/UI/VideoCall.jsx";

export default function App() {
  const [alertMessage, setAlertMessage] = useState('');
  const [display, setDisplay] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [remoteUser, setRemoteUser] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  return (
    <>
      <CustomAlert
        open={display}
        severity={severity}
        message={alertMessage}
        onClose={() => setDisplay(false)}
      />
      <VideoCallProvider
        value={{
          isVideoCallActive,
          setIsVideoCallActive,
          remoteUser,
          setRemoteUser,
          localVideoRef,
          remoteVideoRef
        }}
      >
        <Router>
          <Routes>
            <Route path='/' element={<IntroPage />} />
            <Route path='/login' element={<LoginPage setAlertMessage={setAlertMessage} setDisplay={setDisplay} setSeverity={setSeverity} />} />
            <Route path='/home' element={
              <Protected>
                <SocketProvider>
                  <Home setAlertMessage={setAlertMessage} setDisplay={setDisplay} setSeverity={setSeverity} />
                  {isVideoCallActive && (
                    <div
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1000
                      }}
                    >
                      <VideoCallScreen remoteUser={remoteUser} />
                    </div>
                  )}
                </SocketProvider>
              </Protected>
            } />
          </Routes>
        </Router>
      </VideoCallProvider>
    </>
  );
}