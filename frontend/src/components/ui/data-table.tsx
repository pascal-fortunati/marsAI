import type { ReactNode } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

export type DataTableColumn<TData> = {
  header: ReactNode
  cell: (row: TData) => ReactNode
  className?: string
  headerClassName?: string
}

export function DataTable<TData>({
  columns,
  data,
  emptyLabel = 'Aucune donnée.',
}: {
  columns: DataTableColumn<TData>[]
  data: TData[]
  emptyLabel?: string
}) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c, i) => (
              <TableHead key={i} className={c.headerClassName}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <TableRow key={rowIdx}>
                {columns.map((c, colIdx) => (
                  <TableCell key={colIdx} className={c.className}>
                    {c.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                {emptyLabel}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
