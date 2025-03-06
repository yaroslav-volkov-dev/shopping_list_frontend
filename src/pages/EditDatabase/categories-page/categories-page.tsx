import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '@/constants/endpoints.js';
import { axiosInstance } from '@/api/axiosConfig.js';
import { AddCategoryDialog } from '../components/add-category-dialog.tsx';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { getQueryStringParams } from '@/utils/get-query-string-params.ts';
import { categoriesQueryKey } from '../queries.ts';
import { notify } from '@/utils/notify.ts';
import { ConfirmationDialog } from '@/components/confirmation-modal/confirmation-dialog.tsx';
import { CategoryModel } from "@/models";
import { Maybe } from "@/types/utility.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { EditCategoryDialog } from "@/pages/EditDatabase/components/edit-category-dialog.tsx";
import { ProductsQueryFilterKey } from "@/types/products-query.types.ts";
import { NavLink } from "react-router-dom";
import { EyeIcon } from "lucide-react";

const columnHelper = createColumnHelper<CategoryModel>();

export const CategoriesPage = () => {
  const client = useQueryClient();
  const includeCount = true;

  const { data: categoriesData } = useQuery<CategoryModel[]>({
    queryKey: [categoriesQueryKey.includeCount(includeCount)],
    queryFn: async () => axiosInstance.get(getQueryStringParams(ENDPOINTS.CATEGORIES, { includeCount }))
  });

  const { mutate: deleteCategory } = useMutation({
    mutationFn: (categoryId: number) => axiosInstance.delete(`${ENDPOINTS.CATEGORIES}/${categoryId}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [categoriesQueryKey.all] });
      notify({ message: 'Category successfully deleted!' });
    }
  });

  const handleDeleteCategory = useCallback((categoryId: Maybe<number>) => {
    if (!categoryId) {
      notify({ type: 'error', message: 'Category ID is not provided' });
      return;
    }

    deleteCategory(categoryId);
  }, [deleteCategory]);

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((originalRow) => originalRow?._count?.Product, {
      header: 'In Category',
      cell: ({ getValue, row }) => {
        const value = getValue();

        const url = getQueryStringParams('/edit-database/products', {
          [ProductsQueryFilterKey.CATEGORIES_IDS]: row.original.id
        });

        return (
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{value}</span>
            {value > 0 && (
              <NavLink to={url} className="relative top-[1px]">
                <EyeIcon size={20} className="hover:text-blue-500" />
              </NavLink>
            )}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-4">
          <ConfirmationDialog
            onConfirm={() => handleDeleteCategory(row.original?.id)}
            message={`Do you really want to delete '${row.original?.name || ''}' category?`}
            trigger={<Button variant="outline">Delete</Button>}
          />
          <EditCategoryDialog category={row.original} />
        </div>
      ),
    }),
  ], [handleDeleteCategory, categoriesData]);


  const tableInstance = useReactTable({
    data: categoriesData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = useMemo(() => tableInstance.getRowModel().rows, [categoriesData]);
  const headerGroups = useMemo(() => tableInstance.getHeaderGroups(), [categoriesData]);

  return (
    <>
      <div className="flex flex-col items-start gap-3">
        <AddCategoryDialog />
        <div className="h-full bg-white border border-gray-300 rounded">
          <table className="w-full border-collapse table-fixed">
            <thead className="border-b border-gray-300">
            {headerGroups.map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}
                      align="left"
                      className="px-3 py-2 border-r border-gray-300 last:border-none">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
            </thead>
            <tbody>
            {rows.map(row => (
              <tr key={row.id}
                  className="border-b border-gray-300">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}
                      className="px-3 py-2 border-r border-gray-300 last:border-none">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};