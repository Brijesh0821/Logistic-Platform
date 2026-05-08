import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiChevronsUp } from "react-icons/fi";
import Button from "./Button";
import EmptyState from "./EmptyState";

const valueFor = (row, column) => {
  const value = column.accessor ? column.accessor(row) : row[column.key];
  return value ?? "";
};

export default function DataTable({ columns, data = [], emptyTitle, emptyMessage }) {
  const [sort, setSort] = useState({ key: columns[0]?.key, direction: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const sortedData = useMemo(() => {
    const column = columns.find((item) => item.key === sort.key);
    if (!column || column.sortable === false) return data;

    return [...data].sort((a, b) => {
      const first = String(valueFor(a, column)).toLowerCase();
      const second = String(valueFor(b, column)).toLowerCase();
      return sort.direction === "asc"
        ? first.localeCompare(second, undefined, { numeric: true })
        : second.localeCompare(first, undefined, { numeric: true });
    });
  }, [columns, data, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const updateSort = (column) => {
    if (column.sortable === false) return;
    setPage(1);
    setSort((current) => ({
      key: column.key,
      direction: current.key === column.key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (!data.length) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <button
                    type="button"
                    onClick={() => updateSort(column)}
                    className="inline-flex items-center gap-1 rounded text-left hover:text-slate-900"
                  >
                    {column.header}
                    {column.sortable !== false && (
                      <FiChevronsUp
                        className={`h-3.5 w-3.5 transition ${
                          sort.key === column.key && sort.direction === "desc" ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {pagedData.map((row, index) => (
              <tr key={row._id || row.id || index} className="transition hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                    {column.render ? column.render(row) : valueFor(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="px-3 py-2" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
            <FiChevronLeft /> Prev
          </Button>
          <span className="font-medium text-slate-700">
            {currentPage} / {totalPages}
          </span>
          <Button variant="secondary" className="px-3 py-2" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
            Next <FiChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
