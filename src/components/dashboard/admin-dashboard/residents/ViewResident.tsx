import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { type Resident } from "@/services/resident.api";

interface ViewResidentProps {
  viewing: Resident | null;
  onClose: () => void;
}

// 🧑‍💼 Utility to format date strings for display
function formatDate(date?: string | null) {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

export default function ViewResident({ viewing, onClose }: ViewResidentProps) {
  return (
    <Sheet open={!!viewing} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="max-w-md w-full">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Resident Details</SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        {viewing && (
            <CardContent className="py-6 space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Full Name</div>
                <div className="font-semibold text-lg">
                  {viewing.first_name}{" "}
                  {viewing.middle_name ? viewing.middle_name + " " : ""}
                  {viewing.last_name}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div>
                  <span className="text-xs text-muted-foreground">Age</span>
                  <div className="font-medium">{viewing.age}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Gender</span>
                  <div>
                    <Badge variant="outline">{viewing.gender}</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Civil Status</span>
                  <div>
                    <Badge variant="secondary">{viewing.civil_status}</Badge>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-xs text-muted-foreground mb-1">Barangay</div>
                <div className="font-medium">{viewing.barangay}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Address</div>
                <div className="font-medium">{viewing.address}</div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Occupation</span>
                  <div className="font-medium">{viewing.occupation ?? "-"}</div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Contact #</span>
                  <div className="font-medium">{viewing.contact_number ?? "-"}</div>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Created</span>
                <span className="text-xs">{formatDate(viewing.created_at)}</span>
                <span className="text-xs text-muted-foreground">Updated</span>
                <span className="text-xs">{formatDate(viewing.updated_at)}</span>
              </div>
            </CardContent>
        )}
      </SheetContent>
    </Sheet>

  );
}