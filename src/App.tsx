import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Favorite from "./pages/Favorite";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";
import styled from "styled-components";

const AppContainer = styled.div`
  position: relative;
  width: 390px;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
`;

function App() {
  const isLogin = location.pathname === "/";

  return (
    <Router>
      <AppContainer>
        <Content>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Content>
        {isLogin ? null : <Navigation />}
      </AppContainer>
    </Router>
  );
}

export default App;
