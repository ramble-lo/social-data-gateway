import React, { useEffect } from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Eye } from "lucide-react";
import { useRegistrants } from "@/hooks/useRegistrants";
import RegistrantDetail from "@/components/RegistrantDetail";
import { ResidentStatusDisplayEnum } from "@/types/registrant";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useGetRegistrationHistoryCount } from "@/api/registration";

interface RegistrantAreaProps {
  value: string;
  activeTab: string;
}

const RegistrantArea: React.FC<RegistrantAreaProps> = () => {
  const isFocus = true;
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const { registrants, loading } = useRegistrants({ isFocus });
  const { data: totalCount } = useGetRegistrationHistoryCount({
    enabled: isFocus,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) return null;

  const handleViewRegistrant = (registrant) => {
    setSelectedRegistrant(registrant);
    setDetailDialogOpen(true);
  };

  const paginatedRegistrants =
    registrants?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  return (
    <>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                報名者清單
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  總計 {registrants?.length} 位報名者
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              所有報名者的歷史記錄，點擊查看詳細資料
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">載入中...</div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>姓名</TableHead>
                      <TableHead>聯絡方式</TableHead>
                      <TableHead>住戶身份</TableHead>
                      <TableHead>最近報名時間</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRegistrants.map((registrant) => {
                      return (
                        <TableRow key={registrant.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{registrant.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{registrant.email}</div>
                              <div className="text-gray-500">
                                {registrant.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">
                              {
                                ResidentStatusDisplayEnum[
                                  registrant.residient_type
                                ]
                              }
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {registrant.updated_at
                              .toDate()
                              .toLocaleDateString("zh-TW")}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewRegistrant(registrant)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              查看
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <DataTablePagination
              totalCount={totalCount}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </CardFooter>
        </Card>
      </div>
      {/* 報名者詳細資料對話框 */}
      {selectedRegistrant ? (
        <RegistrantDetail
          registrant={selectedRegistrant}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
        />
      ) : null}
    </>
  );
};

export default RegistrantArea;
