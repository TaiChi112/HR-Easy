"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Briefcase,
  CalendarClock,
  CircleDollarSign,
  Clock,
  FileBadge,
  FileText,
  LayoutDashboard,
  Plus,
  Search,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

type MenuKey = "dashboard" | "employees" | "attendance" | "payroll";
type DetailTabKey = "info" | "attendance" | "payroll" | "warnings";
type Status = "ปกติ" | "ลางาน" | "ลาพักร้อน" | "ลาป่วย" | "มาสาย";

type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  startDate: string;
  salary: number;
  status: Extract<Status, "ปกติ" | "ลางาน">;
};

type AttendanceRecord = {
  date: string;
  empId: string;
  name: string;
  type: Extract<Status, "ลาพักร้อน" | "ลาป่วย" | "มาสาย">;
  note: string;
};

type PayrollRecord = {
  empId: string;
  name: string;
  base: number;
  commission: number;
  allowance: number;
  deduct: number;
  total: number;
};

type MenuDefinition = {
  key: MenuKey;
  label: string;
  icon: LucideIcon;
};

type DashboardStat = {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  target: MenuKey;
};

type DetailTabDefinition = {
  key: DetailTabKey;
  label: string;
  icon: LucideIcon;
};

type MenuButtonProps = {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
};

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
};

type StatusBadgeProps = {
  status: Status;
};

type TabButtonProps = {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
};

type DashboardViewProps = {
  onNavigate: (menu: MenuKey) => void;
};

type EmployeeListProps = {
  onSelect: (employee: Employee) => void;
};

type EmployeeDetailProps = {
  employee: Employee;
  onBack: () => void;
};

const mockEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "สมชาย ใจดี",
    position: "ผู้จัดการฝ่ายขาย",
    department: "ฝ่ายขาย",
    startDate: "2020-01-15",
    salary: 35000,
    status: "ปกติ",
  },
  {
    id: "EMP-002",
    name: "สมหญิง รักงาน",
    position: "พนักงานบัญชี",
    department: "บัญชีและการเงิน",
    startDate: "2021-03-01",
    salary: 25000,
    status: "ปกติ",
  },
  {
    id: "EMP-003",
    name: "มานะ อดทน",
    position: "เจ้าหน้าที่ IT",
    department: "ไอที",
    startDate: "2022-06-10",
    salary: 28000,
    status: "ลางาน",
  },
  {
    id: "EMP-004",
    name: "ปิติ ดีใจ",
    position: "พนักงานขาย",
    department: "ฝ่ายขาย",
    startDate: "2023-01-05",
    salary: 18000,
    status: "ปกติ",
  },
  {
    id: "EMP-005",
    name: "ชูใจ ร่าเริง",
    position: "ฝ่ายบุคคล",
    department: "ทรัพยากรบุคคล",
    startDate: "2019-11-20",
    salary: 30000,
    status: "ปกติ",
  },
];

const mockAttendance: AttendanceRecord[] = [
  {
    date: "2023-10-25",
    empId: "EMP-003",
    name: "มานะ อดทน",
    type: "ลาป่วย",
    note: "ไข้หวัดใหญ่",
  },
  {
    date: "2023-10-25",
    empId: "EMP-004",
    name: "ปิติ ดีใจ",
    type: "มาสาย",
    note: "สาย 15 นาที",
  },
  {
    date: "2023-10-24",
    empId: "EMP-001",
    name: "สมชาย ใจดี",
    type: "ลาพักร้อน",
    note: "พาครอบครัวไปเที่ยว",
  },
];

const mockPayroll: PayrollRecord[] = [
  {
    empId: "EMP-001",
    name: "สมชาย ใจดี",
    base: 35000,
    commission: 15000,
    allowance: 0,
    deduct: 0,
    total: 50000,
  },
  {
    empId: "EMP-002",
    name: "สมหญิง รักงาน",
    base: 25000,
    commission: 0,
    allowance: 1000,
    deduct: 0,
    total: 26000,
  },
  {
    empId: "EMP-003",
    name: "มานะ อดทน",
    base: 28000,
    commission: 0,
    allowance: 1000,
    deduct: 500,
    total: 28500,
  },
  {
    empId: "EMP-004",
    name: "ปิติ ดีใจ",
    base: 18000,
    commission: 5000,
    allowance: 1000,
    deduct: 200,
    total: 23800,
  },
];

