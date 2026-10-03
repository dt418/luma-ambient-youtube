import css from "./glass.css?raw";
import { SettingsStore, type SettingsPatch } from "../shared/storage";
import { normalizeSettings } from "../shared/settings";
import { applyPreset } from "../shared/presets";
import { StatusSource } from "../shared/messages";
import { EDGES, type Settings, type PresetId } from "../shared/types";
import { applyGlassAppearance } from "./appearance";
export function mountPanel(
  root: HTMLElement | ShadowRoot,
  store: SettingsStore,
  statusSource: StatusSource,
  previewSettings?: (patch: SettingsPatch) => void,
) {
  let state = normalizeSettings(null);
  const style = document.createElement("style");
  style.textContent = css;
  const panel = document.createElement("section");
  panel.className = "luma-panel";
  panel.setAttribute("aria-label", "Luma · Thiết lập ánh sáng");
  const range = (
    key: keyof Settings,
    label: string,
    desc: string,
    min: number,
    max: number,
    step: number,
  ) =>
    `<div class="luma-field"><label class="luma-label" for="luma-${key}">${label}<output data-output="${key}"></output></label><input id="luma-${key}" type="range" data-setting="${key}" min="${min}" max="${max}" step="${step}" aria-describedby="luma-help-${key}"><p id="luma-help-${key}">${desc}</p></div>`;
  const check = (key: keyof Settings, label: string) =>
    `<label class="luma-check">${label}<input type="checkbox" data-setting="${key}"></label>`;
  panel.innerHTML = `<header class="luma-brand-row"><div><div class="luma-brand">Luma</div><small>Ánh sáng theo cảm xúc</small></div><span class="luma-version">01 / AMBIENT</span></header>
    <div class="luma-switch-row"><div><strong data-enabled-text>Ambient đang bật</strong><p class="luma-caption" data-status-text>Theo màu video · Tự động</p></div><label class="luma-switch"><input type="checkbox" data-setting="enabled" aria-label="Bật ánh sáng ambient"></label></div>
    <div class="luma-scene" aria-hidden="true"><div class="luma-screen"><svg viewBox="0 0 24 24"><path d="M8 5v14l12-7z"/></svg></div><span class="luma-scene-label">Không gian của bạn</span><span class="luma-badge" data-quality>Balanced</span></div>
    ${range("blur", "Độ blur", "Màu tự đồng bộ với video. Chỉ cần chọn độ mềm bạn thích.", 0, 120, 1)}
    <details class="luma-advanced"><summary>Nâng cao</summary>
    <section class="luma-pro-group"><h3>Bầu không khí</h3>
    <div class="luma-label"><span>Bầu không khí</span><span data-custom hidden>Tùy chỉnh</span></div><div class="luma-presets" aria-label="Preset ánh sáng">${(["calm", "cinematic", "vivid"] as PresetId[]).map((p, i) => `<button type="button" data-preset="${p}" aria-pressed="false">${["Êm dịu", "Điện ảnh", "Rực rỡ"][i]}</button>`).join("")}</div>
    <div class="luma-intensity"><label class="luma-label" for="luma-intensity">Cường độ<output data-output="intensity"></output></label><input type="range" id="luma-intensity" data-setting="intensity" min="0" max="1" step=".01"><div class="luma-range-extents"><span>Nhẹ nhàng</span><span>Đắm chìm</span></div></div>
    <button class="luma-auto" data-action="auto" type="button"><span aria-hidden="true">✧</span> Tự động cân chỉnh</button><p class="luma-note">Chất lượng tự thích nghi với máy của bạn.</p>
    </section><section class="luma-pro-group"><h3>Ánh sáng</h3>${range("spread", "Độ lan", "Mở rộng ánh sáng ra phía ngoài video.", 0, 2, 0.05)}${range("fadeMs", "Chuyển màu", "Thời gian để màu mới hòa vào màu trước.", 0, 1000, 10)}<div class="luma-directions">${EDGES.map((e, i) => `<label class="luma-check">${["Trên", "Phải", "Dưới", "Trái"][i]}<input type="checkbox" data-edge="${e}"></label>`).join("")}</div></section>
    <section class="luma-pro-group"><h3>Màu sắc</h3>${range("saturation", "Độ bão hòa", "Độ đậm màu của ánh sáng, không đổi màu video.", 0, 2, 0.05)}${range("vibrance", "Sắc độ", "Tăng màu nhạt một cách nhẹ nhàng.", 0, 1, 0.05)}${range("brightness", "Độ sáng", "Điều chỉnh độ sáng của ánh sáng xung quanh.", 0, 1.5, 0.05)}${range("highlightLimit", "Giới hạn vùng sáng", "Giữ các cảnh trắng không quá chói.", 0.3, 1, 0.05)}</section>
    <section class="luma-pro-group"><h3>Khung hình</h3>${check("blackBarDetection", "Bỏ viền đen khi lấy màu")}${range("blackBarSensitivity", "Độ nhạy viền đen", "Chỉ ảnh hưởng vùng lấy màu, không cắt video.", 0, 1, 0.05)}</section>
    <section class="luma-pro-group"><h3>Hiệu năng</h3><div class="luma-field"><label class="luma-label" for="luma-mode">Chất lượng</label><select id="luma-mode" data-setting="performanceMode"><option value="auto">Tự động · Khuyên dùng</option><option value="eco">Eco · Tiết kiệm</option><option value="balanced">Balanced · Cân bằng</option><option value="ultra">Ultra · Mượt hơn</option></select></div><div class="luma-field"><label class="luma-label" for="luma-ceiling">Mức cao nhất khi tự động</label><select id="luma-ceiling" data-setting="performanceCeiling"><option value="eco">Eco</option><option value="balanced">Balanced</option><option value="ultra">Ultra</option></select></div>${range("fpsLimit", "Giới hạn cập nhật", "Tối đa 30 FPS, độc lập tần số quét màn hình.", 1, 30, 1)}${range("sampleWidth", "Độ chi tiết lấy màu", "Số pixel ngang tối đa dùng để đọc màu video.", 32, 192, 8)}${check("floatingControl", "Hiện nút trên YouTube")}<label class="luma-check">Giảm chuyển động<input type="checkbox" data-reduced-motion></label><p class="luma-caption">Luôn tôn trọng cài đặt giảm chuyển động của hệ thống.</p></section></details>
    <p class="luma-message" data-message role="status" aria-live="polite" hidden></p><button type="button" class="luma-retry" data-action="retry" hidden>Thử lại</button><footer class="luma-footer"><button type="button" data-action="reset">Đặt lại mặc định</button><button type="button" data-action="privacy" aria-expanded="false">Riêng tư trên máy ↗</button></footer><p class="luma-privacy" hidden>Không theo dõi, không gửi khung hình hoặc lịch sử xem. Cài đặt được lưu trong Chrome trên máy này.</p>`;
  root.append(style, panel);
  const abort = new AbortController();
  const signal = abort.signal;
  const pendingWrites = new Map<
    string,
    { timer: ReturnType<typeof setTimeout>; patch: SettingsPatch }
  >();
  const query = <T extends Element>(selector: string) =>
    panel.querySelector<T>(selector)!;
  const sync = (s: Settings) => {
    state = s;
    panel.style.setProperty("--luma-glass-blur", `${s.blur * 0.3}px`);
    panel.dataset.reducedMotion = String(s.reducedMotion === "on");
    panel
      .querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-setting]")
      .forEach((el) => {
        const k = el.dataset.setting as keyof Settings;
        const v = s[k];
        if (el instanceof HTMLInputElement && el.type === "checkbox")
          el.checked = Boolean(v);
        else if (document.activeElement !== el) el.value = String(v);
      });
    for (const e of EDGES)
      query<HTMLInputElement>(`[data-edge="${e}"]`).checked = s.edges[e];
    query<HTMLInputElement>("[data-reduced-motion]").checked =
      s.reducedMotion === "on";
    panel
      .querySelectorAll<HTMLButtonElement>("[data-preset]")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.preset === s.preset)),
      );
    query<HTMLElement>("[data-custom]").hidden = s.preset !== "custom";
    query<HTMLElement>("[data-enabled-text]").textContent = s.enabled
      ? "Ambient đang bật"
      : "Ambient đang tắt";
    panel.querySelectorAll<HTMLOutputElement>("[data-output]").forEach((o) => {
      const k = o.dataset.output as keyof Settings;
      const v = s[k] as number;
      o.value =
        k === "intensity"
          ? `${Math.round(v * 100)}%`
          : k === "blur"
            ? `${v}px`
            : k === "fadeMs"
              ? `${v}ms`
              : ["fpsLimit", "sampleWidth"].includes(k)
                ? String(Math.round(v))
                : `${Math.round(v * 100)}%`;
    });
  };
  const error = () => {
    const el = query<HTMLElement>("[data-message]");
    el.hidden = false;
    el.textContent =
      "Chưa lưu được cài đặt. Hãy mở lại Luma hoặc tải lại trang.";
  };
  const settingPatch = (
    el: HTMLInputElement | HTMLSelectElement,
  ): SettingsPatch | undefined => {
    const key = el.dataset.setting as keyof Settings | undefined;
    if (!key) return;
    const value =
      el instanceof HTMLInputElement
        ? el.type === "checkbox"
          ? el.checked
          : Number(el.value)
        : el.value;
    const custom = [
      "intensity",
      "blur",
      "spread",
      "fadeMs",
      "saturation",
      "vibrance",
      "brightness",
      "highlightLimit",
    ].includes(key);
    return {
      [key]: value,
      ...(custom ? { preset: "custom" as const } : {}),
    } as SettingsPatch;
  };
  const write = (key: string, patch: SettingsPatch, delay = 0) => {
    store.preview(patch);
    previewSettings?.(patch);
    const previous = pendingWrites.get(key);
    if (previous) clearTimeout(previous.timer);
    pendingWrites.delete(key);
    if (!delay) {
      void store.patch(patch).catch(error);
      return;
    }
    const timer = setTimeout(() => {
      pendingWrites.delete(key);
      void store.patch(patch).catch(error);
    }, delay);
    pendingWrites.set(key, { timer, patch });
  };
  const flushWrites = () => {
    for (const [key, pending] of pendingWrites) {
      clearTimeout(pending.timer);
      pendingWrites.delete(key);
      void store.patch(pending.patch).catch(error);
    }
  };
  panel.addEventListener(
    "change",
    (ev) => {
      const el = ev.target as HTMLInputElement | HTMLSelectElement;
      const key = el.dataset.setting as keyof Settings | undefined;
      if (key) {
        const patch = settingPatch(el);
        if (patch) write(key, patch);
      } else if (el instanceof HTMLInputElement && el.dataset.edge) {
        write(`edge:${el.dataset.edge}`, {
          edges: { [el.dataset.edge]: el.checked },
          preset: "custom",
        });
      } else if (
        el instanceof HTMLInputElement &&
        el.hasAttribute("data-reduced-motion")
      ) {
        write("reducedMotion", {
          reducedMotion: el.checked ? "on" : "system",
        });
      }
    },
    { signal },
  );
  panel.addEventListener(
    "input",
    (ev) => {
      const el = ev.target as HTMLInputElement;
      if (el.type === "range") {
        const key = el.dataset.setting!;
        const output = query<HTMLOutputElement>(`[data-output="${key}"]`);
        output.value =
          key === "intensity"
            ? `${Math.round(Number(el.value) * 100)}%`
            : key === "blur"
              ? `${el.value}px`
              : el.value;
        const patch = settingPatch(el);
        if (patch) write(key, patch, 90);
      }
    },
    { signal },
  );
  panel.addEventListener(
    "click",
    (ev) => {
      const b = (ev.target as Element).closest<HTMLButtonElement>("button");
      if (!b) return;
      if (b.dataset.preset) {
        flushWrites();
        const next = applyPreset(state, b.dataset.preset as PresetId);
        const keys = [
          "preset",
          "intensity",
          "blur",
          "spread",
          "fadeMs",
          "saturation",
          "vibrance",
          "brightness",
          "highlightLimit",
        ] as const;
        const patch = Object.fromEntries(
          keys.map((k) => [k, next[k]]),
        ) as SettingsPatch;
        store.preview(patch);
        previewSettings?.(patch);
        void store.patch(patch).catch(error);
      } else if (b.dataset.action === "auto") {
        flushWrites();
        const patch = { performanceMode: "auto" } as const;
        store.preview(patch);
        previewSettings?.(patch);
        void store
          .patch(patch)
          .then(() => statusSource.retry())
          .catch(error);
      } else if (b.dataset.action === "reset") {
        flushWrites();
        const defaults = normalizeSettings(null);
        store.preview(defaults);
        previewSettings?.(defaults);
        void store.reset().catch(error);
      } else if (b.dataset.action === "retry") statusSource.retry();
      else if (b.dataset.action === "privacy") {
        const p = query<HTMLElement>(".luma-privacy");
        p.hidden = !p.hidden;
        b.setAttribute("aria-expanded", String(!p.hidden));
      }
    },
    { signal },
  );
  const off = store.subscribe(sync),
    offStatus = statusSource.subscribe((s) => {
      applyGlassAppearance(panel, s.accent);
      query<HTMLElement>("[data-quality]").textContent =
        s.quality === "eco"
          ? "Eco"
          : s.quality === "ultra"
            ? "Ultra"
            : "Balanced";
      query<HTMLElement>("[data-status-text]").textContent =
        s.state === "playing"
          ? "Theo màu video · Đang phát"
          : s.state === "paused"
            ? "Giữ ánh sáng · Video tạm dừng"
            : s.state === "disabled"
              ? "Bật để thắp sáng không gian"
              : s.state === "idle"
                ? "Mở video YouTube để bắt đầu"
                : "Không thể đọc màu video";
      const msg = query<HTMLElement>("[data-message]");
      msg.hidden = s.state !== "error" && s.state !== "idle";
      msg.textContent =
        s.state === "error"
          ? "Chưa đọc được khung hình. Thử kết nối lại hoặc tải lại trang."
          : s.state === "idle"
            ? "Luma hoạt động trên trang xem video YouTube."
            : "";
      query<HTMLElement>('[data-action="retry"]').hidden = s.state !== "error";
    });
  sync(state);
  return {
    destroy() {
      flushWrites();
      abort.abort();
      off();
      offStatus();
      panel.remove();
      style.remove();
    },
  };
}
