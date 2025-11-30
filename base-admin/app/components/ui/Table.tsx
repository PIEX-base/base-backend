import type { TableProps } from "~/interfaces/table";

const SortIcon = () => (
  <svg
    className="w-3 h-3 ms-1.5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24">
    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
  </svg>
);

export const Table = ({
  columns,
  data,
  onSort,
  sortKey,
  sortDirection,
  className,
}: TableProps) => {
  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key);
    }
  };

  return (
    <div
      className={`relative overflow-x-auto shadow-md sm:rounded-lg ${
        className || ""
      }`}>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        {/* Table Header */}
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-6 py-3">
                {column.sortable ? (
                  <div className="flex items-center">
                    {column.label}
                    <button
                      onClick={() => handleSort(column.key)}
                      className="ml-1 hover:text-primary dark:hover:text-primary transition-colors">
                      <SortIcon />
                    </button>
                  </div>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`
                bg-white dark:bg-gray-800 
                ${
                  rowIndex < data.length - 1
                    ? "border-b dark:border-gray-700 border-gray-200"
                    : ""
                }
              `}>
              {columns.map((column, colIndex) => {
                const cellContent = column.render
                  ? column.render(row[column.key], row)
                  : row[column.key];

                return (
                  <td
                    key={column.key}
                    className={`
                      px-6 py-4 
                      ${
                        colIndex === 0
                          ? "font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          : ""
                      }
                    `}
                    {...(colIndex === 0 ? { scope: "row" } : {})}>
                    <p>{cellContent}</p>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
