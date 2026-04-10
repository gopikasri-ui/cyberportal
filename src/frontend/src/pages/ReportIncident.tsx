import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@tanstack/react-router";
import {
  AlertTriangle,
  ChevronRight,
  Download,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  Mic,
  MicOff,
  Plus,
  QrCode,
  Shield,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// QR generation helper — uses QuickChart.io API (no package required)
function buildQRDataUrl(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(text);
    const apiUrl = `https://quickchart.io/qr?text=${encoded}&size=300&margin=1`;
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || 300;
      canvas.height = img.naturalHeight || 300;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("no canvas ctx"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("QR load failed"));
    img.src = apiUrl;
  });
}
import { useIncidentStore } from "../store/incidentStore";
import type {
  Criticality,
  DataExposedType,
  DetectionMethod,
  IncidentFormSystem,
  IncidentType,
  Severity,
  SystemType,
} from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormDetails {
  hostnames: string;
  userAccounts: string;
  systems: string;
  dataExposed: DataExposedType;
  usersAffected: string;
  businessImpact: string;
}

interface FormErrors {
  type_?: string;
  hostnames?: string;
  userAccounts?: string;
  systems?: string;
  usersAffected?: string;
  businessImpact?: string;
  affectedSystems?: string[];
}

const VOICE_LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "hi-IN", label: "Hindi" },
  { code: "te-IN", label: "Telugu" },
  { code: "bn-IN", label: "Bengali" },
  { code: "ta-IN", label: "Tamil" },
  { code: "mr-IN", label: "Marathi" },
  { code: "gu-IN", label: "Gujarati" },
];

const emptySystem = (): IncidentFormSystem => ({
  systemName: "",
  systemType: "Server" as SystemType,
  criticality: "Medium" as Criticality,
  compromiseDate: "",
  detectionMethod: "IDS" as DetectionMethod,
});

// ─── Field components ─────────────────────────────────────────────────────────

function CyberSelect({
  id,
  value,
  onChange,
  options,
  label,
  error,
  required,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label
          htmlFor={id}
          className="text-xs font-medium text-cyber-secondary uppercase tracking-wide"
        >
          {label}
          {required && <span className="text-cyber-critical ml-1">*</span>}
        </Label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-cyber w-full rounded-md px-3 py-2 text-sm text-cyber-text focus:outline-none"
      >
        {options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            className="bg-[#1a1f3a] text-[#eef2ff]"
          >
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-cyber-critical">{error}</p>}
    </div>
  );
}

function CyberInput({
  id,
  label,
  error,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label
          htmlFor={id}
          className="text-xs font-medium text-cyber-secondary uppercase tracking-wide"
        >
          {label}
          {required && <span className="text-cyber-critical ml-1">*</span>}
        </Label>
      )}
      <Input id={id} {...props} className="input-cyber h-9 text-sm" />
      {error && <p className="text-xs text-cyber-critical">{error}</p>}
    </div>
  );
}

function CyberTextarea({
  id,
  label,
  error,
  required,
  rows = 3,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label?: string;
  error?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label
          htmlFor={id}
          className="text-xs font-medium text-cyber-secondary uppercase tracking-wide"
        >
          {label}
          {required && <span className="text-cyber-critical ml-1">*</span>}
        </Label>
      )}
      <Textarea
        id={id}
        rows={rows}
        {...props}
        className="input-cyber text-sm resize-none leading-relaxed"
      />
      {error && <p className="text-xs text-cyber-critical">{error}</p>}
    </div>
  );
}

// ─── Tab 1 — Details ──────────────────────────────────────────────────────────

