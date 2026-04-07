"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios, { AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";
import {
  ChevronLeft,
  ChevronRight,
  FileSearch,
  Loader2,
  RefreshCw,
  ScrollText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ApiState from "@/components/ApiState";
import RolesChecks from "@/components/RolesChecks";
import { API_ROUTES } from "@/constant/routes";
import { cn } from "@/lib/utils";
import { parseAndShowErrorInToast } from "@/utils";

const COLUMN_ORDER = [
  "date",
  "crawled_data",
  "pending_data",
  "error_log",
  "created_at",
] as const;

function parsePaginatedLogs(data: unknown): {
  count: number;
  next: string | null;
  previous: string | null;
  results: Record<string, unknown>[];
} {
  if (data && typeof data === "object" && "results" in data) {
    const obj = data as Record<string, unknown>;
    const results = Array.isArray(obj.results)
      ? (obj.results as Record<string, unknown>[])
      : [];
    const count =
      typeof obj.count === "number" ? obj.count : results.length;
    return {
      count,
      results,
      next: typeof obj.next === "string" ? obj.next : null,
      previous: typeof obj.previous === "string" ? obj.previous : null,
    };
  }
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data as Record<string, unknown>[],
    };
  }
  return { count: 0, next: null, previous: null, results: [] };
}

