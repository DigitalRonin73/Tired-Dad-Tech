"use client";

import { useState } from "react";

type Props = {
  title?: string;
  code: string;
};

export default function CopyCodeBlock({ title, code }: Props) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-cyan-400/30 bg-[#08101d]">
      <div className="flex items-center justify-between border-b border-cyan-400/20 px-3 py-2">
        <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/90">
          {title ?? "Terminal Commands"}
        </p>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-md border border-cyan-300/50 px-2 py-1 text-xs text-cyan-200 hover:bg-cyan-400/10"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-zinc-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
