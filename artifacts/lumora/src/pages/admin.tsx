import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Inbox } from "lucide-react";

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

async function fetchSubmissions(): Promise<Submission[]> {
  const res = await fetch("/api/admin/submissions");
  if (!res.ok) throw new Error("Failed to fetch submissions");
  return res.json();
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

export default function Admin() {
  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <span className="font-serif font-bold text-2xl text-primary">Lumora</span>
        <span className="text-muted-foreground">/ Admin</span>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quote Requests</h1>
            <p className="text-muted-foreground mt-1">All form submissions from the website</p>
          </div>
          {submissions && (
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {submissions.length} {submissions.length === 1 ? "submission" : "submissions"}
            </Badge>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-20 text-muted-foreground">Loading submissions…</div>
        )}

        {error && (
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
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(s.createdAt)}
                  </span>
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
