"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

type NodeType = {
  type: "dir" | "file";
  children?: Record<string, NodeType>;
  content?: string;
};

const ROOT: NodeType = {
  type: "dir",
  children: {
    home: {
      type: "dir",
      children: {
        student: {
          type: "dir",
          children: {
            projects: { type: "dir", children: { "readme.txt": { type: "file", content: "Welcome to Linux Lab." } } },
            downloads: { type: "dir", children: {} },
            notes: { type: "file", content: "Practice makes progress." },
          },
        },
      },
    },
    etc: { type: "dir", children: { hosts: { type: "file", content: "127.0.0.1 localhost" } } },
    var: { type: "dir", children: { log: { type: "dir", children: { "system.log": { type: "file", content: "No real logs in practice mode." } } } } },
    tmp: { type: "dir", children: {} },
  },
};

const MUST_KNOW = [
  ["pwd", "Show current directory"],
  ["ls", "List files and folders"],
  ["cd <dir>", "Change directory"],
  ["cd ..", "Go up one level"],
  ["mkdir <name>", "Create folder"],
  ["touch <name>", "Create empty file"],
  ["cat <file>", "Show file contents"],
  ["echo <text>", "Print text"],
  ["clear", "Clear terminal output"],
  ["help", "Show available commands"],
];

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function normalizePath(path: string[]): string {
  return path.length ? `/${path.join("/")}` : "/";
}

function getNode(root: NodeType, path: string[]): NodeType | null {
  let cur: NodeType = root;
  for (const part of path) {
    if (cur.type !== "dir") return null;
    cur = cur.children?.[part] as NodeType;
    if (!cur) return null;
  }
  return cur;
}

function resolvePath(cwd: string[], input?: string): string[] | null {
  if (!input || input === "~") return ["home", "student"];
  const start = input.startsWith("/") ? [] : [...cwd];
  const parts = input.split("/").filter(Boolean);
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      if (start.length) start.pop();
      continue;
    }
    start.push(part);
  }
  return start;
}

function buildTree(node: NodeType, indent = ""): string[] {
  if (node.type !== "dir") return [];
  const entries = Object.entries(node.children ?? {}).sort(([a], [b]) => a.localeCompare(b));
  return entries.flatMap(([name, child], idx) => {
    const isLast = idx === entries.length - 1;
    const branch = `${indent}${isLast ? "└──" : "├──"} ${name}${child.type === "dir" ? "/" : ""}`;
    const nextIndent = `${indent}${isLast ? "    " : "│   "}`;
    return [branch, ...(child.type === "dir" ? buildTree(child, nextIndent) : [])];
  });
}

