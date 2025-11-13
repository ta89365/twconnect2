// File: apps/web/src/app/contact/FileUploadField.tsx
"use client";

import * as React from "react";

type Lang = "jp" | "zh" | "en";

type Props = {
  lang: Lang;
  name: string;
  label: string;
  hint?: string;
  multiple?: boolean;
};

function buttonTextByLang(lang: Lang): string {
  if (lang === "jp") return "ファイルを選択";
  if (lang === "en") return "Choose Files";
  return "選擇檔案";
}

function noFileTextByLang(lang: Lang): string {
  if (lang === "jp") return "ファイルが選択されていません";
  if (lang === "en") return "No file chosen";
  return "尚未選擇檔案";
}

const FileUploadField: React.FC<Props> = ({ lang, name, label, hint, multiple = true }) => {
  const [fileText, setFileText] = React.useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setFileText("");
      return;
    }

    if (files.length === 1) {
      setFileText(files[0].name);
    } else {
      // 多檔：顯示「X files selected」
      if (lang === "jp") {
        setFileText(`${files.length} 件のファイルを選択しました`);
      } else if (lang === "en") {
        setFileText(`${files.length} files selected`);
      } else {
        setFileText(`已選擇 ${files.length} 個檔案`);
      }
    }
  };

  return (
    <div className="grid min-w-0 gap-2">
      <label className="text-sm opacity-90">{label}</label>

      <div className="flex min-w-0 flex-wrap items-center gap-3">
        {/* 自訂按鈕：多語文字 */}
        <label className="inline-flex items-center rounded-xl bg-white px-3 py-2 text-sm font-medium text-black shadow-sm cursor-pointer">
          {buttonTextByLang(lang)}
          <input
            type="file"
            name={name}
            multiple={multiple}
            className="sr-only"
            onChange={onChange}
          />
        </label>

        {/* 檔名／未選擇文字，多語 */}
        <span className="text-xs opacity-80 truncate max-w-full">
          {fileText || noFileTextByLang(lang)}
        </span>
      </div>

      {hint ? (
        <p className="text-xs opacity-75">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export default FileUploadField;
