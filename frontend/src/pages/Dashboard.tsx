import { useEffect, useState } from "react";
import { X, Copy } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { toast } from "sonner";
interface IPasswordData {
  site: string;
  password: string;
  id: string;
}

export default function Dashboard() {
  const [passwords, setPasswords] = useState<IPasswordData[] | null>(null);

  useEffect(() => {
    api.get("/passwords").then((res) => setPasswords(res.data));
  }, []);

  const handleDelete = async (idToDelete: string) => {
    try {
      await api.delete(`/passwords/${idToDelete}`);
      setPasswords(
        (prev) =>
          prev?.filter((p: IPasswordData) => p.id !== idToDelete) ?? null
      );
    } catch (err) {
      toast.error("Failed to delete password, please try again later.");
      console.error("Failed to delete password:", err);
    }
  };

  const copyToClipboard = (passwordToCopy: string) => {
    navigator.clipboard.writeText(passwordToCopy);
    toast.info("Password copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold mb-4 text-center">Saved Passwords</h1>
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Password</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!passwords ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                  </TableRow>
                ))
              ) : passwords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No passwords saved yet.
                  </TableCell>
                </TableRow>
              ) : (
                passwords.map((p: IPasswordData) => (
                  <TableRow key={p.site}>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        aria-label={`Delete password for ${p.site}`}
                      >
                        <X size={16} />
                      </button>
                    </TableCell>
                    <TableCell>{p.site}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <span className="truncate">{p.password}</span>
                      <button
                        onClick={() => copyToClipboard(p.password)}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        aria-label={`Copy password for ${p.site}`}
                      >
                        <Copy size={16} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
