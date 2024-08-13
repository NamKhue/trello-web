import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "~/pages/Authen/Login";
import Register from "~/pages/Authen/Register";

import HomePage from "~/pages/Boards";
import Board from "~/pages/Boards/_id";

import ProtectedRoute from "~/components/authen/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/meelo"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homepage"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/board/:id"
          element={
            <ProtectedRoute>
              <Board />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
