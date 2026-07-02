import { useState, useEffect, useRef, useCallback } from "react";

// ── Helpers ───────────────────────────────────────────────────
function formatSize(bytes) {
  if (!bytes) return null;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function classify(msg) {
  if (msg.startsWith("✅") || msg.startsWith("🎉") || msg.startsWith("🟢"))
    return "success";
  if (msg.startsWith("❌")) return "error";
  if (msg.startsWith("⏳") || msg.startsWith("📦") || msg.startsWith("🔍"))
    return "info";
  if (msg.startsWith("⚠")) return "warn";
  return "";
}

// ── Styles (CSS-in-JS nhỏ gọn) ───────────────────────────────
const S = {
  page: {
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    maxWidth: "90vw",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "2px",
  },
  headerIcon: {
    width: "34px",
    height: "34px",
    background: "var(--accent)",
    borderRadius: "var(--radius)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    flexShrink: 0,
  },
  h2: { fontSize: "17px", fontWeight: 700, letterSpacing: "-0.3px" },
  versionTag: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "10px",
    color: "var(--text-muted)",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    padding: "2px 7px",
    borderRadius: "99px",
    marginLeft: "auto",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "13px",
  },
  label: {
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "var(--text-muted)",
  },
  divider: { height: "1px", background: "var(--border)" },
  input: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: "var(--radius)",
    padding: "10px 12px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
    outline: "none",
    width: "100%",
    WebkitAppearance: "none",
  },
  row: { display: "flex", gap: "8px", alignItems: "center" },
  // Buttons
  btnBase: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: "12px",
    padding: "10px 14px",
    border: "none",
    borderRadius: "var(--radius)",
    cursor: "pointer",
    whiteSpace: "nowrap",
    letterSpacing: "0.3px",
    WebkitAppearance: "none",
  },
  // Media options
  mediaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "7px",
  },
  mediaOpt: (selected) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    background: "var(--surface2)",
    border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
    borderRadius: "var(--radius)",
    padding: "10px 6px",
    cursor: "pointer",
    background: selected ? "rgba(0,136,204,0.09)" : "var(--surface2)",
    transition: "border-color .15s, background .15s",
    userSelect: "none",
    WebkitUserSelect: "none",
  }),
  mediaIcon: { fontSize: "18px", lineHeight: 1 },
  mediaLbl: (selected) => ({
    fontSize: "11px",
    fontWeight: 700,
    color: selected ? "var(--text)" : "var(--text-dim)",
  }),
  mediaSub: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "9px",
    color: "var(--text-muted)",
  },
  // File list
  fileItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "8px 10px",
    gap: "8px",
  },
  fileExt: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    padding: "2px 7px",
    color: "var(--accent)",
    flexShrink: 0,
    textTransform: "uppercase",
  },
  fileSize: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    color: "var(--text-muted)",
    flexShrink: 0,
  },
  // Log
  logWrap: {
    background: "#09090b",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    overflow: "hidden",
  },
  logHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 13px",
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
  },
  logHeaderLabel: {
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "var(--text-muted)",
  },
  log: {
    height: "200px",
    overflowY: "auto",
    padding: "10px 13px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    lineHeight: "1.7",
  },
  logLine: { display: "flex", gap: "9px" },
  logTime: { color: "var(--text-muted)", flexShrink: 0 },
  logMsg: (cls) => ({
    wordBreak: "break-all",
    color:
      cls === "success"
        ? "var(--green)"
        : cls === "error"
          ? "var(--red)"
          : cls === "info"
            ? "#60a5fa"
            : cls === "warn"
              ? "var(--yellow)"
              : "var(--text-dim)",
  }),
  // Status bar
  statusBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    color: "var(--text-muted)",
    padding: "0 2px",
  },
  dot: (type) => ({
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    flexShrink: 0,
    background:
      type === "ready"
        ? "var(--green)"
        : type === "error"
          ? "var(--red)"
          : type === "busy"
            ? "var(--yellow)"
            : "var(--text-muted)",
    boxShadow:
      type === "ready"
        ? "0 0 6px var(--green)"
        : type === "busy"
          ? "0 0 6px var(--yellow)"
          : "none",
  }),
};

