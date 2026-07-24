/**
 * Shared canvas ref store — a simple module-level ref that
 * CanvasPreview writes to and ExportToolbar reads from.
 * Avoids prop drilling and context overhead for this single value.
 */
export const sharedCanvasRef: { current: HTMLCanvasElement | null } = {
  current: null,
};
