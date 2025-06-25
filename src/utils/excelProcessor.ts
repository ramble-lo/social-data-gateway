import * as XLSX from "xlsx";
import { db } from "@/integrations/firebase/client";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";

interface ExcelRowData {
  [key: string]: string | number | undefined;
}

export const processExcelFile = async (
  file: File
): Promise<{ success: boolean; message: string; processedCount: number }> => {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRowData[];

    let processedCount = 0;
    let skippedCount = 0;

    for (const row of jsonData) {
      try {
        // 提取欄位資料，使用中文欄位名稱
        const activityName = String(row["以下活動請擇一"] || "");
        const name = String(row["姓名"] || "");
        const email = String(row["電子郵件"] || "");
        const phone = String(row["聯絡電話"] || "");
        const gender = String(row["性別"] || "");
        const age = String(row["參與者年齡"] || "");
        const lineId = String(row["Line ID（意者可留）"] || "");
        const childrenCount = String(row["小孩人數"] || "");
        const isResidentText = String(
          row["請問您是興隆社宅2區的住戶嗎？"] || ""
        );
        const housingLocation = String(
          row["您是來自哪個臺北市社會住宅？"] || ""
        );
        const sportsExperience = String(row["運動經歷幾年？"] || "");
        const injuryHistory = String(
          row["是否有受傷病史？（沒有請填無）"] || ""
        );
        const infoSource = String(row["請問您從何處得知本次活動資訊？"] || "");
        const suggestions = String(
          row[
            "針對活動，有什麼建議或想和主辦單位說的話嗎？請在這裡留言喔～謝謝您！"
          ] || ""
        );
        const submitTimeStr = String(row["填答時間"] || "");

        // 跳過空白資料行
        if (!name || !email || !phone || !activityName) {
          skippedCount++;
          continue;
        }

        // 判斷是否為住戶
        const isResident =
          isResidentText.includes("是") || isResidentText.includes("住戶");

        // 處理提交時間
        let submitTime: Timestamp;
        if (submitTimeStr) {
          // 嘗試解析時間格式 (例如：2025-06-20 13:45:37)
          const parsedDate = new Date(submitTimeStr);
          if (!isNaN(parsedDate.getTime())) {
            submitTime = Timestamp.fromDate(parsedDate);
          } else {
            submitTime = Timestamp.fromDate(new Date());
          }
        } else {
          submitTime = Timestamp.fromDate(new Date());
        }

        // 檢查報名者是否已存在
        const registrantsCollection = collection(db, "registrants");
        const q = query(
          registrantsCollection,
          where("email", "==", email),
          where("phone", "==", phone)
        );
        const existingRegistrantSnapshot = await getDocs(q);

        let registrantId: string;

        if (existingRegistrantSnapshot.empty) {
          // 建立新的報名者
          const newRegistrantRef = await addDoc(collection(db, "registrants"), {
            name,
            email,
            phone,
            gender: gender || null,
            line_id: lineId || null,
            is_resident: isResident,
            housing_location: housingLocation || null,
            created_at: new Date(),
          });
          registrantId = newRegistrantRef.id;
        } else {
          registrantId = existingRegistrantSnapshot.docs[0].id;
        }

        // 檢查是否已有相同的報名歷史記錄
        const historyCollection = collection(db, "registration_history");
        const historyQuery = query(
          historyCollection,
          where("registrant_id", "==", registrantId),
          where("activity_name", "==", activityName),
          where("submit_time", "==", submitTime)
        );
        const existingHistorySnapshot = await getDocs(historyQuery);

        if (existingHistorySnapshot.empty) {
          // 新增報名歷史記錄
          await addDoc(collection(db, "registration_history"), {
            registrant_id: registrantId,
            activity_name: activityName,
            age: age || null,
            children_count: childrenCount || null,
            sports_experience: sportsExperience || null,
            injury_history: injuryHistory || null,
            info_source: infoSource || null,
            suggestions: suggestions || null,
            submit_time: submitTime,
            created_at: new Date(),
          });
        }

        processedCount++;
      } catch (error) {
        console.error("處理單行資料失敗:", error);
        skippedCount++;
      }
    }

    return {
      success: true,
      message: `成功處理 ${processedCount} 筆資料，跳過 ${skippedCount} 筆無效資料`,
      processedCount,
    };
  } catch (error) {
    console.error("處理 Excel 檔案失敗:", error);
    return {
      success: false,
      message: "處理 Excel 檔案時發生錯誤，請檢查檔案格式",
      processedCount: 0,
    };
  }
};
