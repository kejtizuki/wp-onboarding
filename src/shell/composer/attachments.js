/**
 * ATTACHED IMAGES — the composer's side of "use these photos".
 *
 * Nothing is uploaded anywhere: this prototype has no server, so a picked file
 * becomes an object URL and the preview reads it straight off the blob. That
 * URL is a live reference into the document, though, not a copy — dropping the
 * last reference without revoking it leaks the whole file for the tab's
 * lifetime, hence `releaseAttachments`.
 */

let attachmentId = 0;

/** Only images — a dropped PDF or folder is silently ignored rather than shown. */
export const isImage = (file) => Boolean(file) && file.type.startsWith('image/');

/**
 * The label under the thumbnail, per the reference: extension only, upper
 * case. Falls back to the MIME subtype for a file with no extension at all.
 */
function formatKind(file) {
  const dot = file.name.lastIndexOf('.');
  if (dot > 0 && dot < file.name.length - 1) return file.name.slice(dot + 1).toUpperCase();
  return (file.type.split('/')[1] || 'IMG').toUpperCase();
}

/** The name without its extension — the chip shows the kind separately. */
function baseName(file) {
  const dot = file.name.lastIndexOf('.');
  return dot > 0 ? file.name.slice(0, dot) : file.name;
}

export function toAttachments(fileList) {
  return Array.from(fileList || [])
    .filter(isImage)
    .map((file) => ({
      id: `a${(attachmentId += 1)}`,
      name: baseName(file),
      kind: formatKind(file),
      url: URL.createObjectURL(file),
    }));
}

/** Hand back the blob URLs once nothing on screen is pointing at them. */
export function releaseAttachments(attachments) {
  attachments.forEach((attachment) => URL.revokeObjectURL(attachment.url));
}
