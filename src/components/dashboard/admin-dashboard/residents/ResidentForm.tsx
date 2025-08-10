"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Resident } from "@/services/resident.api";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  middle_name: z.string().optional().nullable(),
  age: z.coerce.number().int().min(0, "Age must be a positive number"),
  gender: z.enum(["Male", "Female"], {
    message: "Gender is required",
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
  const form = useForm<ResidentFormValues>({
    resolver: zodResolver(formSchema) as any, // 🛠️ Type workaround for zodResolver inference issue with z.coerce
    defaultValues: {
      first_name: defaultValues?.first_name ?? "",
      last_name: defaultValues?.last_name ?? "",
      middle_name: defaultValues?.middle_name ?? "",
      age: typeof defaultValues?.age === "number" ? defaultValues.age : 0,
      gender: (defaultValues?.gender as ResidentFormValues["gender"]) ?? "Male",
      address: defaultValues?.address ?? "",
      barangay: defaultValues?.barangay ?? "",
      contact_number: defaultValues?.contact_number ?? "",
      occupation: defaultValues?.occupation ?? "",
      civil_status: (defaultValues?.civil_status as ResidentFormValues["civil_status"]) ?? "Single",
    },
  });

  return (
    <Form {...form}>
      <form
        className="grid gap-3"
        onSubmit={form.handleSubmit(async (vals) => {
          await onSubmit(vals);
        })}
      >
        <DialogDescription className="sr-only">Resident form</DialogDescription>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Dela Cruz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middle_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Santos" 
                  {...field} 
                  value={field.value ?? ""}
                />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="numeric" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={field.disabled}
                >
                  <FormControl>
                  <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="civil_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={field.disabled}
                >
                  <FormControl>
                  <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="barangay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barangay</FormLabel>
                <FormControl>
                  <Input placeholder="Barangay 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact #</FormLabel>
                <FormControl>
                  <Input
                    placeholder="09xxxxxxxxx"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input 
                  placeholder="Teacher" {...field} 
                  value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading || form.formState.isSubmitting}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
