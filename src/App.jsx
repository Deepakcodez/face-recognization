

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthMiddleware from './component/AuthMiddleware';
import FaceDetection from './component/FaceDetection';
import { Navbar } from './component/Navbar';
// import Facedetection from './component/Facedetection';
// 


function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<AuthMiddleware />} />
        <Route path="/faceAuth" element={<FaceDetection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
