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
            projects: { type: "dir", children: { "readme.txt": { type: "file", content: "Welcome to Linux Basics." } } },
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

const COMMAND_SECTIONS: Array<{
  level: "Beginner" | "Intermediate" | "Advanced";
  items: Array<{ cmd: string; desc: string; example: string }>;
}> = [
  {
    level: "Beginner",
    items: [
      { cmd: "pwd", desc: "Print current working directory", example: "pwd" },
      { cmd: "ls", desc: "List files and folders", example: "ls" },
      { cmd: "cd <dir>", desc: "Change directory", example: "cd projects" },
      { cmd: "cd ..", desc: "Go up one directory", example: "cd .." },
      { cmd: "mkdir <name>", desc: "Create a new folder", example: "mkdir lab-notes" },
      { cmd: "touch <file>", desc: "Create an empty file", example: "touch todo.txt" },
      { cmd: "cat <file>", desc: "View file contents", example: "cat notes" },
      { cmd: "echo <text>", desc: "Print text output", example: "echo Hello Linux" },
      { cmd: "clear", desc: "Clear terminal output", example: "clear" },
      { cmd: "help", desc: "Show supported practice commands", example: "help" },
    ],
  },
  {
    level: "Intermediate",
    items: [
      { cmd: "tree", desc: "Show directory structure", example: "tree" },
      { cmd: "whoami", desc: "Show active username", example: "whoami" },
      { cmd: "uname", desc: "Show kernel/system info", example: "uname" },
      { cmd: "ls /etc", desc: "List another path", example: "ls /etc" },
      { cmd: "cd /home/student", desc: "Use absolute paths", example: "cd /home/student" },
    ],
  },
  {
    level: "Advanced",
    items: [
      { cmd: "cat /etc/hosts", desc: "Read a system file", example: "cat /etc/hosts" },
      { cmd: "mkdir practice && cd practice", desc: "Command chaining idea", example: "(concept only in real shell)" },
      { cmd: "man <command>", desc: "Read manual pages (real Linux)", example: "man ls" },
    ],
  },
];

const DISTRO_LINKS = [
  { name: "CachyOS", url: "https://cachyos.org/" },
  { name: "Arch Linux", url: "https://archlinux.org/" },
  { name: "Fedora", url: "https://fedoraproject.org/" },
  { name: "Ubuntu", url: "https://ubuntu.com/" },
  { name: "Debian", url: "https://www.debian.org/" },
  { name: "openSUSE", url: "https://www.opensuse.org/" },
  { name: "Linux Mint", url: "https://linuxmint.com/" },
  { name: "Manjaro", url: "https://manjaro.org/" },
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
    "Linux Basics (practice mode)",
    "Type 'help' to see commands.",
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const prompt = useMemo(() => `student@linux-basics:${normalizePath(cwd)}$`, [cwd]);

  const beginnerRows = COMMAND_SECTIONS[0].items;

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
      const all = COMMAND_SECTIONS.flatMap((s) => s.items.map((i) => [i.cmd, i.desc] as const));
      print(["Available commands:", ...all.map(([c, d]) => `  ${c.padEnd(18)} ${d}`)]);
      return;
    }

    if (cmd === "pwd") return print(normalizePath(cwd));
    if (cmd === "whoami") return print("student");
    if (cmd === "uname") return print("Linux linux-basics 6.8.0-practice x86_64 GNU/Linux");
    if (cmd === "echo") return print(arg);

    if (cmd === "ls") {
      const targetPath = resolvePath(cwd, arg || ".");
      if (!targetPath) return print("ls: invalid path");
      const node = getNode(fsRoot, targetPath);
      if (!node) return print(`ls: cannot access '${arg}': No such file or directory`);
      if (node.type === "file") return print(arg || node.content || "");
      const names = Object.entries(node.children ?? {})
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, child]) => (child.type === "dir" ? `${name}/` : name));
      return print(names.length ? names.join("  ") : "");
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
      return print(node.content ?? "");
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
        return copy;
      });
      return;
    }

    if (cmd === "tree") {
      const node = getNode(fsRoot, cwd);
      if (!node || node.type !== "dir") return print("tree: cannot read current directory");
      return print([`${normalizePath(cwd)}`, ...buildTree(node)]);
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
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Linux Basics</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          Learn Linux fundamentals with a clean cheat sheet and a safe interactive practice terminal.
        </p>

        <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-6">
          <h2 className="text-2xl font-semibold">Command Cheat Sheet</h2>
          <p className="mt-2 text-zinc-300">Focused on beginner essentials, with a few intermediate and advanced references.</p>

          <div className="mt-5 overflow-x-auto rounded-xl border border-zinc-700/70">
            <table className="w-full min-w-[780px] border-collapse text-sm">
              <thead className="bg-[#091322] text-zinc-100">
                <tr>
                  <th className="border-b border-zinc-700 px-3 py-2 text-left">Level</th>
                  <th className="border-b border-zinc-700 px-3 py-2 text-left">Command</th>
                  <th className="border-b border-zinc-700 px-3 py-2 text-left">What it does</th>
                  <th className="border-b border-zinc-700 px-3 py-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                {COMMAND_SECTIONS.flatMap((section) =>
                  section.items.map((item, idx) => (
                    <tr key={`${section.level}-${item.cmd}`} className="odd:bg-[#070f1c] even:bg-[#0a1324]">
                      <td className="border-b border-zinc-800 px-3 py-2 align-top text-cyan-300">
                        {idx === 0 ? section.level : ""}
                      </td>
                      <td className="border-b border-zinc-800 px-3 py-2 font-mono text-zinc-100">{item.cmd}</td>
                      <td className="border-b border-zinc-800 px-3 py-2 text-zinc-300">{item.desc}</td>
                      <td className="border-b border-zinc-800 px-3 py-2 font-mono text-zinc-300">{item.example}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-0 overflow-hidden">
          <div className="border-b border-cyan-400/20 px-4 py-3 text-sm text-cyan-200">Interactive Practice Terminal</div>
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
          <div className="border-t border-cyan-400/20 bg-[#060d19] px-4 py-3 text-xs text-zinc-400">
            Beginner quick-start: {beginnerRows.slice(0, 5).map((r) => r.cmd).join(" · ")}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-[#0a1220] p-6">
          <h2 className="text-2xl font-semibold">Official Linux Distribution Links</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {DISTRO_LINKS.map((distro) => (
              <a
                key={distro.name}
                href={distro.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-zinc-700/70 bg-[#09101d] px-3 py-2 text-sm text-cyan-300 hover:border-cyan-300/60 hover:text-cyan-200"
              >
                {distro.name} ↗
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
