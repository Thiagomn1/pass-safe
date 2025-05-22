import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import RequireAuth from "./components/auth/RequireAuth";
import Layout from "./components/layout/Layout";
import { useAuth } from "./hooks/useAuth";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";

function App() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader"></span>
      </div>
    );

  return (
    <Routes>
      <Route element={<Layout user={user} />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth user={user}>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/generate"
          element={
            <RequireAuth user={user}>
              <Generate />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
