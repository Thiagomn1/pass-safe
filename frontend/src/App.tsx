import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import RequireAuth from "./components/auth/RequireAuth";
import Layout from "./components/layout/Layout";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route element={<Layout user={user} />}>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
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
