import * as mod_3d_stack from "./3d-stack.js";
import * as mod_carousel from "./carousel.js";

export function initLib() {
  if (typeof mod_3d_stack.init === 'function') { try { mod_3d_stack.init(); } catch (e) { console.warn('init failed for 3d-stack.js:', e); } }
  if (typeof mod_carousel.init === 'function') { try { mod_carousel.init(); } catch (e) { console.warn('init failed for carousel.js:', e); } }
}
