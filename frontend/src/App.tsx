import { Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import RequireAuth from "./components/RequireAuth";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
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
    </Routes>
  );
}

export default App;
