// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { findPlayer } from "../src/content/youtube-adapter";

afterEach(() => {
  document.body.replaceChildren();
});

it("finds the active Shorts video and uses the Shorts player as its host", () => {
  document.body.innerHTML = `
    <ytd-shorts>
      <div id="shorts-player">
        <div class="html5-video-container">
          <video class="video-stream html5-main-video"></video>
        </div>
        <div class="ytp-right-controls"></div>
      </div>
    </ytd-shorts>`;

  const player = findPlayer(document, "/shorts/abc123");

  expect(player?.video).toBe(document.querySelector("video"));
  expect(player?.host).toBe(document.querySelector("#shorts-player"));
});

it("does not sample Home miniplayer or feed preview videos", () => {
  document.body.innerHTML = `
    <ytd-rich-item-renderer><video class="html5-main-video"></video></ytd-rich-item-renderer>
    <ytd-miniplayer><div id="movie_player"><video class="html5-main-video"></video></div></ytd-miniplayer>`;

  expect(findPlayer(document, "/")).toBeNull();
});

it("does not treat Home feed hover previews as the ambient source", () => {
  document.body.innerHTML =
    '<ytd-rich-item-renderer><video class="html5-main-video"></video></ytd-rich-item-renderer>';

  expect(findPlayer(document, "/")).toBeNull();
});
