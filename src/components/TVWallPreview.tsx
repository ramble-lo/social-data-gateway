import React, { forwardRef } from "react";

export interface TVWallSettings {
  title: string;
  subtitle: string;
  location: string;
  date: string;
  photoUrl: string;
  logoUrl: string;
  registrationQRCode: string;
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  layout: string;
  content: string;
}

interface TVWallPreviewProps {
  settings: TVWallSettings;
  className?: string;
}

const TVWallPreview = forwardRef<HTMLDivElement, TVWallPreviewProps>(
  ({ settings, className = "" }, ref) => {
    const getFontSizeClass = (size: string) => {
      switch (size) {
        case "small":
          return "text-2xl";
        case "medium":
          return "text-4xl";
        case "large":
          return "text-6xl";
        case "xlarge":
          return "text-8xl";
        default:
          return "text-4xl";
      }
    };

    const getLayoutClass = (layout: string) => {
      switch (layout) {
        case "left":
          return "text-left items-start";
        case "center":
          return "text-center items-center";
        case "right":
          return "text-right items-end";
        default:
          return "text-center items-center";
      }
    };

    console.log("settings.registrationQRCode", settings.registrationQRCode);
    console.log(
      "QR Code 顯示條件:",
      settings.registrationQRCode && settings.registrationQRCode.trim() !== ""
    );

    return (
      <div
        ref={ref}
        // className={`
        //   w-full aspect-video rounded-lg border-2 border-dashed border-gray-300
        //   flex flex-col justify-center p-8 relative overflow-hidden
        //   ${getLayoutClass(settings.layout)}
        //   ${className}
        // `}
        className={`
          flex w-full aspect-video rounded-lg border-2 border-dashed border-gray-300
          flex-row justify-center pb-4 pt-4 pr-8 relative overflow-hidden
        `}
        style={{
          backgroundColor: settings.backgroundColor,
          color: settings.textColor,
        }}
      >
        {/* 照片顯示 */}
        {settings.photoUrl && settings.photoUrl.trim() !== "" && (
          <div className="basis-2/3 flex justify-center bg-gray-400 h-full relative">
            <img
              src={settings.photoUrl}
              alt="活動照片"
              className="w-full h-full object-contain"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error("圖片載入失敗:", settings.photoUrl);
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // 顯示錯誤訊息
                const parent = target.parentElement;
                if (parent && !parent.querySelector(".error-message")) {
                  const errorDiv = document.createElement("div");
                  errorDiv.className =
                    "error-message absolute inset-0 flex flex-col items-center justify-center text-white text-sm bg-slate-600 bg-opacity-75";
                  errorDiv.innerHTML = `
                    <div>圖片載入失敗</div>
                    <div class="text-xs mt-2 px-4 text-center">可能是 CORS 限制或網路問題</div>
                  `;
                  parent.appendChild(errorDiv);
                }
              }}
              onLoad={() => {
                console.log("圖片載入成功:", settings.photoUrl);
              }}
            />
          </div>
        )}
        {/* 主要內容 */}
        <div className="basis-1/3 flex flex-col bg-white gap-3 p-4 justify-center">
          {settings.title && settings.title.trim() !== "" && (
            <h1
              className={`font-bold text-left text-lg`}
              style={{ color: settings.textColor }}
            >
              {settings.title}
            </h1>
          )}
          {settings.location && settings.location.trim() !== "" && (
            <div className="flex items-center justify-start space-x-2">
              <span
                className="text-sm text-left"
                style={{ color: settings.textColor }}
              >
                {settings.location}
              </span>
            </div>
          )}
          {settings.date && settings.date.trim() !== "" && (
            <div className="flex items-center justify-center space-x-2">
              <span
                className="text-sm text-left"
                style={{ color: settings.textColor }}
              >
                {settings.date}
              </span>
            </div>
          )}
          {settings.registrationQRCode &&
            settings.registrationQRCode.trim() !== "" && (
              <div className="flex flex-col items-start space-y-2 mt-2">
                <span
                  className="text-sm font-medium"
                  style={{ color: settings.textColor }}
                >
                  {"立即掃描報名"}
                </span>
                <div className="w-24 h-24 border-2 border-gray-300 rounded-lg overflow-hidden bg-white p-1 shadow-sm">
                  <img
                    src={settings.registrationQRCode}
                    alt="報名QR Code"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error(
                        "QR Code 載入失敗:",
                        settings.registrationQRCode
                      );
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                    onLoad={() => {
                      console.log("QR Code 載入成功");
                    }}
                  />
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
);

TVWallPreview.displayName = "TVWallPreview";

export default TVWallPreview;
