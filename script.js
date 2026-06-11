document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "heaviside_ai_lead_manager_leads";

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");

      const isOpen = navLinks.classList.contains("open");
      menuToggle.textContent = isOpen ? "✕" : "☰";
      menuToggle.setAttribute("aria-expanded", String(isOpen));
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

  const demoLeads = [
    {
      id: 1,
      name: "Anna Berger",
      company: "Berger Immobilien",
      email: "anna@berger-immobilien.de",
      phone: "+49 30 123456",
      budget: 9500,
      interest: "automation",
      priority: "hoch",
      status: "angebot",
      notes: "Möchte Kontaktformular-Anfragen automatisch bewerten und priorisieren."
    },
    {
      id: 2,
      name: "Markus Weber",
      company: "Weber Consulting",
      email: "kontakt@weber-consulting.de",
      phone: "+49 40 987654",
      budget: 4200,
      interest: "website",
      priority: "mittel",
      status: "kontaktiert",
      notes: "Benötigt eine moderne Website mit klarer Lead-Struktur."
    },
    {
      id: 3,
      name: "Laura Schmidt",
      company: "Schmidt Bau GmbH",
      email: "info@schmidtbau.de",
      phone: "+49 89 555555",
      budget: 18000,
      interest: "software",
      priority: "hoch",
      status: "gewonnen",
      notes: "Interesse an internem Dashboard für Projekt- und Kundenanfragen."
    },
    {
      id: 4,
      name: "David Keller",
      company: "Keller Digital",
      email: "david@keller-digital.de",
      phone: "+49 221 445566",
      budget: 6800,
      interest: "consulting",
      priority: "mittel",
      status: "neu",
      notes: "Sucht Beratung zur Digitalisierung des Vertriebsprozesses."
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

  const priorityLabels = {
    niedrig: "Niedrig",
    mittel: "Mittel",
    hoch: "Hoch"
  };

  function escapeHTML(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function calculateLeadScore(budget, priority, interest, status) {
    let score = 30;

    if (budget >= 15000) score += 32;
    else if (budget >= 7500) score += 25;
    else if (budget >= 3000) score += 18;
    else if (budget >= 1500) score += 10;
    else score += 5;

    if (priority === "hoch") score += 24;
    else if (priority === "mittel") score += 14;
    else if (priority === "niedrig") score += 6;

    if (interest === "software") score += 16;
    else if (interest === "automation") score += 15;
    else if (interest === "website") score += 11;
    else if (interest === "consulting") score += 9;
    else if (interest === "support") score += 7;

    if (status === "gewonnen") score += 12;
    else if (status === "verhandlung") score += 10;
    else if (status === "angebot") score += 8;
    else if (status === "kontaktiert") score += 5;
    else if (status === "verloren") score -= 22;

    return Math.max(0, Math.min(Math.round(score), 100));
  }

  function normalizeLead(lead) {
    return {
      ...lead,
      budget: Number(lead.budget) || 0,
      score: calculateLeadScore(
        Number(lead.budget) || 0,
        lead.priority,
        lead.interest,
        lead.status
      )
    };
  }

  function loadLeads() {
    try {
      const savedLeads = localStorage.getItem(STORAGE_KEY);

      if (!savedLeads) {
        return demoLeads.map(normalizeLead);
      }

      const parsedLeads = JSON.parse(savedLeads);

      if (!Array.isArray(parsedLeads)) {
        return demoLeads.map(normalizeLead);
      }

      return parsedLeads.map(normalizeLead);
    } catch (error) {
      console.warn("Lead data could not be loaded. Demo data is used instead.");
      return demoLeads.map(normalizeLead);
    }
  }

  let leads = loadLeads();

  function saveLeads() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  function getActiveLeadsCount() {
    return leads.filter(
      (lead) => lead.status !== "gewonnen" && lead.status !== "verloren"
    ).length;
  }

  function getScoreLabel(score) {
    if (score >= 85) return "Sehr heiß";
    if (score >= 70) return "Interessant";
    if (score >= 50) return "Prüfen";
    return "Niedrig";
  }

  function updateText(element, value) {
    if (element) element.textContent = value;
  }

  function updateDashboard() {
    const total = leads.length;
    const active = getActiveLeadsCount();
    const won = leads.filter((lead) => lead.status === "gewonnen").length;
    const revenue = leads
      .filter((lead) => lead.status !== "verloren")
      .reduce((sum, lead) => sum + Number(lead.budget || 0), 0);

    updateText(totalLeads, total);
    updateText(activeLeads, active);
    updateText(wonLeads, won);
    updateText(revenuePotential, formatCurrency(revenue));

    updateText(pipelineNew, leads.filter((lead) => lead.status === "neu").length);
    updateText(
      pipelineContacted,
      leads.filter((lead) => lead.status === "kontaktiert").length
    );
    updateText(
      pipelineOffer,
      leads.filter((lead) => lead.status === "angebot").length
    );
    updateText(pipelineWon, won);
  }

  function getStatusOptions(currentStatus) {
    return Object.entries(statusLabels)
      .map(([value, label]) => {
        const selected = value === currentStatus ? "selected" : "";
        return `<option value="${value}" ${selected}>${label}</option>`;
      })
      .join("");
  }

  function renderLeads() {
    if (!leadTableBody) {
      updateDashboard();
      return;
    }

    leadTableBody.innerHTML = "";

    if (leads.length === 0) {
      leadTableBody.innerHTML = `
        <tr class="empty-row">
          <td colspan="8">Noch keine Leads vorhanden. Fügen Sie den ersten Lead hinzu.</td>
        </tr>
      `;
      updateDashboard();
      saveLeads();
      return;
    }

    const sortedLeads = [...leads].sort((a, b) => b.score - a.score);

    sortedLeads.forEach((lead) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          <strong>${escapeHTML(lead.name)}</strong><br>
          <small>${escapeHTML(lead.email)}</small>
        </td>

        <td>
          <strong>${escapeHTML(lead.company)}</strong><br>
          <small>${escapeHTML(lead.phone || "Keine Telefonnummer")}</small>
        </td>

        <td>${escapeHTML(interestLabels[lead.interest] || lead.interest)}</td>

        <td>${formatCurrency(lead.budget)}</td>

        <td>
          <select class="status-select status-${escapeHTML(lead.status)}" data-id="${lead.id}">
            ${getStatusOptions(lead.status)}
          </select>
        </td>

        <td>
          <span class="priority-badge priority-${escapeHTML(lead.priority)}">
            ${escapeHTML(priorityLabels[lead.priority] || lead.priority)}
          </span>
        </td>

        <td>
          <span class="score-badge">
            ${lead.score}/100
          </span>
          <br>
          <small>${getScoreLabel(lead.score)}</small>
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
        saveLeads();
        renderLeads();
      });
    });

    document.querySelectorAll(".status-select").forEach((select) => {
      select.addEventListener("change", () => {
        const id = Number(select.getAttribute("data-id"));
        const lead = leads.find((item) => item.id === id);

        if (!lead) return;

        lead.status = select.value;
        lead.score = calculateLeadScore(
          lead.budget,
          lead.priority,
          lead.interest,
          lead.status
        );

        saveLeads();
        renderLeads();
      });
    });

    updateDashboard();
    saveLeads();
  }

  function resetToDemoData() {
    leads = demoLeads.map(normalizeLead);
    saveLeads();
    renderLeads();
  }

  if (leadForm) {
    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("leadName")?.value.trim();
      const company = document.getElementById("companyName")?.value.trim();
      const email = document.getElementById("leadEmail")?.value.trim();
      const phone = document.getElementById("leadPhone")?.value.trim();
      const budget = Number(document.getElementById("budget")?.value);
      const interest = document.getElementById("interest")?.value;
      const priority = document.getElementById("priority")?.value;
      const status = document.getElementById("status")?.value;
      const notes = document.getElementById("notes")?.value.trim();

      if (!name || !company || !email || !budget || !interest || !priority || !status) {
        alert("Bitte füllen Sie alle Pflichtfelder aus.");
        return;
      }

      const newLead = normalizeLead({
        id: Date.now(),
        name,
        company,
        email,
        phone,
        budget,
        interest,
        priority,
        status,
        notes
      });

      leads.push(newLead);
      saveLeads();
      renderLeads();
      leadForm.reset();

      const tableSection = document.querySelector(".lead-table, .table-wrapper");

      if (tableSection) {
        tableSection.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    });
  }

  const resetButton = document.getElementById("resetDemoData");

  if (resetButton) {
    resetButton.addEventListener("click", resetToDemoData);
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
