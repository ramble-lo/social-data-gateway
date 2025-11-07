import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { TVWallSettings } from "@/components/TVWallPreview";

const fontSizeScale = 4;

// 註冊完整的 Noto Sans TC 字體系列
Font.register({
  family: "NotoSansTC",
  fonts: [
    {
      src: "/Noto_Sans_TC/static/NotoSansTC-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/Noto_Sans_TC/static/NotoSansTC-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "/Noto_Sans_TC/static/NotoSansTC-Light.ttf",
      fontWeight: 300,
    },
    {
      src: "/Noto_Sans_TC/static/NotoSansTC-Medium.ttf",
      fontWeight: 500,
    },
    {
      src: "/Noto_Sans_TC/static/NotoSansTC-SemiBold.ttf",
      fontWeight: 600,
    },
  ],
});

Font.registerHyphenationCallback((word) => {
  if (word.length === 1) {
    return [word];
  }

  return Array.from(word)
    .map((char) => [char, ""])
    .reduce((arr, current) => {
      arr.push(...current);
      return arr;
    }, []);
});

// TV Wall PDF Document 組件
export const TVWallDocument: React.FC<{ settings: TVWallSettings }> = ({
  settings,
}) => {
  return (
    <Document>
      <Page
        size={{ width: 1920, height: 1080 }}
        style={[pdfStyles.page, { backgroundColor: settings.backgroundColor }]}
      >
        <View style={pdfStyles.mainContainer}>
          {/* 左側照片區域 (2/3) */}
          <View style={pdfStyles.photoContainer}>
            {settings.photoUrl && settings.photoUrl.trim() !== "" ? (
              <Image src={settings.photoUrl} style={pdfStyles.photo} />
            ) : (
              <Text style={pdfStyles.photoPlaceholder}>活動照片</Text>
            )}
          </View>
          {/* 右側內容區域 (1/3) */}
          <View style={pdfStyles.contentContainer}>
            <View
              style={[
                pdfStyles.contentDetailContainer,
                { display: "flex", flex: 1 },
              ]}
            >
              {/* 活動標題 */}
              {settings.title && settings.title.trim() !== "" && (
                <Text
                  style={[
                    pdfStyles.title,
                    { color: settings.textColor, flex: 1 },
                  ]}
                >
                  {settings.title}
                </Text>
              )}
            </View>

            <View style={pdfStyles.contentDetailContainer}>
              {/* 地點 */}
              {settings.location && settings.location.trim() !== "" && (
                <Text
                  style={[pdfStyles.location, { color: settings.textColor }]}
                >
                  {settings.location}
                </Text>
              )}
            </View>
            <View style={pdfStyles.contentDetailContainer}>
              {/* 日期 */}
              {settings.date && settings.date.trim() !== "" && (
                <Text style={[pdfStyles.date, { color: settings.textColor }]}>
                  {/* {settings.date} */}
                  {"2025/10/10（五）"}
                </Text>
              )}
              <Text style={[pdfStyles.date, { color: settings.textColor }]}>
                {"19:00-21:00"}
              </Text>
            </View>
            <View style={[pdfStyles.contentDetailContainer, { flex: 1 }]}>
              {/* QR Code 區域 */}
              {settings.registrationQRCode &&
                settings.registrationQRCode.trim() !== "" && (
                  <View style={pdfStyles.qrContainer}>
                    <Text
                      style={[pdfStyles.qrLabel, { color: settings.textColor }]}
                    >
                      立即掃描報名
                    </Text>
                    <View style={pdfStyles.qrCodeWrapper}>
                      <Image
                        src={settings.registrationQRCode}
                        style={pdfStyles.qrCode}
                      />
                    </View>
                  </View>
                )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// 使用預設字體，簡單可靠
const fontFamily = "NotoSansTC";

// PDF 樣式定義
const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingRight: 144,
    paddingVertical: 72,
    fontFamily: fontFamily,
    flexDirection: "row",
  },
  // 主容器 - 水平佈局
  mainContainer: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
  },
  // 左側照片區域 (2/3)
  photoContainer: {
    flex: 2,
    height: "100%",
    backgroundColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  photoPlaceholder: {
    color: "#ffffff",
    fontSize: 36,
    textAlign: "center",
  },
  // 右側內容區域 (1/3)
  contentContainer: {
    flex: 1,
    height: "100%",
    backgroundColor: "#ffffff",
    padding: 32,
    justifyContent: "space-between",
    gap: 24,
  },
  contentDetailContainer: {
    flexShrink: 1,
    width: "100%",
  },
  qrcodeDetailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18 * fontSizeScale,
    fontWeight: "bold",
    textAlign: "left",
  },
  location: {
    fontSize: 12 * fontSizeScale,
    fontWeight: 600,
    textAlign: "left",
    marginBottom: 8,
  },
  date: {
    fontSize: 12 * fontSizeScale,
    fontWeight: 600,
    textAlign: "left",
    marginBottom: 16,
  },
  qrContainer: {
    marginTop: 16,
    height: "100%",
    justifyContent: "flex-end",
  },
  qrLabel: {
    fontSize: 12 * fontSizeScale,
    fontWeight: 600,
    marginBottom: 16,
  },
  qrCodeWrapper: {
    width: 240,
    height: 240,
    border: "4px solid #d1d5db",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  qrCode: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
});
