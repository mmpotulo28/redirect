"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Tabs, Tab } from "@heroui/tabs";
import { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { Download, Copy, Check, Save, Edit } from "lucide-react";
import { upload } from "@vercel/blob/client";

import { updateRedirectQRCode } from "@/app/actions";

const FRAME_STYLES = [
  { id: "none", name: "None", label: "No Frame" },
  { id: "simple", name: "Simple", label: "Simple Padding" },
  { id: "border", name: "Border", label: "Border" },
  { id: "polaroid", name: "Polaroid", label: "Polaroid" },
  { id: "phone", name: "Phone", label: "Phone Mockup" },
  { id: "ticket", name: "Ticket", label: "Ticket Stub" },
  { id: "rounded", name: "Rounded", label: "Rounded Border" },
  { id: "bubble", name: "Bubble", label: "Speech Bubble" },
  { id: "ribbon", name: "Ribbon", label: "Ribbon Header" },
  { id: "dot-matrix", name: "Dots", label: "Dot Matrix" },
  { id: "polaroid-border", name: "Polaroid+", label: "Polaroid & Border" },
  { id: "polaroid-border-scanme", name: "Pola+Scan", label: "Pola+Border+Scan" },
];

export function QRCodeModal({
  isOpen,
  onClose,
  shortCode,
  redirectId,
  initialQrCodeUrl,
  onSaved,
}: {
  isOpen: boolean;
  onClose: () => void;
  shortCode: string;
  redirectId: string;
  initialQrCodeUrl?: string | null;
  onSaved?: () => void;
}) {
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/${shortCode}`;

  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [frameStyle, setFrameStyle] = useState("none");
  const [showLogo, setShowLogo] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedQrCodeUrl, setSavedQrCodeUrl] = useState<string | null>(initialQrCodeUrl || null);
  const [isEditing, setIsEditing] = useState(!initialQrCodeUrl);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrSvgData, setQrSvgData] = useState<string>("");

  useEffect(() => {
    if (initialQrCodeUrl) {
      setSavedQrCodeUrl(initialQrCodeUrl);
      setIsEditing(false);
    }
  }, [initialQrCodeUrl]);

  // Capture SVG data when it changes
  useEffect(() => {
    const svg = document.getElementById("qr-code-svg");

    if (svg) {
      const data = new XMLSerializer().serializeToString(svg);

      setQrSvgData(data);
    }
  }, [url, fgColor, bgColor, isOpen]);

  // Draw canvas whenever dependencies change
  useEffect(() => {
    if (!qrSvgData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      if (showLogo && customLogo) {
        const logoImg = new Image();

        logoImg.crossOrigin = "Anonymous";
        logoImg.onload = () => {
          drawFrame(ctx, img, frameStyle, fgColor, bgColor, showLogo, shortCode, url, logoImg);
        };
        logoImg.src = customLogo;
      } else {
        drawFrame(ctx, img, frameStyle, fgColor, bgColor, showLogo, shortCode, url, null);
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(qrSvgData);
  }, [qrSvgData, frameStyle, fgColor, bgColor, showLogo, shortCode, url, customLogo]);

  const drawFrame = (
    ctx: CanvasRenderingContext2D | null,
    img: HTMLImageElement,
    style: string,
    fg: string,
    bg: string,
    logo: boolean,
    code: string,
    link: string,
    customLogoImg: HTMLImageElement | null
  ) => {
    if (!ctx) return;

    const qrSize = img.width; // Base size (256)
    let width = qrSize;
    let height = qrSize;
    let xOffset = 0;
    let yOffset = 0;

    // 1. Calculate Dimensions
    switch (style) {
      case "simple":
        width += 40;
        height += 40;
        xOffset = 20;
        yOffset = 20;
        break;
      case "border":
        width += 60;
        height += 60;
        xOffset = 30;
        yOffset = 30;
        break;
      case "polaroid":
      case "polaroid-border":
      case "polaroid-border-scanme":
        width += 60;
        height += 140;
        xOffset = 30;
        yOffset = 30;
        break;
      case "phone":
        width += 80;
        height += 160;
        xOffset = 40;
        yOffset = 60;
        break;
      case "ticket":
        width += 100;
        height += 40;
        xOffset = 50;
        yOffset = 20;
        break;
      case "rounded":
        width += 60;
        height += 60;
        xOffset = 30;
        yOffset = 30;
        break;
      case "bubble":
        width += 60;
        height += 100;
        xOffset = 30;
        yOffset = 30;
        break;
      case "ribbon":
        width += 60;
        height += 100;
        xOffset = 30;
        yOffset = 60;
        break;
      case "dot-matrix":
        width += 80;
        height += 80;
        xOffset = 40;
        yOffset = 40;
        break;
      default: // none
        break;
    }

    // Resize canvas
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    // 2. Draw Background & Frame
    ctx.fillStyle = style === "none" ? bg : "#ffffff";

    // Clear
    ctx.clearRect(0, 0, width, height);

    if (style === "phone") {
      // Phone body
      ctx.fillStyle = "#1a1a1a";
      roundRect(ctx, 0, 0, width, height, 40);
      ctx.fill();
      // Screen
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(20, 40, width - 40, height - 80);
      // Home button
      ctx.beginPath();
      ctx.arc(width / 2, height - 20, 10, 0, Math.PI * 2);
      ctx.strokeStyle = "#333";
      ctx.stroke();
    } else if (style === "ticket") {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(width - 20, 0);
      ctx.lineTo(width, 20);
      ctx.lineTo(width, height - 20);
      ctx.lineTo(width - 20, height);
      ctx.lineTo(20, height);
      ctx.lineTo(0, height - 20);
      ctx.lineTo(0, 20);
      ctx.closePath();
      ctx.fill();

      // Dashed lines
      ctx.strokeStyle = "#ccc";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(width * 0.7, 0);
      ctx.lineTo(width * 0.7, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Stub text
      ctx.save();
      ctx.translate(width * 0.85, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = "#000";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ADMIT ONE", 0, 0);
      ctx.restore();

    } else if (style === "rounded") {
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, 0, 0, width, height, 30);
      ctx.fill();
      ctx.strokeStyle = fg;
      ctx.lineWidth = 4;
      roundRect(ctx, 10, 10, width - 20, height - 20, 20);
      ctx.stroke();
    } else if (style === "bubble") {
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, 0, 0, width, height - 40, 20);
      ctx.fill();
      // Tail
      ctx.beginPath();
      ctx.moveTo(width / 2 - 20, height - 40);
      ctx.lineTo(width / 2, height);
      ctx.lineTo(width / 2 + 20, height - 40);
      ctx.fill();
    } else if (style === "ribbon") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 40, width, height - 40);

      // Ribbon
      ctx.fillStyle = fg;
      ctx.fillRect(10, 0, width - 20, 40);

      // Ribbon Text
      ctx.fillStyle = bg;
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SCAN ME", width / 2, 26);

    } else if (style === "dot-matrix") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = fg + "40"; // Transparent fg
      for (let i = 10; i < width; i += 20) {
        for (let j = 10; j < height; j += 20) {
          ctx.beginPath();
          ctx.arc(i, j, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // Clear center for QR
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(xOffset - 10, yOffset - 10, qrSize + 20, qrSize + 20);

    } else if (style !== "none") {
      // Default white bg for others
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    if (style === "border" || style.includes("polaroid-border")) {
      ctx.strokeStyle = fg;
      ctx.lineWidth = 8;
      if (style.includes("polaroid")) {
        ctx.strokeRect(xOffset - 4, yOffset - 4, qrSize + 8, qrSize + 8);
      } else {
        ctx.strokeRect(10, 10, width - 20, height - 20);
      }
    }

    // 3. Draw QR Code
    ctx.drawImage(img, xOffset, yOffset);

    // 4. Draw Overlays/Text
    if (style.includes("polaroid")) {
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";

      if (style === "polaroid-border-scanme") {
        ctx.font = "bold 28px sans-serif";
        ctx.fillText("SCAN ME", width / 2, height - 80);
        ctx.font = "18px sans-serif";
        ctx.fillStyle = "#666666";
        ctx.fillText(`/${code}`, width / 2, height - 40);
      } else {
        ctx.font = "bold 24px sans-serif";
        ctx.fillText(`/${code}`, width / 2, height - 60);
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#666666";
        ctx.fillText(link.replace(/^https?:\/\//, ''), width / 2, height - 30);
      }
    }

    // 5. Draw Logo
    if (logo) {
      const logoSize = qrSize * 0.2;
      const logoX = xOffset + (qrSize - logoSize) / 2;
      const logoY = yOffset + (qrSize - logoSize) / 2;

      // White circle background for logo
      ctx.beginPath();
      ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 4, 0, 2 * Math.PI);
      ctx.fillStyle = style === "none" ? bg : "#ffffff";
      ctx.fill();

      if (customLogoImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(customLogoImg, logoX, logoY, logoSize, logoSize);
        ctx.restore();
      } else {
        // Draw a simple "R" for Redirect (or just a colored circle)
        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, 2 * Math.PI);
        ctx.fillStyle = fg;
        ctx.fill();

        ctx.fillStyle = bg;
        ctx.font = `bold ${logoSize * 0.6}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("R", logoX + logoSize / 2, logoY + logoSize / 2 + 2);
      }
    }
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  const downloadQRCode = () => {
    if (!canvasRef.current) return;
    const pngFile = canvasRef.current.toDataURL("image/png");
    const downloadLink = document.createElement("a");

    downloadLink.download = `qrcode-${shortCode}.png`;
    downloadLink.href = pngFile;
    downloadLink.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;

    setIsSaving(true);
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current?.toBlob((b) => {
          if (b) resolve(b);
        }, "image/png");
      });

      // Upload to Vercel Blob
      const timestamp = Date.now();
      const file = new File([blob], `qrcode-${shortCode}-${timestamp}.png`, { type: "image/png" });
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      // Update DB
      await updateRedirectQRCode(redirectId, newBlob.url);

      setSavedQrCodeUrl(newBlob.url);
      setIsEditing(false);
      onSaved?.();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to save QR code:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} scrollBehavior="inside" size="full" onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Customize QR Code
            </ModalHeader>
            <ModalBody className="flex flex-col lg:flex-row gap-8 py-6 h-full">
              {/* Preview Section */}
              <div className="flex-1 flex flex-col items-center justify-center bg-default-50 rounded-xl p-8 min-h-[400px] overflow-auto">
                <div className="shadow-2xl rounded-lg overflow-hidden bg-white">
                  {!isEditing && savedQrCodeUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt="Saved QR Code" className="max-w-full h-auto" src={savedQrCodeUrl} />
                  ) : (
                    <canvas ref={canvasRef} className="max-w-full h-auto" />
                  )}
                </div>
                {/* Hidden Source QR for data generation */}
                <div className="hidden">
                  <QRCode
                    bgColor={bgColor}
                    fgColor={fgColor}
                    id="qr-code-svg"
                    size={256}
                    value={url}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>

              {/* Controls Section */}
              <div className="w-full lg:w-[400px] flex flex-col gap-6 h-full overflow-y-auto pr-2">
                {!isEditing && savedQrCodeUrl ? (
                  <div className="flex flex-col gap-4 h-full">
                    <div className="flex-1 flex flex-col justify-center items-center text-center gap-2">
                      <h3 className="text-xl font-semibold">QR Code Saved</h3>
                      <p className="text-default-500">This QR code is saved and linked to your redirect.</p>
                    </div>
                    <div className="mt-auto flex flex-col gap-3">
                      <Button
                        as="a"
                        className="w-full"
                        color="primary"
                        download={`qrcode-${shortCode}.png`}
                        href={savedQrCodeUrl}
                        startContent={<Download size={18} />}
                      >
                        Download PNG
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          startContent={<Copy size={18} />}
                          variant="flat"
                          onPress={copyToClipboard}
                        >
                          Copy Link
                        </Button>
                        <Button
                          className="flex-1"
                          startContent={<Edit size={18} />}
                          variant="flat"
                          onPress={() => setIsEditing(true)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Tabs aria-label="Options" color="primary" variant="underlined">
                      <Tab key="style" title="Frames">
                        <div className="grid grid-cols-2 gap-3 pt-4">
                          {FRAME_STYLES.map((style) => (
                            <button
                              key={style.id}
                              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${frameStyle === style.id
                                ? "border-primary bg-primary/5"
                                : "border-default-200 hover:border-default-300"
                                }`}
                              onClick={() => setFrameStyle(style.id)}
                            >
                              <div className="w-8 h-8 rounded bg-default-200" />
                              <span className="text-xs font-medium">{style.label}</span>
                              {frameStyle === style.id && (
                                <div className="absolute top-2 right-2 text-primary">
                                  <Check size={14} />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </Tab>
                      <Tab key="colors" title="Appearance">
                        <div className="flex flex-col gap-6 pt-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium" htmlFor="fg-color">Foreground Color</label>
                            <div className="flex gap-2 items-center">
                              <Input
                                className="w-12 h-12 p-1"
                                id="fg-color"
                                type="color"
                                value={fgColor}
                                onValueChange={setFgColor}
                              />
                              <Input
                                className="flex-1"
                                value={fgColor}
                                onValueChange={setFgColor}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium" htmlFor="bg-color">Background Color</label>
                            <div className="flex gap-2 items-center">
                              <Input
                                className="w-12 h-12 p-1"
                                id="bg-color"
                                type="color"
                                value={bgColor}
                                onValueChange={setBgColor}
                              />
                              <Input
                                className="flex-1"
                                value={bgColor}
                                onValueChange={setBgColor}
                              />
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-default-100 rounded-lg mt-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Center Logo</span>
                              <span className="text-xs text-default-500">Add brand logo</span>
                            </div>
                            <Switch isSelected={showLogo} onValueChange={setShowLogo} />
                          </div>

                          {showLogo && (
                            <div className="flex flex-col gap-2">
                              <span className="text-sm font-medium">Custom Logo</span>
                              <div className="flex flex-col gap-2">
                                <input
                                  accept="image/*"
                                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                  type="file"
                                  onChange={async (e) => {
                                    if (!e.target.files?.[0]) return;

                                    setIsUploading(true);
                                    try {
                                      const file = e.target.files[0];
                                      const newBlob = await upload(file.name, file, {
                                        access: 'public',
                                        handleUploadUrl: '/api/upload',
                                      });

                                      setCustomLogo(newBlob.url);
                                    } catch {
                                      // Handle error
                                    } finally {
                                      setIsUploading(false);
                                    }
                                  }}
                                />
                                {isUploading && <span className="text-xs text-default-500">Uploading...</span>}
                                {customLogo && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-success">Logo uploaded!</span>
                                    <button
                                      className="text-xs text-danger hover:underline"
                                      onClick={() => setCustomLogo(null)}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </Tab>
                    </Tabs>

                    <div className="mt-auto flex flex-col gap-3 pt-6">
                      <Button
                        className="w-full"
                        color="primary"
                        isLoading={isSaving}
                        startContent={!isSaving && <Save size={18} />}
                        onPress={handleSave}
                      >
                        Save & Update
                      </Button>
                      <Button
                        className="w-full"
                        startContent={<Download size={18} />}
                        variant="flat"
                        onPress={downloadQRCode}
                      >
                        Download PNG Only
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          startContent={<Copy size={18} />}
                          variant="flat"
                          onPress={copyToClipboard}
                        >
                          Copy Link
                        </Button>
                        {savedQrCodeUrl && (
                          <Button
                            className="flex-1"
                            variant="flat"
                            onPress={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}