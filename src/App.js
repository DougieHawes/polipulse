import { Routes, Route } from "react-router-dom";

import Home from "./components/routes/Home";
import Profile from "./components/routes/Profile";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:name" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default App;
