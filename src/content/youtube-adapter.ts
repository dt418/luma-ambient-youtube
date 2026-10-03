export function findPlayer(
  doc: Document,
  pathname = doc.defaultView?.location.pathname ?? "/watch",
): { video: HTMLVideoElement; host: HTMLElement } | null {
  if (pathname.startsWith("/shorts/")) {
    const host = doc.querySelector<HTMLElement>("#shorts-player");
    const video = host?.querySelector<HTMLVideoElement>(
      "video.html5-main-video",
    );
    return video && host ? { video, host } : null;
  }

  // The Home feed has hover-preview videos; only bind to an explicit
  // miniplayer, never to a card preview.
  if (pathname === "/") {
    return null;
  }

  if (pathname !== "/watch") return null;
  const main =
    doc.querySelector<HTMLVideoElement>(
      "#movie_player video.html5-main-video",
    ) ?? doc.querySelector<HTMLVideoElement>("#movie_player video");
  const video =
    main ??
    Array.from(
      doc.querySelectorAll<HTMLVideoElement>("ytd-watch-flexy video"),
    ).find((v) => v.getBoundingClientRect().width > 0);
  const host =
    video?.closest<HTMLElement>("#movie_player") ?? video?.parentElement;
  return video && host ? { video, host } : null;
}
