import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  ResidentsService,
  type Resident,
  type ResidentsQuery,
  type Paginated,
} from "@/services/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

function useResidents(params: ResidentsQuery) {
  return useQuery<Paginated<Resident>>({
    queryKey: ["residents", params],
    queryFn: () => ResidentsService.list(params),
    placeholderData: (prev) => prev, // keep previous page data while fetching
  });
}

export default function ResidentsTable() {
  // Global search
  const [q, setQ] = React.useState("");

  // Table state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Derive API params from table state
  const sortBy: ResidentsQuery["sortBy"] | undefined =
    sorting[0]?.id as keyof Resident | undefined;
  const sortDir: ResidentsQuery["sortDir"] | undefined = sorting[0]
    ? sorting[0].desc
      ? "desc"
      : "asc"
    : undefined;

  const genderFilter = columnFilters.find((f) => f.id === "gender");
  const barangayFilter = columnFilters.find((f) => f.id === "barangay");
  const gender = Array.isArray(genderFilter?.value)
    ? (genderFilter?.value?.[0] as Resident["gender"]) || undefined
    : undefined;
  const barangay = typeof barangayFilter?.value === "string"
    ? (barangayFilter?.value as string) || undefined
    : undefined;

  const params = useMemo(
    () => ({
      q: q || undefined,
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      sortBy,
      sortDir,
      gender,
      barangay,
    }),
    [q, pagination.pageIndex, pagination.pageSize, sortBy, sortDir, gender, barangay],
  );

  const { data, isLoading, isFetching } = useResidents(params);
  const queryClient = useQueryClient();

  // Mutations (optimistic)
  const createMutation = useMutation({
    mutationFn: ResidentsService.create,
    onMutate: async (payload) => {
      const key = ["residents", params] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<Paginated<Resident>>(key);
      const optimistic: Paginated<Resident> = {
        data: [
          {
            ...(payload as unknown as Resident),
            id: Math.floor(Math.random() * 1e9),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          ...(prev?.data ?? []),
        ],
        page: prev?.page ?? 1,
        pageSize: prev?.pageSize ?? pagination.pageSize,
        total: (prev?.total ?? 0) + 1,
      };
      queryClient.setQueryData(key, optimistic);
      return { prev } as const;
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["residents", params], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Resident> }) =>
      ResidentsService.update(id, data),
    onMutate: async ({ id, data }) => {
      const key = ["residents", params] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<Paginated<Resident>>(key);
      const optimistic: Paginated<Resident> | undefined = prev
        ? { ...prev, data: prev.data.map((r) => (r.id === id ? { ...r, ...data } : r)) }
        : prev;
      if (optimistic) queryClient.setQueryData(key, optimistic);
      return { prev } as const;
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["residents", params], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });

  // Columns
  const columns = React.useMemo<ColumnDef<Resident>[]>(
    () => [
      {
        accessorKey: "first_name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="First Name" />
        ),
        enableSorting: true,
        meta: { label: "First Name" },
      },
      {
        accessorKey: "last_name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Name" />
        ),
        enableSorting: true,
        meta: { label: "Last Name" },
      },
      {
        accessorKey: "barangay",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Barangay" />
        ),
        enableSorting: true,
        enableColumnFilter: true,
        meta: { label: "Barangay", variant: "text", placeholder: "Barangay" },
      },
      {
        accessorKey: "age",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Age" />
        ),
        enableSorting: true,
        meta: { label: "Age" },
      },
      {
        accessorKey: "gender",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Gender" />
        ),
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          label: "Gender",
          variant: "select",
          options: [
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
          ],
        },
      },
      {
        accessorKey: "occupation",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Occupation" />
        ),
        enableSorting: true,
        meta: { label: "Occupation" },
        cell: ({ row }) => row.original.occupation ?? "-",
      },
      {
        id: "actions",
        header: () => <span>Actions</span>,
        enableHiding: false,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const nextJob = r.occupation ? null : "Updated Job";
                  toast.promise(
                    updateMutation.mutateAsync({ id: r.id, data: { occupation: nextJob } }),
                    {
                      loading: "Updating...",
                      success: "Updated",
                      error: "Update failed",
                    },
                  );
                }}
              >
                Toggle Occupation
              </Button>
              {isFetching && <span className="text-xs text-muted-foreground">…</span>}
            </div>
          );
        },
      },
    ],
    [updateMutation, isFetching],
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    pageCount: data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : -1,
    onSortingChange: (updater) => {
      setPagination((p) => ({ ...p, pageIndex: 0 }));
      setSorting(typeof updater === "function" ? updater(sorting) : updater);
    },
    onColumnFiltersChange: (updater) => {
      setPagination((p) => ({ ...p, pageIndex: 0 }));
      setColumnFilters(
        typeof updater === "function" ? updater(columnFilters) : updater,
      );
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;
      setPagination(next);
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const handleCreate = () => {
    const payload = {
      first_name: "New",
      last_name: "Resident",
      middle_name: null,
      age: 30,
      gender: "Male" as const,
      address: "Unknown",
      barangay: "Barangay 1",
      contact_number: null,
      occupation: null,
      civil_status: "Single" as const,
      created_by: 1,
    } satisfies Omit<Resident, "id" | "created_at" | "updated_at">;

    toast.promise(createMutation.mutateAsync(payload), {
      loading: "Adding resident...",
      success: "Resident added",
      error: "Failed to add resident",
    });
  };

  // Loading skeleton
  if (isLoading && !data) {
    return (
      <Card className="p-4">
        <DataTableSkeleton columnCount={7} filterCount={2} />
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search..."
              value={q}
              onChange={(e) => {
                setPagination((p) => ({ ...p, pageIndex: 0 }));
                setQ(e.target.value);
              }}
              className="h-8 w-40 lg:w-56"
            />
            {isFetching && (
              <span className="text-xs text-muted-foreground">Refreshing…</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreate}
              disabled={createMutation.isPending}
            >
              Add Resident
            </Button>
          </div>
        </DataTableToolbar>
      </DataTable>
    </Card>
  );
}
