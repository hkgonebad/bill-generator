import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface GeneratePDFOptions {
  elementId: string;
  fileName: string;
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
  orientation?: "portrait" | "landscape";
  removeWatermark?: boolean;
}

export const generatePDF = async (options: GeneratePDFOptions): Promise<void> => {
  const { elementId, fileName, successCallback, errorCallback, orientation = "portrait", removeWatermark = true } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    const error = new Error(`Element with ID ${elementId} not found`);
    if (errorCallback) {
      errorCallback(error);
    }
    return Promise.reject(error);
  }

  try {
    // Create a temporary clone if watermark needs to be removed
    let targetElement = element;
    let tempDiv: HTMLDivElement | null = null;

    if (removeWatermark) {
      tempDiv = document.createElement("div");
      tempDiv.innerHTML = element.innerHTML;

      // Remove the watermark from the clone
      const watermark = tempDiv.querySelector(".preview-watermark");
      if (watermark) {
        watermark.remove();
      }

      // Append the clone to the body but make it invisible
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "-9999px";
      document.body.appendChild(tempDiv);
      targetElement = tempDiv;
    }

    // Capture the element
    const canvas = await html2canvas(targetElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    // Remove the temporary element if it was created
    if (tempDiv) {
      document.body.removeChild(tempDiv);
    }

    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    const pdf = new jsPDF({
      orientation: orientation,
      unit: "mm",
      format: "a4",
    });

    const imgWidth = orientation === "portrait" ? 210 : 297; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    pdf.save(fileName);

    if (successCallback) {
      successCallback();
    }

    return Promise.resolve();
  } catch (error) {
    if (errorCallback) {
      errorCallback(error as Error);
    }
    return Promise.reject(error);
  }
};

export const updateCredits = async (status: string): Promise<void> => {
  try {
    if (status === "unauthenticated") {
      await fetch("/api/anonymous-credit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else if (status === "authenticated") {
      await fetch("/api/credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Error updating credits:", error);
    throw error;
  }
};

export const checkCredits = async (status: string, onError: (message: string) => void): Promise<boolean> => {
  try {
    if (status === "authenticated") {
      const creditsResponse = await fetch("/api/credits");
      const creditsData = await creditsResponse.json();

      if (creditsData.weeklyBillsGenerated >= creditsData.weeklyBillsLimit) {
        onError("You have reached your weekly bill generation limit. Please try again next week.");
        return false;
      }
    } else {
      const anonCreditsResponse = await fetch("/api/anonymous-credit");
      const anonCreditsData = await anonCreditsResponse.json();

      if (anonCreditsData.credits && anonCreditsData.credits.weeklyBillsGenerated >= 2) {
        onError("You have reached your weekly bill generation limit. Please sign in or create an account to generate more bills.");
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Error checking credits:", error);
    return false;
  }
};
