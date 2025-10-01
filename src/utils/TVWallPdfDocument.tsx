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

export interface TVWallData {
  title: string;
  subtitle: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  layout: string;
  logoUrl?: string;
}

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

// 使用預設字體，簡單可靠
const fontFamily = "NotoSansTC";

// PDF 樣式定義
const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: fontFamily,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: 600,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 500,
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.8,
  },
  content: {
    fontSize: 18,
    fontWeight: "normal",
    lineHeight: 1.6,
    textAlign: "center",
    marginTop: 20,
    maxWidth: "80%",
  },
  timestamp: {
    position: "absolute",
    bottom: 20,
    right: 20,
    fontSize: 12,
    fontWeight: 300,
    opacity: 0.7,
  },
  logo: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 80,
    height: "auto",
  },
  leftAlign: {
    textAlign: "left",
    alignItems: "flex-start",
  },
  centerAlign: {
    textAlign: "center",
    alignItems: "center",
  },
  rightAlign: {
    textAlign: "right",
    alignItems: "flex-end",
  },
});

// TV Wall PDF Document 組件
export const TVWallDocument: React.FC<{ data: TVWallData }> = ({ data }) => {
  const alignmentStyle =
    data.layout === "left"
      ? pdfStyles.leftAlign
      : data.layout === "right"
      ? pdfStyles.rightAlign
      : pdfStyles.centerAlign;

  const titleFontSize =
    data.fontSize === "small"
      ? 24
      : data.fontSize === "medium"
      ? 32
      : data.fontSize === "large"
      ? 40
      : data.fontSize === "xlarge"
      ? 48
      : 32;

  const subtitleFontSize = Math.round(titleFontSize * 0.75);
  const contentFontSize = Math.round(titleFontSize * 0.5);

  return (
    <Document>
      <Page
        size="A4"
        orientation="landscape"
        style={[pdfStyles.page, { backgroundColor: data.backgroundColor }]}
      >
        <View style={[pdfStyles.container, alignmentStyle]}>
          {/* Logo */}
          {data.logoUrl && <Image src={data.logoUrl} style={pdfStyles.logo} />}

          {/* Title */}
          {data.title && (
            <Text
              style={[
                pdfStyles.title,
                {
                  color: data.textColor,
                  fontSize: titleFontSize,
                  textAlign: data.layout as "left" | "center" | "right",
                },
              ]}
            >
              {data.title}
            </Text>
          )}

          {/* Subtitle */}
          {data.subtitle && (
            <Text
              style={[
                pdfStyles.subtitle,
                {
                  color: data.textColor,
                  fontSize: subtitleFontSize,
                  textAlign: data.layout as "left" | "center" | "right",
                },
              ]}
            >
              {data.subtitle}
            </Text>
          )}

          {/* Content */}
          {data.content && (
            <Text
              style={[
                pdfStyles.content,
                {
                  color: data.textColor,
                  fontSize: contentFontSize,
                  textAlign: data.layout as "left" | "center" | "right",
                },
              ]}
            >
              {data.content}
            </Text>
          )}

          {/* Timestamp */}
          <Text style={[pdfStyles.timestamp, { color: data.textColor }]}>
            {new Date().toLocaleString("zh-TW")}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
