// @vitest-environment jsdom
import { it, expect } from "vitest";
import { Scheduler } from "../src/ambient/scheduler";

it("processes every decoded video frame above 30 fps and cancels pending work", () => {
  let id = 0;
  const callbacks = new Map<number, VideoFrameRequestCallback>();
  const video = {
    currentTime: 0,
    requestVideoFrameCallback(callback: VideoFrameRequestCallback) {
      const next = ++id;
      callbacks.set(next, callback);
      return next;
    },
    cancelVideoFrameCallback(requestId: number) {
      callbacks.delete(requestId);
    },
  } as HTMLVideoElement;
  let calls = 0;
  const s = new Scheduler();
  s.start(video, () => calls++);
  for (let frame = 0; frame < 60 && callbacks.size; frame++) {
    const [requestId, callback] = callbacks.entries().next().value!;
    callbacks.delete(requestId);
    video.currentTime = (frame + 1) / 60;
    callback(frame * (1000 / 60), {
      mediaTime: video.currentTime,
    } as VideoFrameCallbackMetadata);
  }
  s.pause();
  expect(callbacks.size).toBe(0);
  s.destroy();
  expect(calls).toBe(60);
});
