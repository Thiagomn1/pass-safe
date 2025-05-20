import { useEffect, useState } from "react";
import api from "../api/axios";

interface IPasswordData {
  site: string;
  password: string;
}

export default function Dashboard() {
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    api.get("/passwords").then((res) => setPasswords(res.data));
  }, []);

  return (
    <div>
      <h2>Saved Passwords</h2>
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
