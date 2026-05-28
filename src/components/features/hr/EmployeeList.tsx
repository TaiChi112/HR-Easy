"use client";

import { Plus, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { client, unwrapEdenResponse } from "../../../lib/api-client";
import { EmployeeDetailModal } from "./EmployeeDetailModal";
import { formatDisplayDate, formatThaiCurrency } from "./hr.constants";
import { StatusBadge } from "../../ui/StatusBadge";
import type { Employee } from "./hr.types";

type EmployeeListProps = {
  onSelect: (employee: Employee) => void;
};

export function EmployeeList({ onSelect }: EmployeeListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const isFirstLoadRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const loadEmployees = async () => {
      if (isFirstLoadRef.current) {
        setIsLoading(true);
      } else {
        setIsSearching(true);
      }

      setError(null);

      try {
        const response =
          debouncedSearchTerm.length === 0
            ? await unwrapEdenResponse(client.api.hr.employees.get())
            : await unwrapEdenResponse(
                client.api.hr.employees.get({
                  query: {
                    search: debouncedSearchTerm,
                  },
                }),
              );

        if (requestId !== requestIdRef.current) {
          return;
        }

        setEmployees(response);
      } catch (fetchError) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "ไม่สามารถโหลดทะเบียนพนักงานได้",
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
          setIsSearching(false);
          isFirstLoadRef.current = false;
        }
      }
    };

    void loadEmployees();
  }, [debouncedSearchTerm]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">กำลังโหลดทะเบียนพนักงาน...</p>
      </div>
    );
  }

  if (error && employees.length === 0) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-4 sm:gap-4 sm:p-5 md:flex-row md:items-center">
        <div className="relative flex-1 md:flex-initial">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, รหัสพนักงาน..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-80"
          />
        </div>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          <Plus className="h-4 w-4" /> + เพิ่มพนักงาน
        </button>
      </div>

      {error ? (
        <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 sm:px-5">
          {error}
        </div>
      ) : null}

      {isSearching ? (
        <div className="border-b border-gray-100 px-4 py-3 text-xs font-medium uppercase tracking-[0.16em] text-gray-500 sm:px-5">
          กำลังค้นหาพนักงาน...
        </div>
      ) : null}

      {employees.length === 0 ? (
        <div className="px-4 py-8 text-sm text-gray-500 sm:px-5">
          {debouncedSearchTerm.length > 0
            ? "ไม่พบพนักงานที่ตรงกับคำค้นหา"
            : "ไม่พบข้อมูลพนักงาน"}
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-100 md:hidden">
            {employees.map((employee) => (
              <div key={employee.id} className="p-4 hover:bg-gray-50">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{employee.name}</p>
                    <p className="text-xs text-gray-500">{employee.id}</p>
                  </div>
                  <StatusBadge status={employee.status} />
                </div>
                <div className="mb-3 space-y-1 text-sm text-gray-600">
                  <p>{employee.position}</p>
                  <p className="text-xs text-gray-500">{employee.department}</p>
                  <p className="text-xs text-gray-500">
                    เริ่มงาน: {formatDisplayDate(employee.startDate)}
                  </p>
                  <p className="text-xs text-gray-500">
                    เงินเดือน: {formatThaiCurrency(employee.salary)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEmployee(employee)}
                  className="w-full rounded-md bg-blue-50 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  ดูข้อมูล
                </button>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
                  <th className="p-4 font-medium">รหัส</th>
                  <th className="p-4 font-medium">ชื่อ - นามสกุล</th>
                  <th className="p-4 font-medium">ตำแหน่ง / แผนก</th>
                  <th className="p-4 font-medium">วันเริ่มงาน</th>
                  <th className="p-4 font-medium">เงินเดือน</th>
                  <th className="p-4 font-medium">สถานะ</th>
                  <th className="p-4 text-center font-medium">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="transition-colors hover:bg-blue-50/50"
                  >
                    <td className="p-4 text-gray-500">{employee.id}</td>
                    <td className="p-4 font-medium text-gray-900">
                      {employee.name}
                    </td>
                    <td className="p-4">
                      <div>{employee.position}</div>
                      <div className="text-xs text-gray-500">{employee.department}</div>
                    </td>
                    <td className="p-4">{formatDisplayDate(employee.startDate)}</td>
                    <td className="p-4">{formatThaiCurrency(employee.salary)}</td>
                    <td className="p-4">
                      <StatusBadge status={employee.status} />
                    </td>
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedEmployee(employee)}
                        className="rounded-md px-3 py-1 text-blue-600 transition-colors hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        ดูข้อมูล
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedEmployee ? (
        <EmployeeDetailModal
          isOpen={selectedEmployee !== null}
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      ) : null}
    </div>
  );
}
