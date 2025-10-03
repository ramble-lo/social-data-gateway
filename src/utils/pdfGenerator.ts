// PDF 和圖片生成相關的 utility 函數
import React from "react";
import { pdf } from "@react-pdf/renderer";
import { TVWallDocument } from "./TVWallPdfDocument";
import { TVWallSettings } from "@/components/TVWallPreview";

export interface PDFOptions {
  format?: "A4" | "A3" | "letter";
  orientation?: "portrait" | "landscape";
  quality?: number;
  scale?: number;
}

export interface ImageOptions {
  format?: "png" | "jpeg" | "webp";
  quality?: number;
  width?: number;
  height?: number;
  scale?: number;
}

/**
 * 將 HTML 元素轉換為圖片
 * 注意：這是一個模板函數，實際使用時需要安裝 html2canvas
 */
export const htmlToImage = async (
  element: HTMLElement,
  options: ImageOptions = {}
): Promise<string> => {
  const { format = "png", quality = 0.92, width, height, scale = 2 } = options;

  try {
    // 這裡應該使用 html2canvas
    // const canvas = await html2canvas(element, {
    //   scale,
    //   width,
    //   height,
    //   useCORS: true,
    //   allowTaint: true,
    // });

    // const dataUrl = canvas.toDataURL(`image/${format}`, quality);
    // return dataUrl;

    // 模擬實現
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        );
      }, 1000);
    });
  } catch (error) {
    console.error("Failed to generate image:", error);
    throw new Error("圖片生成失敗");
  }
};

/**
 * 使用 @react-pdf/renderer 生成電視牆 PDF
 */
export const generateTVWallPdf = async (
  settings: TVWallSettings,
  filename: string = "tvwall.pdf"
): Promise<void> => {
  try {
    const doc = React.createElement(TVWallDocument, {
      settings,
    }) as React.ReactElement;
    const blob = await pdf(doc).toBlob();

    // 創建下載連結
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    throw new Error("PDF 生成失敗");
  }
};

/**
 * 從電視牆設定生成 PDF
 */
export const generateTVWallPdfFromSettings = async (
  settings: TVWallSettings,
  filename: string = "tvwall.pdf"
): Promise<void> => {
  await generateTVWallPdf(settings, filename);
};

/**
 * 下載圖片到本地
 */
export const downloadImage = (
  dataUrl: string,
  filename: string = "image.png"
): void => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 生成檔案名稱（包含時間戳）
 */
export const generateFilename = (
  prefix: string = "file",
  extension: string = "png"
): string => {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/:/g, "-");
  return `${prefix}_${timestamp}.${extension}`;
};

/**
 * 預設的電視牆樣式
 */
export const defaultTVWallStyles = {
  container: {
    width: "1920px",
    height: "1080px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    boxSizing: "border-box" as const,
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  title: {
    fontSize: "72px",
    fontWeight: "bold",
    marginBottom: "24px",
    textAlign: "center" as const,
  },
  subtitle: {
    fontSize: "48px",
    fontWeight: "500",
    marginBottom: "48px",
    opacity: 0.9,
    textAlign: "center" as const,
  },
  content: {
    fontSize: "36px",
    lineHeight: "1.6",
    textAlign: "center" as const,
    whiteSpace: "pre-line" as const,
  },
  timestamp: {
    position: "absolute" as const,
    bottom: "30px",
    right: "30px",
    fontSize: "24px",
    opacity: 0.7,
  },
  logo: {
    position: "absolute" as const,
    top: "30px",
    left: "30px",
    maxHeight: "120px",
    maxWidth: "200px",
  },
};
