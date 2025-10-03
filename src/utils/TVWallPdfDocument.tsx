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
export const TVWallDocument: React.FC<{ settings: TVWallSettings }> = ({
  settings,
}) => {
  const alignmentStyle =
    settings.layout === "left"
      ? pdfStyles.leftAlign
      : settings.layout === "right"
      ? pdfStyles.rightAlign
      : pdfStyles.centerAlign;

  const titleFontSize =
    settings.fontSize === "small"
      ? 24
      : settings.fontSize === "medium"
      ? 32
      : settings.fontSize === "large"
      ? 40
      : settings.fontSize === "xlarge"
      ? 48
      : 32;

  const subtitleFontSize = Math.round(titleFontSize * 0.75);
  const contentFontSize = Math.round(titleFontSize * 0.5);

  return (
    <Document>
      <Page
        size="A4"
        orientation="landscape"
        style={[pdfStyles.page, { backgroundColor: settings.backgroundColor }]}
      >
        <View style={[pdfStyles.container, alignmentStyle]}>
          {/* Logo */}
          {settings.logoUrl && (
            <Image src={settings.logoUrl} style={pdfStyles.logo} />
          )}

          {/* Title */}
          {settings.title && (
            <Text
              style={[
                pdfStyles.title,
                {
                  color: settings.textColor,
                  fontSize: titleFontSize,
                  textAlign: settings.layout as "left" | "center" | "right",
                },
              ]}
            >
              {settings.title}
            </Text>
          )}

          {/* Subtitle */}
          {settings.subtitle && (
            <Text
              style={[
                pdfStyles.subtitle,
                {
                  color: settings.textColor,
                  fontSize: subtitleFontSize,
                  textAlign: settings.layout as "left" | "center" | "right",
                },
              ]}
            >
              {settings.subtitle}
            </Text>
          )}

          {/* Content */}
          {settings.content && (
            <Text
              style={[
                pdfStyles.content,
                {
                  color: settings.textColor,
                  fontSize: contentFontSize,
                  textAlign: settings.layout as "left" | "center" | "right",
                },
              ]}
            >
              {settings.content}
            </Text>
          )}

          {/* Timestamp */}
          <Text style={[pdfStyles.timestamp, { color: settings.textColor }]}>
            {new Date().toLocaleString("zh-TW")}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
