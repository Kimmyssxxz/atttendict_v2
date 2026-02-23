<template>
  <div class="staff-layout">
    <header class="staff-header">
      <h1>Staff Dashboard</h1>
    </header>

    <main class="staff-main">
      <section class="card">
        <h2>Welcome, Staff</h2>
        <p>This is a placeholder staff dashboard. You can add staff-specific features here later.</p>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'StaffDashboardView',
};
</script>

<style scoped>
.staff-layout {
  min-height: 100vh;
  background: #f5f7fb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.staff-header {
  background: #111827;
  color: #fff;
  padding: 1rem 2rem;
}

.staff-main {
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem 2rem;
}

.card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  padding: 1.5rem;
}
</style>