// ── Nút tái sử dụng ──────────────────────────────────────────
function Btn({ onClick, disabled, variant = "secondary", children, style }) {
  const base = {
    ...S.btnBase,
    ...(variant === "primary"
      ? { background: "var(--accent)", color: "#fff" }
      : {
          background: "var(--surface2)",
          color: "var(--text-dim)",
          border: "1px solid var(--border)",
        }),
    ...(disabled ? { opacity: 0.45, cursor: "not-allowed" } : {}),
    ...style,
  };
  return (
    <button style={base} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

const uri = import.meta.env.VITE_URI_ROOT_API;

// ── App chính ─────────────────────────────────────────────────
export default function App() {
  const [url, setUrl] = useState("");
  const [prefix, setPrefix] = useState("");
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState({ type: "", text: "Đang khởi động..." });
  const [busy, setBusy] = useState(false);
  const [logs, setLogs] = useState([]);
  const [fileList, setFileList] = useState([]); // [{index, ext, size, downloading, done, error}]
  const logRef = useRef(null);

  // Tự scroll log xuống dưới
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  function addLog(msg) {
    const time = new Date().toLocaleTimeString("vi-VN");
    setLogs((prev) => [...prev, { time, msg, cls: classify(msg) }]);
  }

  function setDot(type, text) {
    setStatus({ type, text });
  }

  // Kiểm tra server khi load
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${uri}/api/status`);
        const data = await res.json();
        if (data.ready) {
          addLog("🟢 Bot đã sẵn sàng!");
          setDot("ready", "Sẵn sàng");
        } else {
          addLog("⚠ Server đang khởi động Telegram...");
          setDot("busy", "Đang kết nối...");
        }
      } catch {
        addLog("❌ Không kết nối được server. Đảm bảo server.js đang chạy.");
        setDot("error", "Mất kết nối server");
      }
    })();
  }, []);

  // Paste từ clipboard
  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      addLog("⚠ Không đọc được clipboard — hãy dán thủ công.");
    }
  }

  // Bước 1: lấy info (danh sách file)
  async function handleFetch() {
    const link = url.trim();
    if (!link) {
      addLog("⚠ Vui lòng nhập link Telegram.");
      return;
    }
    if (!link.includes("t.me/")) {
      addLog("❌ Link phải chứa t.me/");
      return;
    }

    setBusy(true);
    setFileList([]);
    setDot("busy", "Đang phân tích...");
    addLog("🔍 Đang phân tích link...");

    try {
      const res = await fetch(
        `${uri}/api/info?link=${encodeURIComponent(link)}&filter=${filter}`,
      );
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      const list = data.files.map((f) => ({
        ...f,
        downloading: false,
        done: false,
        dlError: null,
      }));
      setFileList(list);
      addLog(
        `✅ Tìm thấy ${data.total} file. Nhấn "Tải" để download từng file.`,
      );
      setDot("ready", "Sẵn sàng tải");
    } catch (e) {
      addLog(`❌ ${e.message}`);
      setDot("error", "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  // Bước 2: tải từng file — dùng <a download> để iOS kích hoạt save
  function downloadFile(file) {
    const link = url.trim();
    const name = prefix.trim() || "dl";
    const dlUrl = `${uri}/api/download?link=${encodeURIComponent(link)}&index=${file.index}&name=${encodeURIComponent(name)}&filter=${filter}`;

    setFileList((prev) =>
      prev.map((f) =>
        f.index === file.index ? { ...f, downloading: true, dlError: null } : f,
      ),
    );
    addLog(
      `⏳ Bắt đầu tải file ${file.index + 1}/${fileList.length} (.${file.ext})...`,
    );
    addLog(`📦 Safari sẽ hỏi lưu vào "Photos" hoặc "Files".`);

    // Tạo thẻ <a> ẩn, click → iOS Safari bắt đầu download
    const a = document.createElement("a");
    a.href = dlUrl;
    a.download = `${name}_${file.index}.${file.ext}`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Đánh dấu "đã kích hoạt" (không biết chắc xong chưa vì browser tự handle)
    setTimeout(() => {
      setFileList((prev) =>
        prev.map((f) =>
          f.index === file.index ? { ...f, downloading: false, done: true } : f,
        ),
      );
      addLog(`✅ File ${file.index + 1} đã được gửi về trình duyệt!`);
      const allDone = fileList.every((f) => f.index === file.index || f.done);
      if (allDone) {
        setDot("ready", "Hoàn tất!");
        addLog("🎉 Tất cả file đã được tải!");
      }
    }, 1200);
  }

  // Tải tất cả tuần tự (delay 800ms giữa các file để Safari không bị chặn)
  async function downloadAll() {
    for (const file of fileList) {
      if (file.done) continue;
      downloadFile(file);
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  const MEDIA_OPTIONS = [
    { value: "all", icon: "📥", label: "Tất cả", sub: "video + ảnh" },
    { value: "video", icon: "🎬", label: "Video", sub: "mp4, mkv..." },
    { value: "image", icon: "🖼", label: "Ảnh", sub: "jpg, png..." },
  ];

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.headerIcon}>✈</div>
        <h2 style={S.h2}>Telegram Downloader</h2>
        <span style={S.versionTag}>v3.0</span>
      </div>

      {/* Config card */}
      <div style={S.card}>
        {/* Prefix */}
        <span style={S.label}>Tên file (tuỳ chọn)</span>
        <input
          style={S.input}
          type="text"
          placeholder="Prefix tên file, để trống = tự đặt..."
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          disabled={busy}
        />

        <div style={S.divider} />

        {/* Media filter */}
        <span style={S.label}>Loại phương tiện</span>
        <div style={S.mediaGrid}>
          {MEDIA_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              style={S.mediaOpt(filter === opt.value)}
              onClick={() => !busy && setFilter(opt.value)}
            >
              <span style={S.mediaIcon}>{opt.icon}</span>
              <span style={S.mediaLbl(filter === opt.value)}>{opt.label}</span>
              <span style={S.mediaSub}>{opt.sub}</span>
            </div>
          ))}
        </div>

        <div style={S.divider} />

        {/* Link */}
        <span style={S.label}>Link Telegram</span>
        <div style={S.row}>
          <input
            style={{ ...S.input, flex: 1 }}
            type="url"
            inputMode="url"
            placeholder="Dán link t.me/... vào đây..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={busy}
            onKeyDown={(e) => e.key === "Enter" && !busy && handleFetch()}
          />
          <Btn onClick={handlePaste} disabled={busy}>
            📋
          </Btn>
        </div>
        <Btn
          variant="primary"
          onClick={handleFetch}
          disabled={busy || !url.trim()}
        >
          {busy ? "⏳ Đang xử lý..." : "🔍 Phân tích link"}
        </Btn>
      </div>

      {/* File list */}
      {fileList.length > 0 && (
        <div style={S.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={S.label}>File tìm thấy ({fileList.length})</span>
            {fileList.length > 1 && (
              <Btn
                variant="primary"
                onClick={downloadAll}
                style={{ padding: "6px 12px", fontSize: "11px" }}
              >
                ⬇ Tải tất cả
              </Btn>
            )}
          </div>
          {fileList.map((file) => (
            <div key={file.index} style={S.fileItem}>
              <span style={S.fileExt}>{file.ext}</span>
              <span
                style={{ flex: 1, fontSize: "11px", color: "var(--text-dim)" }}
              >
                File {file.index + 1}
              </span>
              {file.size && (
                <span style={S.fileSize}>{formatSize(file.size)}</span>
              )}
              {file.done ? (
                <span style={{ fontSize: "14px" }}>✅</span>
              ) : (
                <Btn
                  variant="primary"
                  onClick={() => downloadFile(file)}
                  disabled={file.downloading}
                  style={{ padding: "5px 10px", fontSize: "11px" }}
                >
                  {file.downloading ? "⏳" : "⬇ Tải"}
                </Btn>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Log */}
      <div style={S.logWrap}>
        <div style={S.logHeader}>
          <span style={S.logHeaderLabel}>📟 Console</span>
          <Btn
            onClick={() => setLogs([])}
            style={{ fontSize: "10px", padding: "3px 8px" }}
          >
            Xoá
          </Btn>
        </div>
        <div style={S.log} ref={logRef}>
          {logs.map((l, i) => (
            <div key={i} style={S.logLine}>
              <span style={S.logTime}>{l.time}</span>
              <span style={S.logMsg(l.cls)}>{l.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div style={S.statusBar}>
        <div style={S.dot(status.type)} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {status.text}
        </span>
      </div>
    </div>
  );
}
