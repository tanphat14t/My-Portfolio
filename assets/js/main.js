// Mobile menu
const toggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu");
toggle.addEventListener("click", () => menu.classList.toggle("show"));

// Active link on scroll
const sections = ["about", "skills", "experience", "projects", "contact"].map(
  (id) => document.getElementById(id)
);
const links = Array.from(document.querySelectorAll(".menu a")).filter((a) =>
  a.getAttribute("href").startsWith("#")
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
    a.classList.toggle("active", a.getAttribute("href") === "#" + current)
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
  { threshold: 0.12 }
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

// Fake form submit
function fakeSubmit() {
  const n = document.getElementById("name").value.trim();
  const e = document.getElementById("email").value.trim();
  const m = document.getElementById("message").value.trim();
  const note = document.getElementById("formNote");
  if (!n || !e || !m) {
    note.textContent = "Vui lòng điền đầy đủ thông tin.";
    return;
  }
  note.textContent = "Đã gửi! Cảm ơn bạn, mình sẽ phản hồi sớm.";
  setTimeout(() => {
    note.textContent = "Mình sẽ phản hồi trong 24h làm việc.";
  }, 4000);
  // TODO: Hook email service / backend here.
}
