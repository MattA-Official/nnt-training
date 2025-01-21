<template>
    <!-- TODO: Remove sitemap: for testing only -->

    <footer class="footer">
        <div class="footer__sitemap">
            <div class="footer__section">
                <h3>Training</h3>
                <NuxtLink to="/profile/progress">My Progress</NuxtLink>
                <NuxtLink to="/training/sessions">Sessions</NuxtLink>
                <NuxtLink to="/training/sessions/calendar">Calendar</NuxtLink>
            </div>

            <div class="footer__section">
                <h3>Training</h3>
                <NuxtLink to="/training/departments">All Departments</NuxtLink>
                <NuxtLink to="/training/categories">All Categories</NuxtLink>
                <NuxtLink to="/training/modules">All Modules</NuxtLink>
            </div>

            <div class="footer__section">
                <h3>Admin</h3>
                <NuxtLink to="/admin">Dashboard</NuxtLink>
                <NuxtLink to="/admin/users">Users</NuxtLink>
                <NuxtLink to="/admin/reports">Reports</NuxtLink>
            </div>
        </div>

        <p class="footer__copyright">&copy;2025 Nottingham New Theatre</p>
    </footer>
</template>

<style scoped>
.footer {
    padding: 2rem;
    background: var(--color-gray-100);
    border-top: 1px solid var(--color-gray-200);
}

.footer__sitemap {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer__section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.footer__section h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.footer__section a {
    color: var(--color-gray-600);
    text-decoration: none;
}

.footer__section a:hover {
    color: var(--color-primary-600);
}

.footer__copyright {
    text-align: center;
    color: var(--color-gray-500);
    font-size: 0.875rem;
}
</style>