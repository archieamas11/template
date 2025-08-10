"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Resident } from "@/services/api";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string().optional().nullable(),
  age: z.coerce.number().int().min(0, "Age must be a positive number"),
  gender: z.enum(["Male", "Female"], {
    required_error: "Gender is required",
  }),
  address: z.string().min(1, "Address is required"),
  barangay: z.string().min(1, "Barangay is required"),
  contact_number: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  civil_status: z.enum(["Single", "Married", "Divorced", "Widowed"]).optional().default("Single"),
});

export type ResidentFormValues = z.infer<typeof formSchema>;

export function ResidentForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save",
  loading = false,
}: {
  defaultValues?: Partial<Resident>;
  onSubmit: (values: ResidentFormValues) => Promise<unknown> | void;
  submitLabel?: string;
  loading?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ResidentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: defaultValues?.first_name ?? "",
      last_name: defaultValues?.last_name ?? "",
      middle_name: defaultValues?.middle_name ?? "",
      age: (defaultValues?.age as number | undefined) ?? 0,
      gender: (defaultValues?.gender as Resident["gender"]) ?? "Male",
      address: defaultValues?.address ?? "",
      barangay: defaultValues?.barangay ?? "",
      contact_number: defaultValues?.contact_number ?? "",
      occupation: defaultValues?.occupation ?? "",
      civil_status: (defaultValues?.civil_status as Resident["civil_status"]) ?? "Single",
    },
  });

  return (
    <form
      className="grid gap-3"
      onSubmit={handleSubmit(async (vals) => {
        await onSubmit(vals);
      })}
    >
      <DialogDescription className="sr-only">Resident form</DialogDescription>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" {...register("first_name")} placeholder="Juan" />
          {errors.first_name && (
            <span className="text-destructive text-xs">{errors.first_name.message}</span>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" {...register("last_name")} placeholder="Dela Cruz" />
          {errors.last_name && (
            <span className="text-destructive text-xs">{errors.last_name.message}</span>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="middle_name">Middle Name</Label>
          <Input id="middle_name" {...register("middle_name")} placeholder="Santos" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" inputMode="numeric" {...register("age", { valueAsNumber: true })} />
          {errors.age && (
            <span className="text-destructive text-xs">{errors.age.message}</span>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label>Gender</Label>
          <Select
            value={String((register as any).getValues?.("gender") ?? undefined)}
            onValueChange={(v) => setValue("gender", v as ResidentFormValues["gender"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <span className="text-destructive text-xs">{errors.gender.message}</span>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label>Marital Status</Label>
          <Select
            value={String((register as any).getValues?.("civil_status") ?? undefined)}
            onValueChange={(v) => setValue("civil_status", v as ResidentFormValues["civil_status"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="Married">Married</SelectItem>
              <SelectItem value="Divorced">Divorced</SelectItem>
              <SelectItem value="Widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-2 grid gap-1.5">
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register("address")} placeholder="123 Main St" />
          {errors.address && (
            <span className="text-destructive text-xs">{errors.address.message}</span>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="barangay">Barangay</Label>
          <Input id="barangay" {...register("barangay")} placeholder="Barangay 1" />
          {errors.barangay && (
            <span className="text-destructive text-xs">{errors.barangay.message}</span>
          )}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="contact_number">Contact #</Label>
          <Input id="contact_number" {...register("contact_number")} placeholder="09xxxxxxxxx" />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input id="occupation" {...register("occupation")} placeholder="Teacher" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={loading || isSubmitting}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