function formatCreatedAt(value: unknown): string {
  if (value == null || value === "") {
    return "—";
  }
  const iso = String(value);
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function formatCell(columnKey: string, value: unknown): ReactNode {
  if (columnKey === "created_at") {
    return formatCreatedAt(value);
  }
  if (columnKey === "error_log") {
    if (value == null || value === "") {
      return <span className="text-slate-400">—</span>;
    }
    return (
      <span className="whitespace-normal text-left" title={String(value)}>
        {String(value)}
      </span>
    );
  }
  if (value == null || value === "") {
    return <span className="text-slate-400">—</span>;
  }
  return String(value);
}

export default function ScrappedLogsPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchLogs = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const session: unknown = await getSession();
      const token = (session as { access_token?: string })?.access_token;
      if (!token) {
        setError({ status: 401, detail: "Not authenticated" });
        return;
      }

      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      const path = API_ROUTES.SUPERADMIN.SCRAPPED_LOGS.replace(/^\//, "");
      const { data } = await axios.get(`${apiBase}${path}`, {
        params: { page: pageNum },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const parsed = parsePaginatedLogs(data);
      setRows(parsed.results);
      setCount(parsed.count);
      setNextUrl(parsed.next);
      setPrevUrl(parsed.previous);

      if (pageNum === 1 && parsed.results.length > 0) {
        setPageSize(parsed.results.length);
      }

      setPage(pageNum);
    } catch (err) {
      setError(err);
      if (err instanceof AxiosError && err.response?.status === 401) {
        await signOut({
          callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}`,
        });
        return;
      }
      parseAndShowErrorInToast(
        err instanceof AxiosError ? err.response : err
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLogs(1);
  }, [fetchLogs]);

  const goToPage = useCallback(
    (nextPage: number) => {
      if (nextPage < 1 || loading) {
        return;
      }
      void fetchLogs(nextPage);
    },
    [fetchLogs, loading]
  );

  const handleRefresh = useCallback(() => {
    void fetchLogs(page);
  }, [fetchLogs, page]);

  const columns = useMemo(() => {
    if (rows.length === 0) {
      return [] as string[];
    }
    const keys = Object.keys(rows[0]).filter((k) => k !== "id");
    const ordered = COLUMN_ORDER.filter((k) => keys.includes(k));
    const rest = keys.filter(
      (k) => !ordered.some((columnKey) => columnKey === k)
    );
    return [...ordered, ...rest];
  }, [rows]);

  const totalPages = Math.max(1, Math.ceil(count / Math.max(1, pageSize)));
  const hasPrev = prevUrl != null && prevUrl !== "";
  const hasNext = nextUrl != null && nextUrl !== "";
  const rangeStart = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = count === 0 ? 0 : Math.min(page * pageSize, count);

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-10">
      <RolesChecks access="has_scraped_data_access" />

      <ApiState error={error} isSuccess={false}>
        <ApiState.ArthorizeCheck />
      </ApiState>

      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* <p className="text-xs font-medium uppercase tracking-wider text-blue-600/90">
              Scraper log
            </p> */}
            <h1 className="mt-1 flex flex-col gap-3 text-2xl font-bold tracking-tight text-slate-900 sm:flex-row sm:items-center sm:gap-3 md:text-3xl">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25 sm:h-11 sm:w-11">
                <ScrollText className="h-5 w-5" strokeWidth={2} />
              </span>
              <span>Scrapped logs</span>
            </h1>
            {/* <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Recent scraper activity from the reporting API. Use pagination to
              browse all entries.
            </p> */}
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-11 shrink-0 border-slate-200 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/50"
            onClick={() => void handleRefresh()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        <Card className="overflow-hidden border-slate-200/80 shadow-lg shadow-slate-200/40">
          <div
            className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
            aria-hidden
          />
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/40 py-4">
            <div>
              <CardTitle className="text-base text-slate-900">
                Activity table
              </CardTitle>
              {/* <CardDescription>
                {loading
                  ? "Loading…"
                  : count === 0
                    ? "No rows returned yet."
                    : `${count} total record${count === 1 ? "" : "s"}`}
              </CardDescription> */}
            </div>
            {!loading && count > 0 && (
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold tabular-nums text-slate-700 shadow-sm">
                Page {page} of {totalPages}
              </span>
            )}
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20">
                <Loader2
                  className="h-10 w-10 animate-spin text-blue-600"
                  aria-hidden
                />
                <p className="text-sm font-medium text-slate-600">
                  Fetching logs…
                </p>
              </div>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <FileSearch className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <p className="text-base font-semibold text-slate-800">
                  No log entries
                </p>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  When the API returns data, rows will show here. Try refreshing
                  or check filters on the server.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-6 border-slate-200"
                  onClick={() => void fetchLogs(1)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try again
                </Button>
              </div>
            ) : (
              <div className="max-h-[min(70vh,720px)] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200 bg-slate-50/90 hover:bg-slate-50/90">
                      {columns.map((col) => (
                        <TableHead
                          key={col}
                          className={cn(
                            "sticky top-0 z-10 whitespace-nowrap border-b border-slate-200 bg-slate-50/95 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 backdrop-blur-sm",
                            col === "error_log" && "min-w-[200px]"
                          )}
                        >
                          {col.replace(/_/g, " ")}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, i) => (
                      <TableRow
                        key={`${page}-${i}`}
                        className={cn(
                          "border-slate-100 transition-colors hover:bg-blue-50/40",
                          i % 2 === 1 && "bg-slate-50/35"
                        )}
                      >
                        {columns.map((col) => (
                          <TableCell
                            key={col}
                            className={cn(
                              "max-w-[min(28rem,40vw)] py-3 text-sm text-slate-700",
                              col !== "error_log" && "truncate",
                              col === "error_log" && "max-w-md"
                            )}
                            title={
                              col !== "error_log" && row[col] != null
                                ? String(row[col])
                                : undefined
                            }
                          >
                            {formatCell(col, row[col])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>

          {!loading && count > 0 && (
            <CardFooter className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-center text-sm text-slate-600 sm:text-left">
                Showing{" "}
                <span className="font-semibold tabular-nums text-slate-800">
                  {rangeStart}
                </span>
                –
                <span className="font-semibold tabular-nums text-slate-800">
                  {rangeEnd}
                </span>{" "}
                of{" "}
                <span className="font-semibold tabular-nums text-slate-800">
                  {count}
                </span>
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-slate-200"
                  disabled={loading || !hasPrev}
                  onClick={() => goToPage(page - 1)}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <span className="px-2 text-sm tabular-nums text-slate-600">
                  Page {page} / {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-slate-200"
                  disabled={loading || !hasNext}
                  onClick={() => goToPage(page + 1)}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
