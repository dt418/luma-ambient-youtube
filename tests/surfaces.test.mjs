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

it("applies the ambient surface to Home and Shorts page containers and sidebar", () => {
  expect(surfaces).toContain("html.luma-active #guide-content");
  expect(surfaces).toContain("html.luma-active ytd-browse");
  expect(surfaces).toContain("html.luma-active ytd-shorts");
  expect(surfaces).toContain("var(--luma-page-backdrop)");
});

it("keeps the playlist scroll container free of backdrop blur", () => {
  document.documentElement.classList.add("luma-active");
  const style = document.createElement("style");
  style.id = "luma-surface-test";
  style.textContent = surfaces;
  document.head.append(style);
  document.body.innerHTML = '<div id="playlist"><div id="items"></div></div>';

  const scroller = document.querySelector("#items");
  const rule = Array.from(style.sheet.cssRules).find((candidate) =>
    scroller.matches(candidate.selectorText),
  );
  expect(rule?.style.getPropertyValue("backdrop-filter")).toBe("none");
  expect(rule?.style.getPropertyValue("transition")).toBe("none");
});

it("keeps Shorts wrapper surfaces transparent so the ambient halo is visible", () => {
  document.documentElement.classList.add("luma-active");
  const youtubeStyle = document.createElement("style");
  youtubeStyle.textContent = `
    #shorts-container, #shorts-inner-container, ytd-reel-video-renderer,
    .short-video-container, .player-container { background: rgb(15, 15, 15) !important; }
  `;
  document.head.append(youtubeStyle);
  const style = document.createElement("style");
  style.textContent = surfaces;
  document.head.append(style);
  document.body.innerHTML = `
    <ytd-shorts>
      <div id="content">
        <div id="shorts-container">
          <div id="shorts-inner-container">
            <ytd-reel-video-renderer>
              <div class="short-video-container"><div class="player-container"></div></div>
            </ytd-reel-video-renderer>
          </div>
        </div>
      </div>
    </ytd-shorts>`;

  for (const selector of [
    "#shorts-container",
    "#shorts-inner-container",
    "ytd-reel-video-renderer",
    ".short-video-container",
    ".player-container",
  ]) {
    const surface = document.querySelector(selector);
    expect(
      surface,
      `${selector} should exist in the Shorts player`,
    ).not.toBeNull();
    expect(getComputedStyle(surface).backgroundColor, selector).toBe(
      "rgba(0, 0, 0, 0)",
    );
  }
});
