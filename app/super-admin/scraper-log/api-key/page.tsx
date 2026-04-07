"use client";

import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";
import {
  KeyRound,
  Loader2,
  RefreshCw,
  Save,
  ShieldCheck,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ApiState from "@/components/ApiState";
import RolesChecks from "@/components/RolesChecks";
import { API_ROUTES } from "@/constant/routes";
import { cn } from "@/lib/utils";
import { parseAndShowErrorInToast } from "@/utils";

const API_KEY_MAX_LENGTH = 255;

function buildApiUrl(route: string): string {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const path = route.replace(/^\//, "");
  return `${apiBase}${path}`;
}

function extractKeyFields(data: unknown): {
  api_key: string;
  daily_limit: string;
} {
  if (!data || typeof data !== "object") {
    return { api_key: "", daily_limit: "" };
  }
  const d = data as Record<string, unknown>;
  const rawKey = d.api_key != null ? String(d.api_key) : "";
  const apiKey = rawKey.slice(0, API_KEY_MAX_LENGTH);
  const limitRaw = d.daily_limit;
  const dailyLimit =
    limitRaw != null && limitRaw !== ""
      ? String(limitRaw)
      : "";
  return { api_key: apiKey, daily_limit: dailyLimit };
}

export default function ScrappedApiKeyPage() {
  const [apiKey, setApiKey] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchKey = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/scrapped-api-key");

      const fields = extractKeyFields(data);
      setApiKey(fields.api_key);
      setDailyLimit(fields.daily_limit);
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
    void fetchKey();
  }, [fetchKey]);

  const handleSave = async () => {
    const session: unknown = await getSession();
    const token = (session as { access_token?: string })?.access_token;
    if (!token) {
      toast.error("Not authenticated.");
      return;
    }

    const limitNum = Number(dailyLimit);
    if (dailyLimit.trim() !== "") {
      if (Number.isNaN(limitNum)) {
        toast.error("Daily limit must be a number.");
        return;
      }
      if (limitNum < 0) {
        toast.error("Daily limit cannot be less than 0.");
        return;
      }
    }

    if (apiKey.length > API_KEY_MAX_LENGTH) {
      toast.error(`API key must be at most ${API_KEY_MAX_LENGTH} characters.`);
      return;
    }

    setSaving(true);
    try {
      await axios.patch(
        buildApiUrl(API_ROUTES.SUPERADMIN.SCRAPPED_API_KEY_UPDATE),
        {
          api_key: apiKey,
          daily_limit: dailyLimit.trim() === "" ? null : limitNum,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Scrapped API key updated.");
      await fetchKey();
    } catch (err) {
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
      setSaving(false);
    }
  };

  const keyLengthRatio = apiKey.length / API_KEY_MAX_LENGTH;

  return (
    <div className="w-full min-h-[calc(100vh-6rem)] flex flex-col items-center justify-start px-4 py-8 md:py-10">
      <RolesChecks access="has_scraped_data_access" />

      <ApiState error={error} isSuccess={false}>
        <ApiState.ArthorizeCheck />
      </ApiState>

      <div className="w-full max-w-lg">
        <div className="mb-6 text-center md:text-left">
          {/* <p className="text-xs font-medium uppercase tracking-wider text-blue-600/90">
            Scraper
          </p> */}
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
             Manage Scrapping API key and Limit
          </h1>
          {/* <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            Manage the key and daily quota used by the scraper. Values load via
            this app&apos;s secure proxy; updates use your session.
          </p> */}
        </div>

        <Card className="overflow-hidden border-slate-200/80 shadow-lg shadow-slate-200/40">
          <div
            className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
            aria-hidden
          />
          <CardHeader className="space-y-4 pb-2">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25">
                <KeyRound className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <CardTitle className="text-lg text-slate-900">
                  Credentials
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  API key is capped at {API_KEY_MAX_LENGTH} characters. Daily
                  limit controls how many scraper requests are allowed per day.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <Separator className="bg-slate-100" />

          <CardContent className="space-y-6 pt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14">
                <Loader2
                  className="h-10 w-10 animate-spin text-blue-600"
                  aria-hidden
                />
                <p className="text-sm font-medium text-slate-600">
                  Loading credentials…
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Label
                      htmlFor="scrapped-api-key"
                      className="text-slate-700"
                    >
                      API key
                    </Label>
                    <span
                      className={cn(
                        "text-xs tabular-nums",
                        keyLengthRatio >= 1
                          ? "font-medium text-amber-600"
                          : "text-slate-500"
                      )}
                    >
                      {apiKey.length}/{API_KEY_MAX_LENGTH}
                    </span>
                  </div>
                  <Input
                    id="scrapped-api-key"
                    type="text"
                    autoComplete="off"
                    maxLength={API_KEY_MAX_LENGTH}
                    value={apiKey}
                    onChange={(e) =>
                      setApiKey(e.target.value.slice(0, API_KEY_MAX_LENGTH))
                    }
                    placeholder="Enter API key"
                    className="h-11 font-mono text-sm shadow-sm transition-shadow focus-visible:ring-blue-500/30"
                  />
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
                      style={{
                        width: `${Math.min(100, keyLengthRatio * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="daily-limit" className="text-slate-700">
                    Daily limit
                  </Label>
                  <Input
                    id="daily-limit"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    value={dailyLimit}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") {
                        setDailyLimit("");
                        return;
                      }
                      if (/^\d+$/.test(v)) {
                        setDailyLimit(v);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "-" ||
                        e.key === "+" ||
                        e.key === "e" ||
                        e.key === "E"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="e.g. 1000"
                    className="h-11 shadow-sm transition-shadow focus-visible:ring-blue-500/30"
                  />
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600/80" />
                    Whole number, 0 or greater. Leave empty if the backend
                    accepts a null limit.
                  </p>
                </div>
              </>
            )}
          </CardContent>

          {!loading && (
            <CardFooter className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-200 sm:w-auto"
                onClick={() => void fetchKey()}
                disabled={saving || loading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload
              </Button>
              <Button
                type="button"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 sm:w-auto"
                onClick={() => void handleSave()}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save changes
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
