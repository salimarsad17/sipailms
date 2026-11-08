/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Purges and disconnects all cached Google Sheets / Google Apps Script tokens,
 * spreadsheet IDs, URLs, and auto-sync configurations from client localStorage.
 */
export function purgeGoogleSheetsConnection(): { success: boolean; clearedKeys: string[] } {
  const keysToPurge = [
    "pailms_sheets_rekap_sync_config",
    "pai_lms_gsheet_id",
    "pai_lms_gsheet_url",
    "pai_lms_auto_sync_cfg",
    "pai_lms_apps_script_url",
    "google_access_token",
    "google_user_profile",
    "pai_google_auth_user",
    "gapi_token",
    "gapi_client_id"
  ];

  const cleared: string[] = [];
  try {
    keysToPurge.forEach((key) => {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        cleared.push(key);
      }
    });
  } catch (err) {
    console.warn("Notice clearing Google Sheets storage:", err);
  }

  return { success: true, clearedKeys: cleared };
}
