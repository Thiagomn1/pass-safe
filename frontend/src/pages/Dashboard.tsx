import { useState, useMemo, useEffect } from "react";
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
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { useVault } from "../context/vault/useVault";
import { VaultUnlockDialog } from "../components/custom-ui/UnlockDialog";

interface IPasswordData {
  site: string;
  password: string;
  id: string;
}

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { isUnlocked } = useVault();

  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const { data: passwords, isLoading } = useQuery<IPasswordData[]>({
    queryKey: ["passwords"],
    queryFn: async () => {
      const res = await api.get("/passwords");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/passwords/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["passwords"] });
      toast.success("Password deleted");
    },
    onError: () => {
      toast.error("Failed to delete password, please try again later.");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const copyToClipboard = (passwordToCopy: string) => {
    navigator.clipboard.writeText(passwordToCopy);
    toast.info("Password copied to clipboard!");
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return passwords;
    const term = search.toLowerCase();
    return passwords?.filter((p) => p.site.toLowerCase().includes(term)) ?? [];
  }, [search, passwords]);

  const totalPages = useMemo(() => {
    return filtered ? Math.ceil(filtered.length / itemsPerPage) : 1;
  }, [filtered]);

  const paginated = useMemo(() => {
    if (!filtered) return [];
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <>
      <VaultUnlockDialog />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="p-6"
      >
        <h1 className="text-3xl font-bold mb-4 text-center">Saved Passwords</h1>

        <div className="flex justify-center mb-4">
          <Input
            placeholder="Search for a site.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md w-full"
          />
        </div>

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
                {isLoading ? (
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
                ) : filtered?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No matching passwords found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated?.map((p) => (
                    <TableRow key={p.id}>
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
                        <span className="truncate">
                          {isUnlocked ? p.password : "••••••••"}
                        </span>
                        <button
                          onClick={() =>
                            isUnlocked && copyToClipboard(p.password)
                          }
                          className={`text-blue-500 hover:text-blue-700 cursor-pointer ${
                            !isUnlocked ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          aria-label={`Copy password for ${p.site}`}
                          disabled={!isUnlocked}
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
        {filtered && filtered.length > itemsPerPage && (
          <div className="flex justify-center mt-4 gap-2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;
              const isCurrent = currentPage === page;

              return (
                <Button
                  key={i}
                  onClick={() => setCurrentPage(page)}
                  disabled={isCurrent}
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer ${
                    isCurrent ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Next
            </Button>
          </div>
        )}
      </motion.div>
    </>
  );
}
