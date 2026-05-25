"use client";

import {
  AlertTriangle,
  CalendarClock,
  CircleDollarSign,
  Clock,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import useSWR from "swr";
import { client, unwrapEdenResponse } from "../../../lib/api-client";
import { StatCard } from "../../ui/StatCard";
import { StatusBadge } from "../../ui/StatusBadge";
import { dashboardStats } from "./hr.constants";
import type { AttendanceRecord, Employee, MenuKey, PayrollRecord } from "./hr.types";

type DashboardViewProps = {
  onNavigate: (menu: MenuKey) => void;
};

type DashboardData = {
  employees: Employee[];
  attendance: AttendanceRecord[];
  payroll: PayrollRecord[];
};

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const { data, error, isLoading } = useSWR<DashboardData>("hr-dashboard", async () => {
    const [employees, attendance, payroll] = await Promise.all([
      unwrapEdenResponse(client.api.hr.employees.get()),
      unwrapEdenResponse(client.api.hr.attendance.get()),
      unwrapEdenResponse(client.api.hr.payroll.get()),
    ]);

    return { employees, attendance, payroll };
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">กำลังโหลดข้อมูลแดชบอร์ด...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
        {error instanceof Error ? error.message : "ไม่สามารถโหลดข้อมูลแดชบอร์ดได้"}
      </div>
    );
  }

  const dashboardData: DashboardData =
    data ?? {
      employees: [],
      attendance: [],
      payroll: [],
    };

  const stats = dashboardStats.map((stat) => {
    if (stat.target === "employees") {
      return { ...stat, value: String(dashboardData.employees.length) };
    }

    if (stat.title === "ลางานวันนี้") {
      return {
        ...stat,
        value: String(
          dashboardData.attendance.filter((record) => record.type === "ลาพักร้อน").length,
        ),
      };
    }

    if (stat.title === "มาสายวันนี้") {
      return {
        ...stat,
        value: String(dashboardData.attendance.filter((record) => record.type === "มาสาย").length),
      };
    }

    return { ...stat, value: String(dashboardData.payroll.length) };
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            onClick={() => onNavigate(stat.target)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5 text-gray-400" /> อัปเดตการเข้างานล่าสุด
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("attendance")}
              className="rounded text-sm text-blue-600 hover:underline focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              ดูทั้งหมด
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData.attendance.slice(0, 3).map((item) => (
              <div
                key={`${item.date}-${item.empId}-${item.type}`}
                className="flex items-center justify-between rounded-lg border border-gray-50 p-3 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.note}</p>
                </div>
                <StatusBadge status={item.type} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <LayoutDashboard className="h-5 w-5 text-gray-400" /> เมนูด่วน
            (Quick Actions)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-4 text-blue-700 transition-colors hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Plus className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">+ เพิ่มพนักงาน</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-4 text-green-700 transition-colors hover:bg-green-100 focus-visible:ring-2 focus-visible:ring-green-500"
            >
              <CircleDollarSign className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">จ่ายเงินเดือน</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center rounded-lg bg-orange-50 p-4 text-orange-700 transition-colors hover:bg-orange-100 focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <AlertTriangle className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">ตักเตือน</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center rounded-lg bg-purple-50 p-4 text-purple-700 transition-colors hover:bg-purple-100 focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <CalendarClock className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">อนุมัติลา</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
