import { expect, test } from "@playwright/test";

test.describe("HR views", () => {
  test("navigates every main view without runtime crashes", async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "ภาพรวมระบบ (Dashboard)" })).toBeVisible();

    await page.getByRole("button", { name: "ทะเบียนพนักงาน" }).click();
    await expect(page.getByRole("heading", { name: "ทะเบียนประวัติพนักงาน" })).toBeVisible();
    await expect(page.getByRole("button", { name: "ดูข้อมูล" }).first()).toBeVisible();

    await page.getByRole("button", { name: "เวลาทำงาน & การลา" }).click();
    await expect(page.getByRole("heading", { name: /บันทึกเวลาทำงาน/ })).toBeVisible();
    await expect(page.getByRole("cell", { name: "มานะ อดทน" }).first()).toBeVisible();

    await page.getByRole("button", { name: "ระบบเงินเดือน" }).click();
    await expect(page.getByRole("heading", { name: "ระบบจัดการเงินเดือนและค่าตอบแทน" })).toBeVisible();

    await page.getByRole("button", { name: "แดชบอร์ด" }).click();
    await expect(page.getByRole("heading", { name: "ภาพรวมระบบ (Dashboard)" })).toBeVisible();

    await expect(page.getByText("This page couldn’t load")).toHaveCount(0);
    await expect(page.getByText("Runtime Error")).toHaveCount(0);
    await expect(page.getByText(/Objects are not valid as a React child/i)).toHaveCount(0);
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
});