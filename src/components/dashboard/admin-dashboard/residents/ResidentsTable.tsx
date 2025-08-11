import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  RowSelectionState,
} from "@tanstack/react-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  ResidentsService,
  type ResidentsQuery,
  type Paginated,
  type Resident
} from "@/services/resident.api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ResidentForm, type ResidentFormValues } from "./ResidentForm";
import { MoreHorizontal } from "lucide-react";
import { Suspense, lazy } from "react";
const ViewResident = lazy(() => import("./ViewResident"));

// ✅ Indeterminate checkbox for header/rows selection
const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }
>(({ indeterminate, ...props }, ref) => {
  const localRef = React.useRef<HTMLInputElement>(null);
  const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? localRef;

  React.useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = Boolean(indeterminate) && !props.checked;
    }
  }, [indeterminate, props.checked, resolvedRef]);

  return (
    <input
      ref={resolvedRef}
      type="checkbox"
      {...props}
    />
  );
});
IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

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
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  // Derive API params from table state
  const sortBy: ResidentsQuery["sortBy"] | undefined =
    sorting[0]?.id as keyof Resident | undefined;
  const sortDir: ResidentsQuery["sortDir"] | undefined = sorting[0]
    ? sorting[0].desc
      ? "desc"
      : "asc"
    : undefined;

  // Extract first selected value from filter (supports string or array)
  const toSingleValue = (value: unknown): string | undefined => {
    if (Array.isArray(value)) return (value[0] as string) || undefined;
    return typeof value === "string" ? (value || undefined) : undefined;
  };

  const genderFilter = columnFilters.find((f) => f.id === "gender");
  const barangayFilter = columnFilters.find((f) => f.id === "barangay");
  const gender = toSingleValue(genderFilter?.value) as Resident["gender"] | undefined;
  const barangay = toSingleValue(barangayFilter?.value);

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

  // Build dynamic Barangay options from current page data
  const barangayOptions = React.useMemo(
    () =>
      Array.from(
        new Set((data?.data ?? []).map((r) => r.barangay).filter(Boolean)),
      )
        .sort((a, b) => a.localeCompare(b))
        .map((b) => ({ label: b, value: b })),
    [data],
  );

  // Dialog / Drawer state
  const [openCreate, setOpenCreate] = React.useState(false);
  const [editing, setEditing] = React.useState<Resident | null>(null);
  const [viewing, setViewing] = React.useState<Resident | null>(null);

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

  const archiveMutation = useMutation({
    mutationFn: (id: number) => ResidentsService.delete(id),
    onMutate: async (id) => {
      const key = ["residents", params] as const;
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<Paginated<Resident>>(key);
      const optimistic: Paginated<Resident> | undefined = prev
        ? { ...prev, data: prev.data.filter((r) => r.id !== id), total: Math.max(0, (prev.total ?? 0) - 1) }
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
  const columns = React.useMemo<ColumnDef<Resident>[]>
    (() => [
      // Selection column
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            aria-label="Select all rows"
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            aria-label={`Select row ${row.index + 1}`}
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            disabled={!row.getCanSelect?.()}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 32,
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="ID" />
        ),
        enableSorting: true,
        meta: { label: "ID" },
      },
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
        meta: { label: "Barangay", variant: "select", options: barangayOptions },
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
        enableHiding: false,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8 p-0" variant="ghost">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-50" align="end">
              <DropdownMenuItem onSelect={() => setViewing(r)}>View</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setEditing(r)}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    const doArchive = async () => {
                      await archiveMutation.mutateAsync(r.id);
                    };
                    toast.promise(doArchive(), {
                      loading: "Archiving resident...",
                      success: "Resident archived",
                      error: "Failed to archive resident",
                    });
                  }}
                >
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [archiveMutation, barangayOptions],
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection,
    },
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getRowId: (row) => String(row.id),
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
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

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
            <Dialog open={openCreate} onOpenChange={setOpenCreate}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={createMutation.isPending}
                >
                  Add Resident
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Resident</DialogTitle>
                </DialogHeader>
                <ResidentForm
                  onSubmit={async (vals: ResidentFormValues) => {
                    const payload = {
                      ...vals,
                      middle_name: vals.middle_name ?? null,
                      contact_number: vals.contact_number ?? null,
                      occupation: vals.occupation ?? null,
                      created_by: 1,
                    } satisfies Omit<Resident, "id" | "created_at" | "updated_at">;
                    await toast.promise(createMutation.mutateAsync(payload), {
                      loading: "Adding resident...",
                      success: "Resident added",
                      error: "Failed to add resident",
                    });
                    setOpenCreate(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </DataTableToolbar>
      </DataTable>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resident</DialogTitle>
          </DialogHeader>
          {editing && (
            <ResidentForm
              defaultValues={editing}
              submitLabel="Update"
              loading={updateMutation.isPending}
              onSubmit={async (vals) => {
                const id = editing.id;
                await toast.promise(
                  updateMutation.mutateAsync({ id, data: vals as Partial<Resident> }),
                  {
                    loading: "Updating resident...",
                    success: "Resident updated",
                    error: "Failed to update resident",
                  },
                );
                setEditing(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View drawer */}
      <Suspense fallback={<div>Loading...</div>}>
        <ViewResident
          viewing={viewing}
          onClose={() => setViewing(null)}
        />
      </Suspense>
    </Card>
  );
}
