import { PageShell } from "@/components/ui/PageShell";
import { AuvViewer } from "@/components/auv/AuvViewer";

export function Models() {
  return (
    <PageShell title="AUV models">
      <div className="panel panel--hud">
        <AuvViewer />
      </div>
    </PageShell>
  );
}

