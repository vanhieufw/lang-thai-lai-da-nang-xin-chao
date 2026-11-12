(() => {
  const root = document.querySelector("[data-countdown]");
  if (root) {
    const end = new Date(root.dataset.end || "2026-11-30T23:59:59+07:00").getTime();
    const daysEl = root.querySelector("[data-cd-days]");
    const hoursEl = root.querySelector("[data-cd-hours]");
    const minsEl = root.querySelector("[data-cd-mins]");
    const secsEl = root.querySelector("[data-cd-secs]");
    const pad = (n) => String(Math.max(0, n)).padStart(2, "0");
    const tick = () => {
      const now = Date.now();
      let left = Math.max(0, Math.floor((end - now) / 1000));
      const d = Math.floor(left / 86400); left %= 86400;
      const h = Math.floor(left / 3600); left %= 3600;
      const m = Math.floor(left / 60);
      const s = left % 60;
      if (daysEl) daysEl.textContent = pad(d);
      if (hoursEl) hoursEl.textContent = pad(h);
      if (minsEl) minsEl.textContent = pad(m);
      if (secsEl) secsEl.textContent = pad(s);
    };
    tick();
    setInterval(tick, 1000);
  }

  // QR quét được - dẫn tới ảnh/video hài (classic)
  const QR_TARGET = "https://www.youtube.com/watch?v=6b_mrWQCztY";
  function qrImgUrl(data, size) {
    return "https://api.qrserver.com/v1/create-qr-code/?size=" + size + "x" + size + "&margin=8&data=" + encodeURIComponent(data);
  }

  const form = document.querySelector("[data-san-ve-form]");
  const dialog = document.querySelector("#voucher-dialog");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const fb = String(fd.get("fb") || "").trim();
    const contact = String(fd.get("contact") || "").trim();
    if (!fb || !contact) return;
    const code = "TTL-2026-" + Math.random().toString(36).slice(2, 5).toUpperCase() + Math.floor(Math.random() * 90 + 10);
    const codeEl = dialog?.querySelector("[data-voucher-code]");
    const qrEl = dialog?.querySelector("[data-voucher-qr]");
    const contactEl = dialog?.querySelector("[data-voucher-contact]");
    if (codeEl) codeEl.textContent = code;
    if (qrEl) {
      qrEl.innerHTML = "";
      const img = document.createElement("img");
      img.width = 180;
      img.height = 180;
      img.alt = "QR E-Voucher " + code;
      // Payload gồm mã + link hài - quét ra được URL thật
      img.src = qrImgUrl(QR_TARGET + "&voucher=" + encodeURIComponent(code), 180);
      img.loading = "eager";
      qrEl.appendChild(img);
      const cap = document.createElement("div");
      cap.style.cssText = "margin-top:6px;font-size:12px;color:#333;font-weight:700";
      cap.textContent = code;
      qrEl.appendChild(cap);
    }
    if (contactEl) {
      contactEl.textContent = "Đã ghi nhận liên hệ: " + contact + ". Giữ mã này trên điện thoại khi đến làng.";
    }
    try {
      sessionStorage.setItem("thai-lai-voucher", JSON.stringify({ code, fb, contact, at: Date.now() }));
    } catch {}
    dialog?.showModal();
  });

  dialog?.querySelectorAll("[data-close-voucher]").forEach((btn) => {
    btn.addEventListener("click", () => dialog.close());
  });
  dialog?.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
})();
