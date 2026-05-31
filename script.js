document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");

      const isOpen = navLinks.classList.contains("open");
      menuToggle.textContent = isOpen ? "✕" : "☰";
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const leadForm = document.getElementById("leadForm");
  const leadTableBody = document.getElementById("leadTableBody");

  const totalLeads = document.getElementById("totalLeads");
  const activeLeads = document.getElementById("activeLeads");
  const wonLeads = document.getElementById("wonLeads");
  const revenuePotential = document.getElementById("revenuePotential");

  const pipelineNew = document.getElementById("pipelineNew");
  const pipelineContacted = document.getElementById("pipelineContacted");
  const pipelineOffer = document.getElementById("pipelineOffer");
  const pipelineWon = document.getElementById("pipelineWon");

  let leads = [
    {
      id: 1,
      name: "Anna Berger",
      company: "Berger Immobilien",
      email: "anna@berger-immobilien.de",
      phone: "+49 30 123456",
      budget: 7500,
      interest: "automation",
      priority: "hoch",
      status: "angebot",
      score: 92,
      notes: "Interessiert an automatisierter Lead-Bearbeitung."
    },
    {
      id: 2,
      name: "Markus Weber",
      company: "Weber Consulting",
      email: "kontakt@weber-consulting.de",
      phone: "+49 40 987654",
      budget: 3000,
      interest: "website",
      priority: "mittel",
      status: "kontaktiert",
      score: 74,
      notes: "Benötigt neue Business Website."
    },
    {
      id: 3,
      name: "Laura Schmidt",
      company: "Schmidt Bau GmbH",
      email: "info@schmidtbau.de",
      phone: "+49 89 555555",
      budget: 15000,
      interest: "software",
      priority: "hoch",
      status: "gewonnen",
      score: 96,
      notes: "Interesse an internem Projekt-Dashboard."
    }
  ];

  const statusLabels = {
    neu: "Neu",
    kontaktiert: "Kontaktiert",
    angebot: "Angebot",
    verhandlung: "Verhandlung",
    gewonnen: "Gewonnen",
    verloren: "Verloren"
  };

  const interestLabels = {
    website: "Website",
    automation: "KI & Automatisierung",
    software: "Softwareentwicklung",
    consulting: "IT-Beratung",
    support: "Hosting & Support"
  };

  function calculateLeadScore(budget, priority, interest, status) {
    let score = 35;

    if (budget >= 15000) score += 30;
    else if (budget >= 7500) score += 24;
    else if (budget >= 3000) score += 18;
    else if (budget >= 1500) score += 12;
    else score += 6;

    if (priority === "hoch") score += 22;
    if (priority === "mittel") score += 14;
    if (priority === "niedrig") score += 6;

    if (interest === "software") score += 14;
    if (interest === "automation") score += 13;
    if (interest === "website") score += 10;
    if (interest === "consulting") score += 9;
    if (interest === "support") score += 7;

    if (status === "gewonnen") score += 12;
    if (status === "verhandlung") score += 10;
    if (status === "angebot") score += 8;
    if (status === "kontaktiert") score += 5;
    if (status === "verloren") score -= 18;

    return Math.max(0, Math.min(score, 100));
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(value);
  }

  function getActiveLeadsCount() {
    return leads.filter((lead) => lead.status !== "gewonnen" && lead.status !== "verloren").length;
  }

  function updateDashboard() {
    const total = leads.length;
    const active = getActiveLeadsCount();
    const won = leads.filter((lead) => lead.status === "gewonnen").length;
    const revenue = leads
      .filter((lead) => lead.status !== "verloren")
      .reduce((sum, lead) => sum + Number(lead.budget), 0);

    totalLeads.textContent = total;
    activeLeads.textContent = active;
    wonLeads.textContent = won;
    revenuePotential.textContent = formatCurrency(revenue);

    pipelineNew.textContent = leads.filter((lead) => lead.status === "neu").length;
    pipelineContacted.textContent = leads.filter((lead) => lead.status === "kontaktiert").length;
    pipelineOffer.textContent = leads.filter((lead) => lead.status === "angebot").length;
    pipelineWon.textContent = won;
  }

  function renderLeads() {
    leadTableBody.innerHTML = "";

    if (leads.length === 0) {
      leadTableBody.innerHTML = `
        <tr class="empty-row">
          <td colspan="8">Noch keine Leads vorhanden. Fügen Sie den ersten Lead hinzu.</td>
        </tr>
      `;
      updateDashboard();
      return;
    }

    const sortedLeads = [...leads].sort((a, b) => b.score - a.score);

    sortedLeads.forEach((lead) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          <strong>${lead.name}</strong><br>
          <small>${lead.email}</small>
        </td>
        <td>${lead.company}</td>
        <td>${interestLabels[lead.interest] || lead.interest}</td>
        <td>${formatCurrency(Number(lead.budget))}</td>
        <td>
          <span class="status-badge status-${lead.status}">
            ${statusLabels[lead.status] || lead.status}
          </span>
        </td>
        <td>
          <span class="priority-badge priority-${lead.priority}">
            ${lead.priority}
          </span>
        </td>
        <td>
          <span class="score-badge">${lead.score}/100</span>
        </td>
        <td>
          <button class="delete-btn" data-id="${lead.id}">
            Löschen
          </button>
        </td>
      `;

      leadTableBody.appendChild(row);
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const id = Number(button.getAttribute("data-id"));
        leads = leads.filter((lead) => lead.id !== id);
        renderLeads();
      });
    });

    updateDashboard();
  }

  if (leadForm) {
    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("leadName").value.trim();
      const company = document.getElementById("companyName").value.trim();
      const email = document.getElementById("leadEmail").value.trim();
      const phone = document.getElementById("leadPhone").value.trim();
      const budget = Number(document.getElementById("budget").value);
      const interest = document.getElementById("interest").value;
      const priority = document.getElementById("priority").value;
      const status = document.getElementById("status").value;
      const notes = document.getElementById("notes").value.trim();

      if (!name || !company || !email || !budget || !interest || !priority || !status) {
        alert("Bitte füllen Sie alle Pflichtfelder aus.");
        return;
      }

      const score = calculateLeadScore(budget, priority, interest, status);

      const newLead = {
        id: Date.now(),
        name,
        company,
        email,
        phone,
        budget,
        interest,
        priority,
        status,
        score,
        notes
      };

      leads.push(newLead);
      renderLeads();
      leadForm.reset();

      const tableSection = document.querySelector(".lead-table");
      if (tableSection) {
        tableSection.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    });
  }

  const animatedElements = document.querySelectorAll(
    ".hero-content, .dashboard-preview, .stats-section div, .section-heading, .lead-form, .lead-insights, .table-wrapper, .feature-card, .value-card, .cta-section"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    animatedElements.forEach((element) => {
      element.classList.add("fade-element");
      observer.observe(element);
    });
  } else {
    animatedElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  renderLeads();

  console.log(
    "%cKI Lead Manager",
    "color:#38bdf8;font-size:22px;font-weight:bold;"
  );

  console.log(
    "%cCreated by Heaviside Solutions",
    "color:#94a3b8;font-size:14px;"
  );
});

