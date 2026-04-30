import { createWorker } from 'tesseract.js';

// Configuration for ALPR Service
// In a real app, these should be environment variables
const PLATERECOGNIZER_API_TOKEN = 'YOUR_API_TOKEN_HERE'; 
const PLATERECOGNIZER_URL = 'https://api.platerecognizer.com/v1/plate-reader/';

export interface OCRResult {
  text: string;
  confidence: number;
  isCloud: boolean;
  metadata?: any;
}

/**
 * Main OCR function that coordinates between cloud and local recognition.
 */
export async function performOCR(imageSource: string | Blob): Promise<OCRResult> {
  // 1. Try Cloud ALPR if online
  if (navigator.onLine && PLATERECOGNIZER_API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
    try {
      const cloudResult = await recognizePlateCloud(imageSource);
      if (cloudResult && cloudResult.text) {
        return cloudResult;
      }
    } catch (error) {
      console.warn('Cloud OCR failed, falling back to local:', error);
    }
  }

  // 2. Fallback to Local OCR (Tesseract.js)
  return await performLocalOCR(imageSource);
}

/**
 * Recognizes license plate using Plate Recognizer API.
 */
async function recognizePlateCloud(imageSource: string | Blob): Promise<OCRResult | null> {
  let blob: Blob;
  
  if (typeof imageSource === 'string') {
    const res = await fetch(imageSource);
    blob = await res.blob();
  } else {
    blob = imageSource;
  }

  const formData = new FormData();
  formData.append('upload', blob);
  formData.append('regions', 'ng'); // Nigerian plates as default, can be customized

  const response = await fetch(PLATERECOGNIZER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${PLATERECOGNIZER_API_TOKEN}`
    },
    body: formData
  });

  if (!response.ok) throw new Error('Cloud OCR API error');

  const data = await response.json();
  const result = data.results && data.results[0];

  if (result) {
    return {
      text: result.plate.toUpperCase(),
      confidence: Math.round(result.score * 100),
      isCloud: true,
      metadata: {
        vehicle_type: result.vehicle?.type,
        region: result.region?.code
      }
    };
  }

  return null;
}

/**
 * Local OCR fallback using Tesseract.js.
 */
async function performLocalOCR(imageSource: string | Blob): Promise<OCRResult> {
  const worker = await createWorker('eng');
  
  try {
    // Recognize with specific characters expected in license plates
    const { data: { text, confidence } } = await worker.recognize(imageSource);
    
    // Clean up text: Extract alphanumeric sequences that look like plates
    // Example: ABC-1234 or ABC123DE
    const cleaned = text.replace(/[^A-Z0-9\s-]/g, '').trim();
    const plates = cleaned.match(/[A-Z0-9-]{3,10}/g);
    const bestPlate = plates ? plates.reduce((a, b) => a.length > b.length ? a : b) : cleaned;
    
    await worker.terminate();
    return {
      text: bestPlate.toUpperCase(),
      confidence: Math.round(confidence),
      isCloud: false
    };
  } catch (error) {
    console.error('Local OCR Error:', error);
    await worker.terminate();
    return { text: '', confidence: 0, isCloud: false };
  }
}

/**
 * Pre-processes image to improve OCR accuracy.
 * Performs adaptive contrast stretching and grayscale conversion.
 */
export async function preprocessImage(imageBlob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageBlob);
        return;
      }

      // Resize for faster processing if too large
      const maxDim = 1200;
      let width = img.width;
      let height = img.height;
      
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = (maxDim / width) * height;
          width = maxDim;
        } else {
          width = (maxDim / height) * width;
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Enhanced Grayscale + Contrast Boost
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        // Luminance-weighted grayscale
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Simple Contrast Stretch (0.5 threshold)
        gray = gray < 128 ? gray * 0.8 : Math.min(255, gray * 1.2);
        
        data[i] = gray;
        data[i+1] = gray;
        data[i+2] = gray;
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else resolve(imageBlob);
      }, 'image/jpeg', 0.85);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(imageBlob);
  });
}
