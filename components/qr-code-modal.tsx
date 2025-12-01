"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import QRCode from "react-qr-code";

export function QRCodeModal({
  isOpen,
  onClose,
  shortCode,
}: {
  isOpen: boolean;
  onClose: () => void;
  shortCode: string;
}) {
  const url = `${window.location.origin}/${shortCode}`;

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg");

    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");

      downloadLink.download = `qrcode-${shortCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              QR Code for /{shortCode}
            </ModalHeader>
            <ModalBody className="flex flex-col items-center justify-center py-6">
              <div className="bg-white p-4 rounded-lg">
                <QRCode
                  id="qr-code-svg"
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={url}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <p className="text-small text-default-500 mt-4 text-center">
                Scan this code to visit {url}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="flat" onPress={downloadQRCode}>
                Download PNG
              </Button>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
