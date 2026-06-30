import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Inbox, Trash2, RefreshCw, Lock } from "lucide-react";
import { useState } from "react";

interface Submission {
  id: number;
  name: string;
  email: string;
  company: string;
  projectType: string;
  timeline: string;
  message: string;
  createdAt: string;
}

const SESSION_KEY = "lumora_admin_token";

async function fetchSubmissions(password: string): Promise<Submission[]> {
  const res = await fetch("/api/admin/submissions", {
    headers: { Authorization: `Bearer ${password}` },
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error("Failed to fetch submissions");
  return res.json();
}

async function deleteSubmission(id: number, password: string): Promise<void> {
  const res = await fetch(`/api/admin/submissions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${password}` },
  });
  if (!res.ok) throw new Error("Failed to delete submission");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    const res = await fetch("/api/admin/submissions", {
      headers: { Authorization: `Bearer ${input}` },
    });
    if (res.status === 401) {
      setError(true);
      return;
    }
    sessionStorage.setItem(SESSION_KEY, input);
    onLogin(input);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Admin Access</h1>
          <p className="text-sm text-muted-foreground text-center">Enter your admin password to view quote requests</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-500 text-center">Incorrect password</p>
          )}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const [password, setPassword] = useState<string>(
    () => sessionStorage.getItem(SESSION_KEY) ?? ""
  );
  const queryClient = useQueryClient();
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const { data: submissions, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["submissions", password],
    queryFn: () => fetchSubmissions(password),
    enabled: !!password,
    refetchInterval: 30_000,
    staleTime: 0,
    retry: (_, err) => (err as Error).message !== "unauthorized",
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSubmission(id, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", password] });
      setConfirmingId(null);
    },
  });

  const isUnauthorized = (error as Error)?.message === "unauthorized";

  if (!password || isUnauthorized) {
    return (
      <LoginScreen
        onLogin={(pw) => {
          setPassword(pw);
          queryClient.removeQueries({ queryKey: ["submissions"] });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-2xl text-primary">Lumora</span>
          <span className="text-muted-foreground">/ Admin</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground text-sm"
          onClick={() => {
            sessionStorage.removeItem(SESSION_KEY);
            setPassword("");
          }}
        >
          Sign out
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quote Requests</h1>
            <p className="text-muted-foreground mt-1">All form submissions from the website</p>
          </div>
          <div className="flex items-center gap-3">
            {submissions && (
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {submissions.length} {submissions.length === 1 ? "submission" : "submissions"}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-20 text-muted-foreground">Loading submissions…</div>
        )}

        {error && !isUnauthorized && (
          <div className="text-center py-20 text-red-500">Failed to load submissions.</div>
        )}

        {submissions && submissions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <Inbox className="w-10 h-10 opacity-40" />
            <p className="text-lg">No submissions yet</p>
          </div>
        )}

        {submissions && submissions.length > 0 && (
          <div className="space-y-4">
            {submissions.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-foreground text-lg">{s.name}</p>
                    <a href={`mailto:${s.email}`} className="text-primary hover:underline text-sm">
                      {s.email}
                    </a>
                    <span className="text-muted-foreground text-sm"> · {s.company}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(s.createdAt)}
                    </span>
                    {confirmingId === s.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Delete this entry?</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(s.id)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? "Deleting…" : "Yes, delete"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfirmingId(null)}
                          disabled={deleteMutation.isPending}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-50"
                        onClick={() => setConfirmingId(s.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Badge variant="outline">{s.projectType}</Badge>
                  <Badge variant="outline">{s.timeline}</Badge>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {s.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
