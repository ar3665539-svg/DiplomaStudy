/**
 * DiplomaStudy - API Wrapper
 * Auto-detect network, show skeleton + error
 */

import { detectErrorType } from "./errorState.js";

/**
 * Safe async wrapper
 * @param {Function} asyncFn - async function
 * @param {Object} options
 *   - onStart: called before fetch
 *   - onSuccess: called with data
 *   - onError: called with { type, error, message }
 */
export async function withApiState(asyncFn, options = {}) {
  const { onStart, onSuccess, onError } = options;

  try {
    if (onStart) onStart();

    const data = await asyncFn();

    if (onSuccess) onSuccess(data);
    return { data, error: null };

  } catch (err) {
    console.error("[API Error]", err);

    const errorType = detectErrorType(err);
    const errorInfo = {
      type: errorType,
      error: err,
      message: err?.message || "Unknown error"
    };

    if (onError) onError(errorInfo);
    return { data: null, error: errorInfo };
  }
}

/**
 * Check if currently online
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Listen for online/offline changes
 */
export function onConnectionChange(callback) {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}