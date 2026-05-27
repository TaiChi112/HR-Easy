"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type EmployeeSummary = {
  id: string;
  name: string;
};

type LeaveRequest = {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  createdAt: string;
  employee: EmployeeSummary;
};

type LeaveRequestApiResponse = {
  leaveRequests: LeaveRequest[];
};

type UpdateLeaveRequestResponse = {
  leaveRequest: LeaveRequest;
};

type LeaveStatus = "Approved" | "Rejected";

type RequestState = {
  loading: boolean;
  error: string | null;
};

function formatDate(dateValue: string): string {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

async function fetchPendingLeaveRequests(): Promise<LeaveRequest[]> {
  const response = await fetch("/api/hr/leaves", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load leave requests.");
  }

  const data = (await response.json()) as LeaveRequestApiResponse;

  return data.leaveRequests ?? [];
}

async function updateLeaveRequest(id: string, status: LeaveStatus): Promise<LeaveRequest> {
  const response = await fetch("/api/hr/leaves", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, status }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? "Unable to update leave request.");
  }

  const data = (await response.json()) as UpdateLeaveRequestResponse;

  return data.leaveRequest;
}

export default function LeaveRequestsPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [state, setState] = useState<RequestState>({ loading: true, error: null });
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLeaveRequests() {
      try {
        setState({ loading: true, error: null });
        const pendingLeaveRequests = await fetchPendingLeaveRequests();

        if (!isMounted) {
          return;
        }

        setLeaveRequests(pendingLeaveRequests);
        setState({ loading: false, error: null });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof Error ? error.message : "Unable to load leave requests.";

        setState({ loading: false, error: message });
      }
    }

    void loadLeaveRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  const pendingCount = useMemo(() => leaveRequests.length, [leaveRequests.length]);

  async function handleDecision(id: string, status: LeaveStatus) {
    try {
      setActiveActionId(id);
      await updateLeaveRequest(id, status);
      setLeaveRequests((current) => current.filter((leaveRequest) => leaveRequest.id !== id));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update leave request.";
      setState((current) => ({ ...current, error: message }));
    } finally {
      setActiveActionId(null);
    }
  }

  return (
    <main className="min-h-dvh bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                HR Admin
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Pending Leave Requests
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Review submitted leave requests, then approve or reject them directly from this
                dashboard.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Pending</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{pendingCount}</p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          {state.error ? (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {state.error}
            </div>
          ) : null}

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-[0.18em] text-slate-600">
                  <tr>
                    <th className="px-4 py-4 font-medium text-slate-700">Employee Name</th>
                    <th className="px-4 py-4 font-medium text-slate-700">Type</th>
                    <th className="px-4 py-4 font-medium text-slate-700">Start Date</th>
                    <th className="px-4 py-4 font-medium text-slate-700">End Date</th>
                    <th className="px-4 py-4 font-medium text-slate-700">Reason</th>
                    <th className="px-4 py-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {state.loading ? (
                    <tr>
                      <td className="px-4 py-8 text-slate-500" colSpan={6}>
                        Loading pending leave requests...
                      </td>
                    </tr>
                  ) : leaveRequests.length === 0 ? (
                    <tr>
                      <td className="px-4 py-8 text-slate-500" colSpan={6}>
                        No pending leave requests at the moment.
                      </td>
                    </tr>
                  ) : (
                    leaveRequests.map((leaveRequest) => (
                      <tr key={leaveRequest.id} className="align-top transition hover:bg-slate-50">
                        <td className="px-4 py-4 font-medium text-slate-900">
                          {leaveRequest.employee.name}
                        </td>
                        <td className="px-4 py-4 text-slate-700">{leaveRequest.type}</td>
                        <td className="px-4 py-4 text-slate-700">
                          {formatDate(leaveRequest.startDate)}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {formatDate(leaveRequest.endDate)}
                        </td>
                        <td className="px-4 py-4 text-slate-600">{leaveRequest.reason}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => void handleDecision(leaveRequest.id, "Approved")}
                              disabled={activeActionId === leaveRequest.id}
                              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDecision(leaveRequest.id, "Rejected")}
                              disabled={activeActionId === leaveRequest.id}
                              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}