<template>
  <div class="admin-layout">
    <header class="admin-header">
      <h1>Admin Dashboard</h1>"
    </header>

    <main class="admin-main">
      <!-- Summary Cards -->
      <section class="summary-section">
        <h2 class="section-title">Summary</h2>
        <p class="section-subtitle">Snapshot for today (dummy data only for now).</p>
        <div class="summary-grid">
          <div class="summary-card">
            <h3>Total Staff</h3>
            <p class="summary-value">12</p>
            <p class="summary-note">+2 new this month</p>
          </div>
          <div class="summary-card">
            <h3>Total Student Interns</h3>
            <p class="summary-value">45</p>
            <p class="summary-note">38 active, 7 completed</p>
          </div>
          <div class="summary-card">
            <h3>Total Clients Today</h3>
            <p class="summary-value">18</p>
            <p class="summary-note">Peak: 10:00 AM</p>
          </div>
          <div class="summary-card">
            <h3>Total Time-ins Today</h3>
            <p class="summary-value">39</p>
            <p class="summary-note">92% on-time</p>
          </div>
          <div class="summary-card">
            <h3>Total Time-outs Today</h3>
            <p class="summary-value">21</p>
            <p class="summary-note">Last: 3:25 PM</p>
          </div>
          <div class="summary-card optional">
            <h3>Late Count</h3>
            <p class="summary-value late">6</p>
            <p class="summary-note">Mostly 9:00–9:15 AM</p>
          </div>
          <div class="summary-card highlight">
            <h3>Active Users (Timed-in)</h3>
            <p class="summary-value">18</p>
            <p class="summary-note">12 interns · 6 staff</p>
          </div>
        </div>
      </section>

      <!-- Charts Section -->
      <section class="charts-section">
        <h2 class="section-title">Attendance & Clients Overview</h2>
        <p class="section-subtitle">Illustrative trends only (sample data).</p>
        <div class="charts-grid">
          <div class="chart-card">
            <h3>Daily Attendance Chart</h3>
            <div class="chart-placeholder">
              <ul class="chart-legend">
                <li><span class="dot present"></span>Present: 39</li>
                <li><span class="dot absent"></span>Absent: 4</li>
                <li><span class="dot late"></span>Late: 6</li>
              </ul>
              <svg class="chart-svg" viewBox="0 0 100 60" preserveAspectRatio="none">
                <rect class="bar-svg present" x="10" y="20" width="18" height="35" rx="3" />
                <rect class="bar-svg absent" x="41" y="40" width="18" height="15" rx="3" />
                <rect class="bar-svg late" x="72" y="30" width="18" height="25" rx="3" />
              </svg>
            </div>
          </div>
          <div class="chart-card">
            <h3>Weekly Attendance Trend</h3>
            <div class="chart-placeholder">
              <svg class="chart-svg" viewBox="0 0 100 60" preserveAspectRatio="none">
                <polyline
                  class="line-path"
                  points="5,40 25,22 45,18 65,24 85,28"
                />
                <circle class="line-dot" cx="5" cy="40" r="1.8" />
                <circle class="line-dot" cx="25" cy="22" r="1.8" />
                <circle class="line-dot" cx="45" cy="18" r="1.8" />
                <circle class="line-dot" cx="65" cy="24" r="1.8" />
                <circle class="line-dot" cx="85" cy="28" r="1.8" />
                <text x="5" y="55" class="axis-label">Mon</text>
                <text x="25" y="55" class="axis-label">Tue</text>
                <text x="45" y="55" class="axis-label">Wed</text>
                <text x="65" y="55" class="axis-label">Thu</text>
                <text x="85" y="55" class="axis-label">Fri</text>
              </svg>
              <p class="chart-text">Average attendance: 92%</p>
            </div>
          </div>
          <div class="chart-card">
            <h3>Client Visits Graph</h3>
            <div class="chart-placeholder">
              <p class="chart-text">Sample visits per day:</p>
              <svg class="chart-svg" viewBox="0 0 100 60" preserveAspectRatio="none">
                <rect class="bar-svg" x="8" y="32" width="10" height="22" rx="3" />
                <rect class="bar-svg" x="26" y="24" width="10" height="30" rx="3" />
                <rect class="bar-svg" x="44" y="26" width="10" height="28" rx="3" />
                <rect class="bar-svg" x="62" y="18" width="10" height="36" rx="3" />
                <rect class="bar-svg" x="80" y="34" width="10" height="20" rx="3" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboardView'
};
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f5f7fb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.admin-header {
  background: #0f172a;
  color: #fff;
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.admin-main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: #0f172a;
}

.section-subtitle {
  margin: -0.25rem 0 1.25rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.summary-section,
.charts-section {
  background: transparent;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
}

.summary-card {
  background: #ffffff;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  border: 1px solid #e5e7eb;
}

.summary-card h3 {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  color: #4b5563;
}

.summary-value {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #111827;
}

.summary-value.late {
  color: #b91c1c;
}

.summary-note {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: #6b7280;
}

.summary-card.highlight {
  background: #ecfdf5;
  border-color: #6ee7b7;
}

.summary-card.optional {
  opacity: 0.9;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: #ffffff;
  border-radius: 1rem;
  padding: 1rem 1.25rem 1.25rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  border: 1px solid #e5e7eb;
}

.chart-card h3 {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  color: #4b5563;
}

.chart-placeholder {
  height: 200px;
  border-radius: 0.75rem;
  border: 2px dashed #d1d5db;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #4b5563;
  font-size: 0.85rem;
  background: #f9fafb;
}

.chart-svg {
  width: 100%;
  height: 120px;
}

.chart-legend {
  list-style: none;
  padding: 0;
  margin: 0 0 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}

.chart-legend li {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
}

.dot.present {
  background: #22c55e;
}

.dot.absent {
  background: #6b7280;
}

.dot.late {
  background: #f97316;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.chart-bars.small {
  gap: 0.3rem;
}

.bar {
  flex: 1;
  border-radius: 999px 999px 0 0;
  background: #60a5fa;
}

.bar.present {
  background: #22c55e;
}

.bar.absent {
  background: #9ca3af;
}

.bar.late {
  background: #f97316;
}

.chart-text {
  margin: 0 0 0.5rem;
}

.chart-list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.85rem;
}

.bar-svg {
  fill: #60a5fa;
}

.bar-svg.present {
  fill: #22c55e;
}

.bar-svg.absent {
  fill: #9ca3af;
}

.bar-svg.late {
  fill: #f97316;
}

.line-path {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 1.6;
}

.line-dot {
  fill: #3b82f6;
}

.axis-label {
  font-size: 4px;
  fill: #6b7280;
}

@media (max-width: 700px) {
  .admin-header {
    padding: 1rem 1.25rem;
  }

  .admin-main {
    margin-top: 1.5rem;
  }
}
</style>
