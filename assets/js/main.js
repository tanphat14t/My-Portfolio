// Mobile menu
const toggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu");
toggle.addEventListener("click", () => menu.classList.toggle("show"));

// Active link on scroll
const sections = ["about", "skills", "experience", "projects", "contact"].map(
  (id) => document.getElementById(id),
);
const links = Array.from(document.querySelectorAll(".menu a")).filter((a) =>
  a.getAttribute("href").startsWith("#"),
);
const yEl = document.getElementById("y");
yEl.textContent = new Date().getFullYear();

function setActive() {
  const pos = window.scrollY + 120;
  let current = sections[0].id;
  sections.forEach((sec) => {
    if (sec.offsetTop <= pos) current = sec.id;
  });
  links.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + current),
  );
}
setActive();
window.addEventListener("scroll", setActive);

// Reveal on scroll (simple)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll("[data-reveal]")
  .forEach((el) => observer.observe(el));

// Filter projects
const filterBtns = document.querySelectorAll(".filter button");
const cards = document.querySelectorAll(".project");
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const type = btn.dataset.filter;
    cards.forEach((c) => {
      const match = type === "all" || c.dataset.type.includes(type);
      c.style.display = match ? "" : "none";
    });
  });
});

// Handle contact form submit via Formspree
async function handleContactSubmit(form) {
  const n = form.querySelector("#name").value.trim();
  const e = form.querySelector("#email").value.trim();
  const m = form.querySelector("#message").value.trim();
  const note = document.getElementById("formNote");
  const submitBtn = document.getElementById("contactSubmit");
  if (!n || !e || !m) {
    note.textContent = "Vui lòng điền đầy đủ thông tin.";
    return;
  }
  const formspreeId = form.dataset.formspree;
  if (!formspreeId || formspreeId === "YOUR_FORMSPREE_ID") {
    note.innerHTML =
      'Chưa cấu hình endpoint. Đăng ký miễn phí tại <a href="https://formspree.io" target="_blank" rel="noopener">Formspree</a> và thay `data-formspree` bằng mã của bạn.';
    return;
  }
  submitBtn.disabled = true;
  note.textContent = "Đang gửi...";
  try {
    const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: n,
        email: e,
        message: m,
        _subject: `${n} — Yêu cầu hợp tác từ portfolio`,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      note.textContent = "Đã gửi! Cảm ơn bạn, mình sẽ phản hồi sớm.";
      form.reset();
    } else {
      note.textContent = data.error || "Có lỗi khi gửi. Vui lòng thử lại sau.";
    }
  } catch (err) {
    note.textContent = "Lỗi mạng. Vui lòng kiểm tra kết nối.";
  } finally {
    submitBtn.disabled = false;
    setTimeout(() => {
      note.textContent = "Mình sẽ phản hồi trong 24h làm việc.";
    }, 4000);
  }
}
