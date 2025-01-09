class Accordion {
  constructor(container) {
    this.container = container;
    this.setupAccordions();
  }

  setupAccordions() {
    this.container.querySelectorAll(".accordion-header").forEach((header) => {
      header.addEventListener("click", () => this.toggleAccordion(header));
    });
  }

  toggleAccordion(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector("i.fas");
    const isActive = content.classList.contains("active");

    // Cerrar todos los acordeones
    this.container.querySelectorAll(".accordion-content").forEach((content) => {
      content.classList.remove("active");
    });

    this.container
      .querySelectorAll(".accordion-header i.fas")
      .forEach((icon) => {
        icon.style.transform = "rotate(0deg)";
      });

    // Abrir el acordeón clickeado si estaba cerrado
    if (!isActive) {
      content.classList.add("active");
      if (icon) {
        icon.style.transform = "rotate(180deg)";
      }
    }
  }

  static createAccordionSection(title, content) {
    return `
      <div class="accordion-section">
        <div class="accordion-header">
          <h3>${title}</h3>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="accordion-content">
          ${content}
        </div>
      </div>
    `;
  }
}
