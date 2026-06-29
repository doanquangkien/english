import { createClient } from "@/lib/supabase/server";
import { Users, BookOpen, Activity, Wrench } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();

  // Fetch real stats (with graceful fallback if tables are empty)
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium text-foreground">
          Tổng quan hệ thống
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản trị nền tảng ENGLISH
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-[4px] border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users size={16} />
            Người dùng
          </div>
          <p className="mt-2 text-2xl font-medium text-foreground">
            {totalUsers ?? 0}
          </p>
        </div>

        <div className="rounded-[4px] border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen size={16} />
            Khoá học
          </div>
          <p className="mt-2 text-2xl font-medium text-foreground">—</p>
        </div>

        <div className="rounded-[4px] border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity size={16} />
            Hôm nay
          </div>
          <p className="mt-2 text-2xl font-medium text-foreground">—</p>
        </div>

        <div className="rounded-[4px] border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wrench size={16} />
            Phase
          </div>
          <p className="mt-2 text-2xl font-medium text-foreground">01</p>
        </div>
      </div>

      {/* Placeholder for future admin features */}
      <div className="rounded-[4px] border border-border bg-card p-6">
        <h2 className="text-lg font-medium text-foreground">Quản lý</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Chức năng quản lý chi tiết sẽ được bổ sung trong các phase tiếp theo.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { label: "Người dùng", desc: "Quản lý tài khoản & phân quyền" },
            { label: "Khoá học", desc: "Tạo & quản lý nội dung học" },
            { label: "Quiz", desc: "Quản lý câu hỏi & bài kiểm tra" },
            { label: "Blog", desc: "Quản lý bài viết & SEO" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[4px] border border-border p-4"
            >
              <div className="font-medium text-sm text-foreground">
                {item.label}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
