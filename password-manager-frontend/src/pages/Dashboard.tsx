import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

interface IPasswordData {
  site: string;
  password: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState([]);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    api.get("/password").then((res) => setPasswords(res.data));
  }, []);

  return (
    <div>
      <h2>Saved Passwords</h2>
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {passwords.map((p: IPasswordData) => (
          <li key={p.site}>
            {p.site}: {p.password}
          </li>
        ))}
      </ul>
    </div>
  );
}
