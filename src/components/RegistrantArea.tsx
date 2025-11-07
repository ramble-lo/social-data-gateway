import React, { useRef, useCallback } from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Eye, Search } from "lucide-react";
import { useRegistrants } from "@/hooks/useRegistrants";
import RegistrantDetail from "@/components/RegistrantDetail";
import { ResidentStatusDisplayEnum } from "@/types/registrant";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import {
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";

const formatTimestampToMonth = (timestamp: Timestamp): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
  };
  const formattedDate: string = timestamp
    .toDate()
    .toLocaleDateString("zh-TW", options);
  console.log("timestamp", timestamp);
  console.log("formattedDate", formattedDate);

  return formattedDate;
};

interface RegistrantAreaProps {
  value: string;
  activeTab: string;
}

const RegistrantArea: React.FC<RegistrantAreaProps> = () => {
  const isFocus = true;
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Stack to keep track of lastVisible for each page
  const lastVisibleStack = useRef<
    (QueryDocumentSnapshot<DocumentData> | null)[]
  >([null]);

  // Get the lastVisible for the current page (null for first page)
  const lastVisible = lastVisibleStack.current[currentPage - 1] || null;

  // Debounce search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchInput !== searchTerm) {
        setSearchTerm(searchInput);
        setCurrentPage(1);
        lastVisibleStack.current = [null];
      }
    }, 500); // 500ms delay

    return () => clearTimeout(debounceTimer);
  }, [searchInput, searchTerm]);

  const {
    registrants,
    loading,
    lastVisible: newLastVisible,
    totalCount,
  } = useRegistrants({
    isFocus,
    page: currentPage,
    pageSize: itemsPerPage,
    lastVisible,
    searchTerm,
  });

  const handleViewRegistrant = (registrant) => {
    setSelectedRegistrant(registrant);
    setDetailDialogOpen(true);
  };

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
        const res = await import("@/api/registration").then((m) =>
          m.getRegistrantsFromFirebase(p, itemsPerPage, nextCursor, searchTerm)
        );
        nextCursor = res.lastVisible;
        lastVisibleStack.current.push(nextCursor);
      }
    }
    setCurrentPage(page);
  };

  // Handle search input change (immediate UI update)
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

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
                  {searchTerm
                    ? `搜尋結果 ${totalCount || 0}`
                    : `總計 ${totalCount || 0}`}{" "}
                  位報名者
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              所有報名者的歷史記錄，點擊查看詳細資料
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="搜尋報名者姓名..."
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-md">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">載入中...</span>
                  </div>
                </div>
              )}
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
                    {registrants.map((registrant) => {
                      console.log("registrant", registrant);

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
                            {formatTimestampToMonth(registrant.updated_at)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewRegistrant(registrant)}
                              className="flex items-center gap-1"
                              disabled={loading}
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
