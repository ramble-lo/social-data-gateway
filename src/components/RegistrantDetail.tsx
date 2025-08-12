import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  MessageSquare,
} from "lucide-react";
import {
  RegistrantFromFirebase,
  ResidentStatusDisplayEnum,
} from "@/types/registrant";
import { useGetRegistrantHistoryById } from "@/api/registration";

interface RegistrantDetailProps {
  registrant: RegistrantFromFirebase | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegistrantDetail = ({
  registrant,
  open,
  onOpenChange,
}: RegistrantDetailProps) => {
  const { data: registrationHistory } = useGetRegistrantHistoryById(
    registrant.id
  );
  if (!registrant || !registrationHistory) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {registrant.name} 的報名記錄
          </DialogTitle>
          <DialogDescription>
            查看此報名者的詳細資料和活動參與歷史
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 基本資料 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">基本資料</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">姓名：</span>
                <span className="font-medium">{registrant.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">性別：</span>
                <span>{registrant.gender || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">信箱：</span>
                <span>{registrant.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">電話：</span>
                <span>{registrant.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Line ID：</span>
                <span>{registrant.line_id || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">住戶身份：</span>
                <Badge variant={"default"}>
                  {ResidentStatusDisplayEnum[registrant.residient_type]}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* 報名歷史 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>報名歷史</span>
                <Badge variant="outline">
                  共 {registrationHistory.length} 次報名
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {registrationHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">尚無報名記錄</p>
              ) : (
                registrationHistory.map((history) => (
                  <Card
                    key={history.id}
                    className="border-l-4 border-l-foreground"
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium">
                            {history.activity_name}
                          </h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {history.submit_time
                              .toDate()
                              .toLocaleString("zh-TW")}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {history.age && (
                            <div>
                              <span className="text-muted-foreground">年齡：</span>
                              <span>{history.age}</span>
                            </div>
                          )}
                          {history.children_count && (
                            <div>
                              <span className="text-muted-foreground">兒童人數：</span>
                              <span>{history.children_count}</span>
                            </div>
                          )}
                          {history.info_source && (
                            <div className="col-span-2">
                              <span className="text-muted-foreground">資訊來源：</span>
                              <span>{history.info_source}</span>
                            </div>
                          )}
                        </div>

                        {history.suggestions && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <div>
                                <span className="text-sm text-muted-foreground">
                                  建議與備註：
                                </span>
                                <p className="text-sm mt-1">
                                  {history.suggestions}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrantDetail;
