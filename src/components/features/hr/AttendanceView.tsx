"use client";


import useSWR from "swr";
import { client, unwrapEdenResponse } from "../../../lib/api-client";
import { formatDisplayDate, getCurrentMonthThai } from "./hr.constants";
import { StatusBadge } from "../../ui/StatusBadge";
import type { AttendanceRecord } from "./hr.types";

export function AttendanceView() {
  const { data: attendance = [], error, isLoading } = useSWR<AttendanceRecord[]>(
    "hr-attendance",
    () => unwrapEdenResponse(client.api.hr.attendance.get()),
  );

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">กำลังโหลดข้อมูลการเข้างาน...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
        {error instanceof Error ? error.message : "ไม่สามารถโหลดข้อมูลการเข้างานได้"}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 sm:gap-4 sm:p-6 md:flex-row md:items-center">
        <div>
          <h3 className="text-base font-semibold sm:text-lg">
            บันทึกเวลาทำงาน (ลา / ขาด / สาย)
          </h3>
          <p className="text-xs text-gray-500 sm:text-sm">
            ข้อมูลประจำเดือน {getCurrentMonthThai()}
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          + บันทึกการลา/สาย
        </button>
      </div>

      <div className="divide-y divide-gray-100 md:hidden">
        {attendance.map((record) => (
          <div
            key={`${record.date}-${record.empId}-${record.type}`}
            className="p-4 hover:bg-gray-50"
          >
            <div className="mb-2 flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900">{record.name}</p>
                <p className="text-xs text-gray-500">{record.empId}</p>
              </div>
              <StatusBadge status={record.type} />
            </div>
            <p className="mb-1 text-sm text-gray-600">{record.note}</p>
            <p className="text-xs text-gray-500">{formatDisplayDate(record.date)}</p>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 font-medium">วันที่</th>
              <th className="p-3 font-medium">รหัส</th>
              <th className="p-3 font-medium">ชื่อพนักงาน</th>
              <th className="p-3 font-medium">ประเภท</th>
              <th className="p-3 font-medium">รายละเอียด/หมายเหตุ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {attendance.map((record) => (
              <tr
                key={`${record.date}-${record.empId}-${record.type}`}
                className="hover:bg-gray-50"
              >
                <td className="p-3">{formatDisplayDate(record.date)}</td>
                <td className="p-3 text-gray-500">{record.empId}</td>
                <td className="p-3 font-medium">{record.name}</td>
                <td className="p-3">
                  <StatusBadge status={record.type} />
                </td>
                <td className="p-3 text-gray-600">{record.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
