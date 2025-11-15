"use client";

import React from "react";

const RichTextRenderer = ({ html }) => {
  if (!html) return null;

  return (
    <div
      className="ql-editor w-full rounded-[26px] border border-[#e2e8f0] bg-white/90 px-6 py-6 text-[#0f172a] leading-[1.8] shadow-[0_35px_70px_-45px_rgba(15,23,42,0.65)] backdrop-blur-md
      scrollbar-thin scrollbar-thumb-[#94a3b8] scrollbar-track-transparent
      [&>h1]:text-[34px] [&>h1]:font-semibold [&>h1]:leading-tight [&>h1]:mb-4
      [&>h2]:text-[30px] [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:mt-6
      [&>h3]:text-[24px] [&>h3]:font-semibold [&>h3]:mb-2.5 [&>h3]:mt-5
      [&>p]:my-3
      [&>p:empty]:my-0
      [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mt-2
      [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mt-2
      [&>hr]:my-6 [&>hr]:border-[#e2e8f0]
      [&_blockquote]:rounded-3xl [&_blockquote]:border-l-4 [&_blockquote]:border-[#1a2b5c] [&_blockquote]:bg-[#f8fafc] [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:italic
      [&_pre]:rounded-2xl [&_pre]:bg-[#0f172a] [&_pre]:px-5 [&_pre]:py-4 [&_pre]:text-white [&_pre]:overflow-auto
      [&_code]:font-mono [&_code]:text-sm
      [&_img]:my-4 [&_img]:w-full [&_img]:rounded-3xl [&_img]:object-cover
      [&_table]:w-full [&_table]:border-collapse [&_table_th]:text-left [&_table_th]:font-semibold [&_table_th]:border-b [&_table_td]:border-b [&_table_td]:py-3 [&_table_th]:py-3
      [&_iframe]:w-full [&_iframe]:h-[400px] [&_iframe]:rounded-3xl
      [&_.ql-align-center]:text-center
      [&_.ql-align-right]:text-right
      [&_a]:text-[#2563eb] [&_a]:font-semibold [&_a]:underline hover:[&_a]:text-[#1d4ed8]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichTextRenderer;
