// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { afterEach, expect, it } from "vitest";

const surfaces = readFileSync("src/content/page-surfaces.css", "utf8");

afterEach(() => {
  document.documentElement.classList.remove("luma-active");
  document.head.querySelector("#luma-surface-test")?.remove();
  document.body.replaceChildren();
});

it("keeps YouTube popup dialogs above the ambient page layer", () => {
  document.documentElement.classList.add("luma-active");
  const style = document.createElement("style");
  style.id = "luma-surface-test";
  style.textContent = surfaces;
  document.head.append(style);
  document.body.innerHTML = `
    <ytd-app id="app"></ytd-app>
    <ytd-popup-container id="popup" style="position: fixed">
      <tp-yt-paper-dialog id="dialog"><button>Hủy đăng ký</button></tp-yt-paper-dialog>
    </ytd-popup-container>`;

  const appLayer = Number.parseInt(
    getComputedStyle(document.querySelector("#app")).zIndex,
    10,
  );
  const popupLayer = Number.parseInt(
    getComputedStyle(document.querySelector("#popup")).zIndex,
    10,
  );

  expect(popupLayer).toBeGreaterThan(appLayer);
});