export default function LinuxLabPage() {
  const [fsRoot, setFsRoot] = useState<NodeType>(() => deepClone(ROOT));
  const [cwd, setCwd] = useState<string[]>(["home", "student"]);
  const [lines, setLines] = useState<string[]>([
    "Linux Lab (practice mode)",
    "Type 'help' to see commands.",
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const prompt = useMemo(() => `student@linux-lab:${normalizePath(cwd)}$`, [cwd]);

  function print(out: string | string[]) {
    const arr = Array.isArray(out) ? out : [out];
    setLines((prev) => [...prev, ...arr]);
  }

  function runCommand(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const [cmd, ...rest] = trimmed.split(" ");
    const arg = rest.join(" ").trim();

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    if (cmd === "help") {
      print([
        "Available commands:",
        ...MUST_KNOW.map(([c, d]) => `  ${c.padEnd(14)} ${d}`),
        "  whoami         Print current user",
        "  uname          Show system info",
        "  tree           Show directory tree",
      ]);
      return;
    }

    if (cmd === "pwd") {
      print(normalizePath(cwd));
      return;
    }

    if (cmd === "whoami") {
      print("student");
      return;
    }

    if (cmd === "uname") {
      print("Linux linux-lab 6.8.0-practice x86_64 GNU/Linux");
      return;
    }

    if (cmd === "echo") {
      print(arg);
      return;
    }

    if (cmd === "ls") {
      const targetPath = resolvePath(cwd, arg || ".");
      if (!targetPath) return print("ls: invalid path");
      const node = getNode(fsRoot, targetPath);
      if (!node) return print(`ls: cannot access '${arg}': No such file or directory`);
      if (node.type === "file") return print(arg || node.content || "");
      const names = Object.entries(node.children ?? {})
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, child]) => (child.type === "dir" ? `${name}/` : name));
      print(names.length ? names.join("  ") : "");
      return;
    }

    if (cmd === "cd") {
      const targetPath = resolvePath(cwd, arg || "~");
      if (!targetPath) return print("cd: invalid path");
      const node = getNode(fsRoot, targetPath);
      if (!node) return print(`cd: no such file or directory: ${arg}`);
      if (node.type !== "dir") return print(`cd: not a directory: ${arg}`);
      setCwd(targetPath);
      return;
    }

    if (cmd === "cat") {
      if (!arg) return print("cat: missing file operand");
      const targetPath = resolvePath(cwd, arg);
      if (!targetPath) return print("cat: invalid path");
      const node = getNode(fsRoot, targetPath);
      if (!node) return print(`cat: ${arg}: No such file or directory`);
      if (node.type !== "file") return print(`cat: ${arg}: Is a directory`);
      print(node.content ?? "");
      return;
    }

    if (cmd === "mkdir" || cmd === "touch") {
      if (!arg) return print(`${cmd}: missing operand`);
      if (arg.includes("/")) return print(`${cmd}: nested paths not supported in practice mode`);
      setFsRoot((prev) => {
        const copy = deepClone(prev);
        const dir = getNode(copy, cwd);
        if (!dir || dir.type !== "dir") return prev;
        if (dir.children?.[arg]) {
          print(`${cmd}: cannot create '${arg}': File exists`);
          return prev;
        }
        dir.children = dir.children ?? {};
        dir.children[arg] = cmd === "mkdir" ? { type: "dir", children: {} } : { type: "file", content: "" };
        print("");
        return copy;
      });
      return;
    }

    if (cmd === "tree") {
      const node = getNode(fsRoot, cwd);
      if (!node || node.type !== "dir") return print("tree: cannot read current directory");
      print([`${normalizePath(cwd)}`, ...buildTree(node)]);
      return;
    }

    print(`${cmd}: command not found`);
  }

  function submit() {
    const raw = input;
    setLines((prev) => [...prev, `${prompt} ${raw}`]);
    setInput("");
    runCommand(raw);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <main className="tech-bg min-h-screen bg-[#070b12] text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <Link href="/" className="text-cyan-300 hover:text-cyan-200">← Back to Home</Link>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Linux Beginner Practice Lab</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          Practice must-know Linux commands in a safe fake terminal. No risk, just reps.
        </p>

        <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-6">
          <h2 className="text-2xl font-semibold">Must-Know Commands</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {MUST_KNOW.map(([cmd, desc]) => (
              <div key={cmd} className="rounded-lg border border-zinc-700/70 bg-[#09101d] px-3 py-2 text-sm">
                <span className="font-mono text-cyan-300">{cmd}</span>
                <span className="ml-2 text-zinc-300">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-0 overflow-hidden">
          <div className="border-b border-cyan-400/20 px-4 py-3 text-sm text-cyan-200">Interactive Terminal</div>
          <div className="h-[420px] overflow-y-auto bg-[#030712] p-4 font-mono text-sm leading-6" onClick={() => inputRef.current?.focus()}>
            {lines.map((line, idx) => (
              <div key={`${line}-${idx}`} className="whitespace-pre-wrap break-words text-zinc-200">{line || " "}</div>
            ))}
            <div className="mt-1 flex items-center gap-2 text-zinc-100">
              <span className="text-cyan-300">{prompt}</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                className="w-full bg-transparent outline-none"
                autoFocus
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
