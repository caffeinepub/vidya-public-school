import { PublicLayout } from "@/components/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/utils/helpers";
import { Calendar, Megaphone } from "lucide-react";

export default function NoticesPublicPage() {
  const { notices } = useApp();

  return (
    <PublicLayout>
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-3 bg-white/20 text-white border-white/30">
            Announcements
          </Badge>
          <h1 className="text-3xl font-bold mb-3">Notice Board</h1>
          <p className="text-primary-foreground/70">
            Stay updated with latest school announcements and events.
          </p>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {notices.length === 0 ? (
            <div className="text-center py-16" data-ocid="notices.empty_state">
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No notices available at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <Card key={notice.noticeId} className="border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Megaphone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {notice.title}
                          </h3>
                          {notice.targetRole && (
                            <Badge variant="outline" className="text-xs">
                              {notice.targetRole}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {notice.content}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(notice.postedDate)}
                          </span>
                          <span>By: {notice.postedBy}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
