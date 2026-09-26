/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getCustomGuruPhoto } from "../lib/guruPhotoStore";

export const GURU_SADIQ_PHOTO_PATH = "/guru_sadiq.jpg";
export const GURU_SADIQ_PHOTO_FALLBACK = "/FOTOKU.jpg";

export function getActiveGuruPhoto(): string | null {
  return getCustomGuruPhoto();
}
