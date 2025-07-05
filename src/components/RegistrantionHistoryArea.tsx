import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import useRegistrantion from "@/hooks/useRegistrantion";
import { ResidentStatusDisplayEnum } from "@/types/registrant";

interface RegistrantDetailProps {
  value: string;
}

const RegistrantionHistoryArea = ({ value }: RegistrantDetailProps) => {
  const { registrantionHistory } = useRegistrantion();
  // useRegistrants
  if (!registrantionHistory) return null;

  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              報名資料總覽
            </div>
            <Badge variant="secondary">
              總計 {registrantionHistory.length} 筆資料
            </Badge>
          </CardTitle>
          <CardDescription>目前資料庫中的所有報名者資料</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>活動名稱</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>性別</TableHead>
                  <TableHead>年齡</TableHead>
                  <TableHead>電子郵件</TableHead>
                  <TableHead>聯絡電話</TableHead>
                  <TableHead>Line ID</TableHead>
                  <TableHead>是否為住戶</TableHead>
                  <TableHead>資訊來源</TableHead>
                  <TableHead>填答時間</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrantionHistory.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>{registration.activity_name}</TableCell>
                    <TableCell className="font-medium max-w-xl truncate">
                      {registration.name}
                    </TableCell>
                    <TableCell>{registration.gender}</TableCell>
                    <TableCell>{registration.age || "-"}</TableCell>
                    <TableCell>{registration.email}</TableCell>
                    <TableCell>{registration.phone}</TableCell>
                    <TableCell>{registration.line_id || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={registration ? "default" : "secondary"}>
                        {ResidentStatusDisplayEnum[registration.residient_type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {registration.info_source || "-"}
                    </TableCell>
                    <TableCell>
                      {registration.submit_time
                        .toDate()
                        .toLocaleDateString("zh-TW")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default RegistrantionHistoryArea;
