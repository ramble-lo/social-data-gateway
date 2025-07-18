import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useState, useRef } from "react";
import { DataTablePagination } from "./ui/data-table-pagination";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

interface RegistrantDetailProps {
  value: string;
}

const itemsPerPage = 10;

const RegistrantionHistoryArea = ({ value }: RegistrantDetailProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  // Stack to keep track of lastVisible for each page
  const lastVisibleStack = useRef<
    (QueryDocumentSnapshot<DocumentData> | null)[]
  >([null]);

  // Get the lastVisible for the current page (null for first page)
  const lastVisible = lastVisibleStack.current[currentPage - 1] || null;

  const {
    registrantionHistory,
    lastVisible: newLastVisible,
    loading,
    totalCount,
  } = useRegistrantion(currentPage, itemsPerPage, lastVisible);

  // When page changes, update the lastVisibleStack
  const handlePageChange = async (page: number) => {
    if (page === currentPage) return;
    if (page > lastVisibleStack.current.length) {
      // Need to walk forward to get the cursor for the target page
      const lastCursor =
        lastVisibleStack.current[lastVisibleStack.current.length - 1];
      let nextCursor = lastCursor;
      for (let p = lastVisibleStack.current.length; p < page; p++) {
        // Fetch the next page cursor
        // Use the same hook logic, but only for cursor
        // This is a hack: you may want to refactor to expose a cursor-fetcher
        const res = await import("@/api/registration").then((m) =>
          m.getRegistrantionHistory(p, itemsPerPage, nextCursor)
        );
        nextCursor = res.lastVisible;
        lastVisibleStack.current.push(nextCursor);
      }
    }
    setCurrentPage(page);
  };

  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              報名資料總覽
            </div>
            {/* Hide total count since we don't have it with paginated fetch */}
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
            {loading && <div className="p-4 text-center">載入中...</div>}
          </div>
        </CardContent>
        <CardFooter>
          <DataTablePagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalCount={totalCount || 0}
            itemsPerPage={itemsPerPage}
          />
        </CardFooter>
      </Card>
    </TabsContent>
  );
};

export default RegistrantionHistoryArea;