const menuItems: MenuDefinition[] = [
  { key: "dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { key: "employees", label: "ทะเบียนพนักงาน", icon: Users },
  {
    key: "attendance",
    label: "เวลาทำงาน & การลา",
    icon: CalendarClock,
  },
  { key: "payroll", label: "ระบบเงินเดือน", icon: CircleDollarSign },
];

const menuTitles: Record<MenuKey, string> = {
  dashboard: "ภาพรวมระบบ (Dashboard)",
  employees: "ทะเบียนประวัติพนักงาน",
  attendance: "ระบบจัดการเวลาทำงานและการลา",
  payroll: "ระบบจัดการเงินเดือนและค่าตอบแทน",
};

const dashboardStats: DashboardStat[] = [
  {
    title: "พนักงานทั้งหมด",
    value: "45",
    icon: Users,
    color: "bg-blue-500",
    target: "employees",
  },
  {
    title: "ลางานวันนี้",
    value: "2",
    icon: CalendarClock,
    color: "bg-orange-500",
    target: "attendance",
  },
  {
    title: "มาสายวันนี้",
    value: "1",
    icon: Clock,
    color: "bg-red-500",
    target: "attendance",
  },
  {
    title: "รอบเงินเดือนถัดไป",
    value: "สิ้นเดือน",
    icon: CircleDollarSign,
    color: "bg-emerald-500",
    target: "payroll",
  },
];

const employeeDetailTabs: DetailTabDefinition[] = [
  { key: "info", label: "ข้อมูลพื้นฐาน & เอกสาร", icon: FileText },
  {
    key: "attendance",
    label: "ประวัติ ลา/ขาด/สาย",
    icon: CalendarClock,
  },
  { key: "payroll", label: "ข้อมูลเงินเดือน", icon: CircleDollarSign },
  {
    key: "warnings",
    label: "ประวัติการตักเตือน",
    icon: AlertTriangle,
  },
];

const statusStyles: Record<Status, string> = {
  ปกติ: "bg-green-100 text-green-700 border-green-200",
  ลางาน: "bg-orange-100 text-orange-700 border-orange-200",
  ลาพักร้อน: "bg-orange-100 text-orange-700 border-orange-200",
  ลาป่วย: "bg-yellow-100 text-yellow-700 border-yellow-200",
  มาสาย: "bg-red-100 text-red-700 border-red-200",
};

function renderActiveView(
  activeMenu: MenuKey,
  onNavigate: (menu: MenuKey) => void,
  onSelectEmployee: (employee: Employee) => void,
) {
  switch (activeMenu) {
    case "dashboard":
      return <DashboardView onNavigate={onNavigate} />;
    case "employees":
      return <EmployeeList onSelect={onSelectEmployee} />;
    case "attendance":
      return <AttendanceView />;
    case "payroll":
      return <PayrollView />;
    default:
      return <DashboardView onNavigate={onNavigate} />;
  }
}

export default function Page() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const handleMenuChange = (menu: MenuKey) => {
    setActiveMenu(menu);
    setSelectedEmployee(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      <aside className="flex w-64 flex-col bg-slate-900 text-white transition-all duration-300">
        <div className="flex items-center gap-3 border-b border-slate-800 p-5">
          <div className="rounded-lg bg-blue-500 p-2">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">HR Easy</h1>
            <p className="text-xs text-slate-400">ระบบจัดการบุคคล</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => (
            <MenuButton
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={activeMenu === item.key}
              onClick={() => handleMenuChange(item.key)}
            />
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4 text-center text-xs text-slate-400">
          รองรับพนักงานสูงสุด 50 คน
          <br />
          (ปัจจุบัน 45/50)
        </div>
      </aside>

      <main className="relative flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {menuTitles[activeMenu]}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
              A
            </div>
            <span className="text-sm font-medium">แอดมิน HR</span>
          </div>
        </header>

        <div className="relative flex-1 overflow-auto p-6">
          {selectedEmployee ? (
            <EmployeeDetail
              employee={selectedEmployee}
              onBack={() => setSelectedEmployee(null)}
            />
          ) : (
            renderActiveView(activeMenu, handleMenuChange, setSelectedEmployee)
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardView({ onNavigate }: DashboardViewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {dashboardStats.map((stat) => (
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5 text-gray-400" /> อัปเดตการเข้างานล่าสุด
            </h3>
            <button
              type="button"
              onClick={() => onNavigate("attendance")}
              className="text-sm text-blue-600 hover:underline"
            >
              ดูทั้งหมด
            </button>
          </div>
          <div className="space-y-3">
            {mockAttendance.slice(0, 3).map((item) => (
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
              className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-4 text-blue-700 transition-colors hover:bg-blue-100"
            >
              <Plus className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">เพิ่มพนักงานใหม่</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-4 text-green-700 transition-colors hover:bg-green-100"
            >
              <FileText className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">สรุปเงินเดือนเดือนนี้</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center rounded-lg bg-orange-50 p-4 text-orange-700 transition-colors hover:bg-orange-100"
            >
              <AlertTriangle className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">บันทึกใบเตือน</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center justify-center rounded-lg bg-purple-50 p-4 text-purple-700 transition-colors hover:bg-purple-100"
            >
              <CalendarClock className="mb-2 h-6 w-6" />
              <span className="text-sm font-medium">อนุมัติวันลา</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeeList({ onSelect }: EmployeeListProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, รหัสพนักงาน..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-80"
          />
        </div>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> เพิ่มพนักงาน
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
              <th className="p-4 font-medium">รหัส</th>
              <th className="p-4 font-medium">ชื่อ - นามสกุล</th>
              <th className="p-4 font-medium">ตำแหน่ง / แผนก</th>
              <th className="p-4 font-medium">วันเริ่มงาน</th>
              <th className="p-4 font-medium">สถานะ</th>
              <th className="p-4 text-center font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {mockEmployees.map((employee) => (
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
                  <div className="text-xs text-gray-500">
                    {employee.department}
                  </div>
                </td>
                <td className="p-4">{employee.startDate}</td>
                <td className="p-4">
                  <StatusBadge status={employee.status} />
                </td>
                <td className="p-4 text-center">
                  <button
                    type="button"
                    onClick={() => onSelect(employee)}
                    className="rounded-md px-3 py-1 text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    ดูข้อมูล
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmployeeDetail({ employee, onBack }: EmployeeDetailProps) {
  const [activeTab, setActiveTab] = useState<DetailTabKey>("info");

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-900"
      >
        <X className="h-4 w-4" /> ปิดหน้าต่าง
      </button>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-6 bg-linear-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-3xl font-bold backdrop-blur-sm">
            {employee.name.charAt(0)}
          </div>
          <div>
            <h2 className="mb-1 text-2xl font-bold">{employee.name}</h2>
            <p className="flex items-center gap-2 text-blue-100">
              <Briefcase className="h-4 w-4" /> {employee.position} (
              {employee.department})
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-blue-100">
              <FileBadge className="h-4 w-4" /> รหัส: {employee.id} | เริ่มงาน:{" "}
              {employee.startDate}
            </p>
          </div>
        </div>

        <div className="flex overflow-x-auto border-b border-gray-200 px-2">
          {employeeDetailTabs.map((tab) => (
            <TabButton
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </div>

        <div className="min-h-75 bg-gray-50/50 p-6">
          {activeTab === "info" && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <h4 className="mb-4 border-b pb-2 font-semibold text-gray-800">
                  ข้อมูลส่วนตัว
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">วันเกิด:</span>
                    <span>15 เมษายน 2530</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">เบอร์โทรศัพท์:</span>
                    <span>081-234-5678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">อีเมล:</span>
                    <span>somchai@company.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ที่อยู่:</span>
                    <span className="text-right">123 ถ.สุขุมวิท กทม.</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <h4 className="mb-4 flex justify-between border-b pb-2 font-semibold text-gray-800">
                  <span>เอกสารพนักงาน</span>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    + อัปโหลด
                  </button>
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 rounded border border-gray-100 bg-gray-50 p-2 text-sm">
                    <FileText className="h-4 w-4 text-blue-500" />
                    สำเนาบัตรประชาชน.pdf
                  </div>
                  <div className="flex items-center gap-2 rounded border border-gray-100 bg-gray-50 p-2 text-sm">
                    <FileText className="h-4 w-4 text-blue-500" />
                    สำเนาทะเบียนบ้าน.pdf
                  </div>
                  <div className="flex items-center gap-2 rounded border border-gray-100 bg-gray-50 p-2 text-sm">
                    <FileText className="h-4 w-4 text-blue-500" />
                    สัญญาจ้างงาน.pdf
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="p-3">วันที่</th>
                    <th className="p-3">ประเภท</th>
                    <th className="p-3">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3">2023-10-24</td>
                    <td className="p-3">
                      <StatusBadge status="ลาพักร้อน" />
                    </td>
                    <td className="p-3">พาครอบครัวไปเที่ยว</td>
                  </tr>
                  <tr>
                    <td className="p-3">2023-09-15</td>
                    <td className="p-3">
                      <StatusBadge status="มาสาย" />
                    </td>
                    <td className="p-3">รถติดหนัก สาย 20 นาที</td>
                  </tr>
                  <tr>
                    <td className="p-3">2023-08-02</td>
                    <td className="p-3">
                      <StatusBadge status="ลาป่วย" />
                    </td>
                    <td className="p-3">อาหารเป็นพิษ มีใบรับรองแพทย์</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "payroll" && (
            <div className="max-w-md rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h4 className="mb-4 border-b pb-2 font-semibold text-gray-800">
                โครงสร้างรายได้/เดือน
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">เงินเดือนพื้นฐาน:</span>
                  <span className="text-lg font-medium">
                    ฿{employee.salary.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">เบี้ยขยัน (สูงสุด):</span>
                  <span className="font-medium text-green-600">+ ฿1,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ค่าคอมมิชชั่น:</span>
                  <span className="font-medium text-blue-600">ตามยอดขาย</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "warnings" && (
            <div className="rounded-lg border border-red-100 bg-red-50/30 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-semibold text-red-800">
                  <AlertTriangle className="h-5 w-5" /> ประวัติการตักเตือน
                </h4>
                <button
                  type="button"
                  className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                >
                  + เพิ่มใบเตือน
                </button>
              </div>
              <div className="rounded border border-gray-100 bg-white py-8 text-center text-sm text-gray-500">
                ไม่มีประวัติการตักเตือน (พฤติกรรมดีเยี่ยม)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AttendanceView() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            บันทึกเวลาทำงาน (ลา / ขาด / สาย)
          </h3>
          <p className="text-sm text-gray-500">ข้อมูลประจำเดือน ตุลาคม 2566</p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + บันทึกการลา/สาย
        </button>
      </div>

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
          {mockAttendance.map((record) => (
            <tr
              key={`${record.date}-${record.empId}-${record.type}`}
              className="hover:bg-gray-50"
            >
              <td className="p-3">{record.date}</td>
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
  );
}

function PayrollView() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">สรุปเงินเดือนพนักงาน</h3>
          <p className="text-sm text-gray-500">งวดบัญชี: ตุลาคม 2566</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            ส่งออก Excel
          </button>
          <button
            type="button"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
          >
            ยืนยันจ่ายเงินเดือน
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 font-medium">รหัส</th>
              <th className="p-3 font-medium">ชื่อพนักงาน</th>
              <th className="p-3 text-right font-medium">เงินเดือน (Base)</th>
              <th className="p-3 text-right font-medium text-blue-600">
                ค่าคอมฯ
              </th>
              <th className="p-3 text-right font-medium text-green-600">
                เบี้ยขยัน
              </th>
              <th className="p-3 text-right font-medium text-red-600">
                หักสาย/ลา
              </th>
              <th className="bg-blue-50 p-3 text-right font-medium">
                รับสุทธิ (Net)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockPayroll.map((payroll) => (
              <tr key={payroll.empId} className="hover:bg-gray-50">
                <td className="p-3 text-gray-500">{payroll.empId}</td>
                <td className="p-3 font-medium">{payroll.name}</td>
                <td className="p-3 text-right">
                  {payroll.base.toLocaleString()}
                </td>
                <td className="p-3 text-right">
                  {payroll.commission > 0
                    ? payroll.commission.toLocaleString()
                    : "-"}
                </td>
                <td className="p-3 text-right">
                  {payroll.allowance > 0
                    ? payroll.allowance.toLocaleString()
                    : "-"}
                </td>
                <td className="p-3 text-right text-red-500">
                  {payroll.deduct > 0
                    ? `-${payroll.deduct.toLocaleString()}`
                    : "-"}
                </td>
                <td className="bg-blue-50/50 p-3 text-right font-bold text-blue-800">
                  ฿{payroll.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MenuButton({ icon: Icon, label, active, onClick }: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon: Icon, color, onClick }: StatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-shadow hover:border-blue-200 hover:shadow-md"
    >
      <div className={`${color} rounded-lg p-3 text-white`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="mb-1 text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </button>
  );
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800"
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
