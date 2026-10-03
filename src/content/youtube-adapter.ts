export function findPlayer(
  doc: Document,
): { video: HTMLVideoElement; host: HTMLElement } | null {
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