function DetailsTab({
  details,
  onChange,
  errors,
}: {
  details: FormDetails;
  onChange: (field: keyof FormDetails, value: string) => void;
  errors: FormErrors;
}) {
  const charMax = 1000;
  return (
    <div className="grid gap-4">
      <CyberTextarea
        id="hostnames"
        label="Affected Hostnames / IPs"
        required
        placeholder="e.g. FIN-SRV-02, 192.168.1.4"
        value={details.hostnames}
        onChange={(e) => onChange("hostnames", e.target.value)}
        error={errors.hostnames}
        rows={2}
        data-ocid="field-hostnames"
      />
      <CyberTextarea
        id="userAccounts"
        label="Affected User Accounts"
        required
        placeholder="e.g. priya.m, admin-db"
        value={details.userAccounts}
        onChange={(e) => onChange("userAccounts", e.target.value)}
        error={errors.userAccounts}
        rows={2}
        data-ocid="field-user-accounts"
      />
      <CyberTextarea
        id="systems"
        label="Systems / Applications"
        required
        placeholder="e.g. SAP Finance, CRM, AC"
        value={details.systems}
        onChange={(e) => onChange("systems", e.target.value)}
        rows={2}
        data-ocid="field-systems"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CyberSelect
          id="dataExposed"
          label="Data Types Potentially Exposed"
          value={details.dataExposed}
          onChange={(v) => onChange("dataExposed", v)}
          options={[
            { value: "None", label: "None" },
            { value: "PII", label: "PII" },
            { value: "Financial", label: "Financial" },
            { value: "Health", label: "Health" },
            { value: "Credentials", label: "Credentials" },
          ]}
          data-ocid="field-data-exposed"
        />
        <CyberInput
          id="usersAffected"
          label="Number of Users Affected"
          required
          type="number"
          min={0}
          max={1000000}
          placeholder="e.g. 50"
          value={details.usersAffected}
          onChange={(e) => onChange("usersAffected", e.target.value)}
          onBlur={(e) => {
            const val = Number.parseInt(e.target.value, 10);
            if (!Number.isNaN(val) && (val < 0 || val > 1000000)) {
              onChange("usersAffected", val < 0 ? "0" : "1000000");
            }
          }}
          error={errors.usersAffected}
          data-ocid="field-users-affected"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="businessImpact"
          className="text-xs font-medium text-cyber-secondary uppercase tracking-wide"
        >
          Business Impact<span className="text-cyber-critical ml-1">*</span>
        </Label>
        <Textarea
          id="businessImpact"
          rows={4}
          placeholder="Describe operational, financial or reputational impact so far..."
          value={details.businessImpact}
          onChange={(e) => onChange("businessImpact", e.target.value)}
          maxLength={charMax}
          className="input-cyber text-sm resize-none leading-relaxed"
          data-ocid="field-business-impact"
        />
        <div className="flex justify-between items-center">
          {errors.businessImpact ? (
            <p className="text-xs text-cyber-critical">
              {errors.businessImpact}
            </p>
          ) : (
            <span />
          )}
          <span
            className={`text-xs ml-auto ${details.businessImpact.length >= charMax * 0.9 ? "text-cyber-warning" : "text-cyber-secondary"}`}
          >
            {details.businessImpact.length} / {charMax} chars
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2 — Affected Systems ─────────────────────────────────────────────────

function SystemEntry({
  system,
  index,
  onChange,
  onRemove,
  error,
  showRemove,
}: {
  system: IncidentFormSystem;
  index: number;
  onChange: (field: keyof IncidentFormSystem, value: string) => void;
  onRemove: () => void;
  error?: string;
  showRemove: boolean;
}) {
  return (
    <div className="glassmorphic rounded-lg p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-cyber-blue uppercase tracking-wide">
          System #{index + 1}
        </span>
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded text-cyber-secondary hover:text-cyber-critical hover:bg-[rgba(255,71,87,0.1)] transition-colors-fast"
            aria-label="Remove system"
            data-ocid={`remove-system-${index}`}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <CyberInput
          id={`sys-name-${index}`}
          label="System Name"
          required
          placeholder="e.g. Finance Server"
          value={system.systemName}
          onChange={(e) => onChange("systemName", e.target.value)}
          data-ocid={`field-sys-name-${index}`}
        />
        <CyberSelect
          id={`sys-type-${index}`}
          label="System Type"
          value={system.systemType}
          onChange={(v) => onChange("systemType", v)}
          options={[
            { value: "Server", label: "Server" },
            { value: "Workstation", label: "Workstation" },
            { value: "Cloud", label: "Cloud" },
            { value: "Network", label: "Network" },
            { value: "Endpoint", label: "Endpoint" },
            { value: "Database", label: "Database" },
          ]}
        />
        <CyberSelect
          id={`criticality-${index}`}
          label="Criticality Level"
          value={system.criticality}
          onChange={(v) => onChange("criticality", v)}
          options={[
            { value: "Low", label: "Low" },
            { value: "Medium", label: "Medium" },
            { value: "High", label: "High" },
            { value: "Critical", label: "Critical" },
          ]}
        />
        <CyberInput
          id={`compromise-date-${index}`}
          label="Compromise Date"
          type="date"
          value={system.compromiseDate}
          onChange={(e) => onChange("compromiseDate", e.target.value)}
          data-ocid={`field-compromise-date-${index}`}
        />
        <CyberSelect
          id={`detection-${index}`}
          label="Detection Method"
          value={system.detectionMethod}
          onChange={(v) => onChange("detectionMethod", v)}
          options={[
            { value: "IDS", label: "IDS" },
            { value: "AV", label: "AV" },
            { value: "Manual", label: "Manual" },
            { value: "Third-party", label: "Third-party" },
            { value: "SIEM", label: "SIEM" },
            { value: "EDR", label: "EDR" },
          ]}
        />
      </div>
      {error && <p className="text-xs text-cyber-critical mt-2">{error}</p>}
    </div>
  );
}

function SystemsTab({
  systems,
  onChange,
  onAdd,
  onRemove,
  errors,
}: {
  systems: IncidentFormSystem[];
  onChange: (
    index: number,
    field: keyof IncidentFormSystem,
    value: string,
  ) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  errors: FormErrors;
}) {
  return (
    <div className="flex flex-col gap-4">
      {systems.map((sys, i) => (
        <SystemEntry
          key={`sys-${sys.systemName || "new"}-${i}-${systems.length}`}
          system={sys}
          index={i}
          onChange={(field, value) => onChange(i, field, value)}
          onRemove={() => onRemove(i)}
          error={errors.affectedSystems?.[i]}
          showRemove={systems.length > 1}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={onAdd}
        className="w-full border-dashed border-cyber-border/60 text-cyber-secondary hover:text-cyber-blue hover:border-cyber-blue/50 hover:bg-[rgba(107,140,255,0.06)] gap-2"
        data-ocid="add-system-btn"
      >
        <Plus size={15} />
        Add Another System
      </Button>
    </div>
  );
}

// ─── Tab 3 — Evidence & QR ────────────────────────────────────────────────────

interface EvidenceFile {
  file: File;
  preview?: string;
  uploading?: boolean;
  progress?: number;
}

function FileDropZone({
  files,
  onFilesAdd,
  onFileRemove,
}: {
  files: EvidenceFile[];
  onFilesAdd: (newFiles: File[]) => void;
  onFileRemove: (index: number) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    ".log",
    ".txt",
  ];
  const MAX_MB = 10;

  const processFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid: File[] = [];
    for (const f of Array.from(incoming)) {
      if (f.size > MAX_MB * 1024 * 1024) {
        toast.error(`${f.name} exceeds 10MB limit`);
        continue;
      }
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      const accepted = ["jpg", "jpeg", "png", "pdf", "log", "txt"];
      if (
        !accepted.includes(ext) &&
        !f.type.startsWith("image/") &&
        f.type !== "application/pdf"
      ) {
        toast.error(`${f.name}: unsupported format`);
        continue;
      }
      valid.push(f);
    }
    if (valid.length) onFilesAdd(valid);
  };

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs font-medium text-cyber-secondary uppercase tracking-wide">
        Evidence Files
      </Label>
      <button
        type="button"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          processFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-smooth w-full ${
          dragOver
            ? "border-cyber-blue/60 bg-[rgba(107,140,255,0.08)]"
            : "border-cyber-border/50 hover:border-cyber-blue/40 hover:bg-[rgba(107,140,255,0.04)]"
        }`}
        data-ocid="file-drop-zone"
        aria-label="Upload evidence files"
      >
        <Upload size={28} className="mx-auto mb-2 text-cyber-secondary" />
        <p className="text-sm text-cyber-text font-medium">
          Drop files here or click to upload
        </p>
        <p className="text-xs text-cyber-secondary mt-1">
          JPG, PNG, PDF, .log, .txt · Max 10MB per file
        </p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept={ACCEPTED.join(",")}
          onChange={(e) => processFiles(e.target.files)}
        />
      </button>

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((ef, i) => (
            <div
              key={`ef-${ef.file.name}-${i}`}
              className="glassmorphic rounded-md p-2.5 flex items-center gap-3"
            >
              {ef.preview ? (
                <img
                  src={ef.preview}
                  alt={ef.file.name}
                  className="w-10 h-10 rounded object-cover flex-shrink-0 border border-cyber-border/40"
                />
              ) : (
                <div className="w-10 h-10 rounded flex items-center justify-center bg-[rgba(107,140,255,0.1)] border border-cyber-border/40 flex-shrink-0">
                  {ef.file.type === "application/pdf" ? (
                    <FileText size={18} className="text-cyber-blue" />
                  ) : (
                    <ImageIcon size={18} className="text-cyber-secondary" />
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-cyber-text truncate">
                  {ef.file.name}
                </p>
                <p className="text-xs text-cyber-secondary">
                  {(ef.file.size / 1024).toFixed(1)} KB
                </p>
                {ef.uploading && (
                  <div className="mt-1 h-1 bg-cyber-border/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyber-blue rounded-full transition-all duration-300"
                      style={{ width: `${ef.progress ?? 0}%` }}
                    />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove(i);
                }}
                className="p-1 rounded text-cyber-secondary hover:text-cyber-critical transition-colors-fast"
                aria-label="Remove file"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QRSection({
  qrDataUrl,
  onGenerate,
  onDownload,
  onShare,
}: {
  qrDataUrl: string | null;
  onGenerate: () => void;
  onDownload: () => void;
  onShare: () => void;
}) {
  return (
    <div className="glassmorphic rounded-lg p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <QrCode size={16} className="text-cyber-blue" />
        <span className="text-sm font-semibold text-cyber-text">
          QR Code Generator
        </span>
      </div>
      <p className="text-xs text-cyber-secondary">
        Generate a QR code encoding the incident summary for quick sharing or
        scanning.
      </p>
      <Button
        type="button"
        onClick={onGenerate}
        className="bg-[rgba(107,140,255,0.15)] border border-cyber-blue/40 text-cyber-blue hover:bg-[rgba(107,140,255,0.25)] gap-2"
        variant="outline"
        data-ocid="generate-qr-btn"
      >
        <QrCode size={15} />
        Generate QR Code
      </Button>
      {qrDataUrl && (
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-white rounded-xl inline-block">
            <img src={qrDataUrl} alt="Incident QR code" className="w-40 h-40" />
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="border-cyber-border/60 text-cyber-secondary hover:text-cyber-text gap-1.5"
              data-ocid="download-qr-btn"
            >
              <Download size={13} />
              Download PNG
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onShare}
              className="border-cyber-border/60 text-cyber-secondary hover:text-cyber-text gap-1.5"
              data-ocid="share-qr-btn"
            >
              <MessageCircle size={13} />
              Share via WhatsApp
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function VoiceSection({
  onTranscript,
}: {
  onTranscript: (text: string) => void;
}) {
  type SpeechRecognitionInstance = {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult:
      | ((e: {
          results: { [i: number]: { [j: number]: { transcript: string } } };
        }) => void)
      | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
    start(): void;
    stop(): void;
  };
  type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;
  type WindowWithSpeech = typeof window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };

  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const getSR = (): SpeechRecognitionCtor | undefined => {
    const w = window as WindowWithSpeech;
    return w.SpeechRecognition ?? w.webkitSpeechRecognition;
  };

  useEffect(() => {
    const w = window as WindowWithSpeech;
    if (!w.SpeechRecognition && !w.webkitSpeechRecognition) setSupported(false);
  }, []);

  const toggleListening = () => {
    if (!supported) {
      toast.error("Voice input not supported in this browser");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = getSR();
    if (!SR) return;
    const rec = new SR();
    rec.lang = language;
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript ?? "";
      if (text) onTranscript(`${text} `);
    };
    rec.onerror = () => {
      setListening(false);
      toast.error("Voice recognition error");
    };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  return (
    <div className="glassmorphic rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Mic size={16} className="text-cyber-green" />
        <span className="text-sm font-semibold text-cyber-text">
          Voice Input
        </span>
        {!supported && (
          <span className="text-xs text-cyber-warning bg-[rgba(255,179,71,0.1)] border border-cyber-warning/30 px-2 py-0.5 rounded-full ml-auto">
            Not supported
          </span>
        )}
      </div>
      <p className="text-xs text-cyber-secondary">
        Speak to auto-fill the Business Impact field. Transcription appends to
        existing text.
      </p>
      <div className="flex gap-2 flex-wrap">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="input-cyber flex-1 min-w-[140px] rounded-md px-3 py-2 text-sm focus:outline-none"
          data-ocid="voice-language-select"
          disabled={listening}
        >
          {VOICE_LANGUAGES.map((l) => (
            <option
              key={l.code}
              value={l.code}
              className="bg-[#1a1f3a] text-[#eef2ff]"
            >
              {l.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={toggleListening}
          title={
            !supported ? "Voice input not supported in this browser" : undefined
          }
          className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
            listening
              ? "bg-[rgba(255,71,87,0.15)] border border-[rgba(255,71,87,0.5)] text-cyber-critical"
              : "bg-[rgba(45,227,165,0.1)] border border-[rgba(45,227,165,0.35)] text-cyber-green hover:bg-[rgba(45,227,165,0.2)]"
          } ${!supported ? "opacity-50 cursor-not-allowed" : ""}`}
          data-ocid="voice-mic-btn"
        >
          {listening ? (
            <>
              <span className="absolute inset-0 rounded-md bg-[rgba(255,71,87,0.15)] animate-ping" />
              <MicOff size={15} className="relative" />
              <span className="relative">Listening...</span>
            </>
          ) : (
            <>
              <Mic size={15} />
              Start Recording
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main ReportIncident page ─────────────────────────────────────────────────

export default function ReportIncident() {
  const router = useRouter();
  const { createIncident } = useIncidentStore();

  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const [incidentType, setIncidentType] = useState<IncidentType>("phishing");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [details, setDetails] = useState<FormDetails>({
    hostnames: "",
    userAccounts: "",
    systems: "",
    dataExposed: "None",
    usersAffected: "",
    businessImpact: "",
  });
  const [affectedSystems, setAffectedSystems] = useState<IncidentFormSystem[]>([
    emptySystem(),
  ]);
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleDetailChange = (field: keyof FormDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSystemChange = (
    i: number,
    field: keyof IncidentFormSystem,
    value: string,
  ) => {
    setAffectedSystems((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    );
  };

  const handleFilesAdd = useCallback((newFiles: File[]) => {
    const entries: EvidenceFile[] = newFiles.map((f) => ({
      file: f,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
      uploading: false,
      progress: 0,
    }));
    setEvidenceFiles((prev) => [...prev, ...entries]);
  }, []);

  const handleFileRemove = useCallback((index: number) => {
    setEvidenceFiles((prev) => {
      const removed = prev[index];
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleGenerateQR = async () => {
    const qrText = [
      `Incident Type: ${incidentType.toUpperCase()}`,
      `Severity: ${severity.toUpperCase()}`,
      `Hostnames: ${details.hostnames || "N/A"}`,
      `Users: ${details.usersAffected || "0"}`,
      `Data Exposed: ${details.dataExposed}`,
      `Generated: ${new Date().toISOString()}`,
    ].join("\n");
    try {
      const url = await buildQRDataUrl(qrText);
      setQrDataUrl(url);
      toast.success("QR code generated");
    } catch {
      toast.error("Failed to generate QR code");
    }
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `incident-qr-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareWhatsApp = () => {
    const text = [
      "🔴 Cyber Incident Report",
      `Type: ${incidentType.toUpperCase()}`,
      `Severity: ${severity.toUpperCase()}`,
      `Hosts: ${details.hostnames || "N/A"}`,
      `Users Affected: ${details.usersAffected || "0"}`,
      `Reported: ${new Date().toLocaleString()}`,
    ].join("\n");
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async () => {
    const valid = validateAll();
    if (!valid) {
      toast.error("Please fix validation errors before submitting");
      if (errors.hostnames || errors.userAccounts || errors.businessImpact)
        setActiveTab(0);
      else if (errors.affectedSystems?.some(Boolean)) setActiveTab(1);
      return;
    }
    setSubmitting(true);
    try {
      const id = await createIncident({
        type_: incidentType,
        severity,
        hostnames: details.hostnames
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        userAccounts: details.userAccounts
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        systems: details.systems
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        dataExposed: [details.dataExposed],
        usersAffected: BigInt(Number.parseInt(details.usersAffected) || 0),
        businessImpact: details.businessImpact,
        affectedSystems: affectedSystems.filter((s) => s.systemName.trim()),
        status: "reported",
      });
      toast.success(`Incident ${id} submitted successfully`);
      void router.navigate({ to: "/incidents" });
    } catch {
      toast.error("Failed to submit incident. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const validateAll = (): boolean => {
    const errs: FormErrors = {};
    if (!details.hostnames.trim()) errs.hostnames = "Required";
    if (!details.userAccounts.trim()) errs.userAccounts = "Required";
    if (!details.systems.trim()) errs.systems = "Required";
    if (!details.businessImpact.trim()) errs.businessImpact = "Required";
    if (details.usersAffected !== "") {
      const v = Number.parseInt(details.usersAffected, 10);
      if (Number.isNaN(v) || v < 0 || v > 1000000)
        errs.usersAffected = "Must be 0–1,000,000";
    }
    const sysErrors = affectedSystems.map((s) =>
      s.systemName.trim() ? "" : "System name required",
    );
    if (sysErrors.some(Boolean)) errs.affectedSystems = sysErrors;
    setErrors(errs);
    return !Object.values(errs).some((v) =>
      Array.isArray(v) ? v.some(Boolean) : Boolean(v),
    );
  };

  const handleClearForm = () => {
    if (!window.confirm("Clear all form fields? This cannot be undone."))
      return;
    setDetails({
      hostnames: "",
      userAccounts: "",
      systems: "",
      dataExposed: "None",
      usersAffected: "",
      businessImpact: "",
    });
    setAffectedSystems([emptySystem()]);
    for (const ef of evidenceFiles) {
      if (ef.preview) URL.revokeObjectURL(ef.preview);
    }
    setEvidenceFiles([]);
    setQrDataUrl(null);
    setErrors({});
    setActiveTab(0);
    toast.info("Form cleared");
  };

  const TABS = [
    { label: "Details", icon: <Shield size={13} /> },
    { label: "Affected Systems", icon: <AlertTriangle size={13} /> },
    { label: "Evidence & QR", icon: <QrCode size={13} /> },
  ];

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      for (const ef of evidenceFiles) {
        if (ef.preview) URL.revokeObjectURL(ef.preview);
      }
    };
  }, [evidenceFiles]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-cyber-blue rounded-full" />
          <h1 className="text-xl font-display font-bold text-cyber-text">
            Report Incident
          </h1>
          <span className="ml-2 text-xs font-semibold bg-[rgba(107,140,255,0.15)] text-cyber-blue border border-cyber-blue/30 px-2 py-0.5 rounded-full uppercase tracking-wide">
            New
          </span>
        </div>
        <p className="text-sm text-cyber-secondary pl-3">
          Submit a new cyber incident for SOC investigation and tracking.
        </p>
      </div>

      {/* Top-level incident metadata */}
      <div className="glassmorphic-card rounded-xl p-5">
        <p className="text-xs font-semibold text-cyber-secondary uppercase tracking-wide mb-3">
          Incident Classification
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CyberSelect
            id="incidentType"
            label="Incident Type"
            required
            value={incidentType}
            onChange={(v) => setIncidentType(v as IncidentType)}
            options={[
              { value: "phishing", label: "Phishing" },
              { value: "malware", label: "Malware" },
              { value: "breach", label: "Breach" },
              { value: "ransomware", label: "Ransomware" },
              { value: "ddos", label: "DDoS" },
              { value: "insider", label: "Insider Threat" },
              { value: "other", label: "Other" },
            ]}
            error={errors.type_}
            data-ocid="field-incident-type"
          />
          <CyberSelect
            id="severity"
            label="Severity"
            required
            value={severity}
            onChange={(v) => setSeverity(v as Severity)}
            options={[
              { value: "critical", label: "🔴 Critical" },
              { value: "high", label: "🟠 High" },
              { value: "medium", label: "🟡 Medium" },
              { value: "low", label: "🟢 Low" },
            ]}
            data-ocid="field-severity"
          />
        </div>
      </div>

      {/* Tab container */}
      <div className="glassmorphic-card rounded-xl overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-cyber-border/40 bg-[rgba(10,14,39,0.4)]">
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(i as 0 | 1 | 2)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition-smooth relative flex-1 justify-center sm:flex-none sm:justify-start ${
                activeTab === i
                  ? "text-cyber-blue tab-active-indicator"
                  : "text-cyber-secondary hover:text-cyber-text"
              }`}
              data-ocid={`tab-${tab.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <span
                className={
                  activeTab === i
                    ? "text-cyber-blue"
                    : "text-cyber-secondary/70"
                }
              >
                {tab.icon}
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{i + 1}</span>
              {/* Error indicator */}
              {((i === 0 &&
                (errors.hostnames ||
                  errors.userAccounts ||
                  errors.businessImpact)) ||
                (i === 1 && errors.affectedSystems?.some(Boolean))) && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyber-critical" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5">
          {activeTab === 0 && (
            <DetailsTab
              details={details}
              onChange={handleDetailChange}
              errors={errors}
            />
          )}
          {activeTab === 1 && (
            <SystemsTab
              systems={affectedSystems}
              onChange={handleSystemChange}
              onAdd={() =>
                setAffectedSystems((prev) => [...prev, emptySystem()])
              }
              onRemove={(i) =>
                setAffectedSystems((prev) => prev.filter((_, idx) => idx !== i))
              }
              errors={errors}
            />
          )}
          {activeTab === 2 && (
            <div className="flex flex-col gap-5">
              <FileDropZone
                files={evidenceFiles}
                onFilesAdd={handleFilesAdd}
                onFileRemove={handleFileRemove}
              />
              <QRSection
                qrDataUrl={qrDataUrl}
                onGenerate={handleGenerateQR}
                onDownload={handleDownloadQR}
                onShare={handleShareWhatsApp}
              />
              <VoiceSection
                onTranscript={(text) => {
                  handleDetailChange(
                    "businessImpact",
                    details.businessImpact + text,
                  );
                  toast.success("Transcript added to Business Impact");
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="glassmorphic rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleClearForm}
          className="bg-[rgba(255,71,87,0.12)] border border-[rgba(255,71,87,0.35)] text-cyber-critical hover:bg-[rgba(255,71,87,0.22)] gap-1.5"
          data-ocid="clear-form-btn"
        >
          <X size={14} />
          Clear Form
        </Button>
        <div className="flex gap-2 ml-auto">
          {activeTab < 2 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveTab((prev) => (prev + 1) as 0 | 1 | 2)}
              className="border-cyber-blue/40 text-cyber-blue hover:bg-[rgba(107,140,255,0.1)] gap-1.5"
              data-ocid="next-tab-btn"
            >
              Next: {TABS[activeTab + 1]?.label}
              <ChevronRight size={14} />
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-cyber-green text-[#0a0e27] font-semibold hover:opacity-90 gap-1.5 glow-accent"
            data-ocid="submit-incident-btn"
          >
            {submitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Shield size={14} />
                Submit Incident
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
