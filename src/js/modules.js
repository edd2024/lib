import * as mod_3d_stack from "./3d-stack.js";
import * as mod_progress_indicator from "./progress-indicator.js";

export function initLib() {
  if (typeof mod_3d_stack.init === 'function') { try { mod_3d_stack.init(); } catch (e) { console.warn('init failed for 3d-stack.js:', e); } }
  if (typeof mod_progress_indicator.init === 'function') { try { mod_progress_indicator.init(); } catch (e) { console.warn('init failed for progress-indicator.js:', e); } }
}
