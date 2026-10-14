"use client"

import * as React from "react"
import { DownloadIcon } from "lucide-react"

import {
  downloadExcelCsv,
  toExcelCsv,
} from "@/registry/bases/base/lib/iran"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/base/ui/table"

const rows = [
  { name: "آنا", amount: 1250000, status: "پرداخت‌شده" },
  { name: "سامان", amount: 890000, status: "در انتظار" },
  { name: "مینا", amount: 2400000, status: "پرداخت‌شده" },
]

export default function DataTableExcelDemo() {
  function exportCsv() {
    const csv = toExcelCsv(rows, [
      { key: "name", header: "نام" },
      { key: "amount", header: "مبلغ (تومان)" },
      { key: "status", header: "وضعیت" },
    ])
    downloadExcelCsv("payments.csv", csv)
  }

  return (
    <div className="w-full max-w-lg space-y-3 p-4" dir="rtl" lang="fa">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
          <DownloadIcon className="size-4" />
          خروجی Excel
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>مبلغ</TableHead>
              <TableHead>وضعیت</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                <TableCell className="tabular-nums">
                  {row.amount.toLocaleString("fa-IR")}
                </TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
