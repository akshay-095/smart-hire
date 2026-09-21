document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const jobCards = document.querySelectorAll('.job-card');
    const noResults = document.getElementById('noResults');

    if (searchInput && typeFilter) {
        const filterJobs = () => {
            const query = searchInput.value.toLowerCase().trim();
            const selectedType = typeFilter.value;
            let visibleCount = 0;

            jobCards.forEach(card => {
                const title = card.getAttribute('data-title') || '';
                const company = card.getAttribute('data-company') || '';
                const location = card.getAttribute('data-location') || '';
                const type = card.getAttribute('data-type') || '';

                // Search matches if query appears in Title, Company, OR Location
                const matchesQuery = title.includes(query) || company.includes(query) || location.includes(query);
                const matchesType = selectedType === 'All' || type === selectedType;

                if (matchesQuery && matchesType) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // DOM Manipulation: Show "No Results" container if 0 cards match
            if (noResults) {
                if (visibleCount === 0) {
                    noResults.style.display = 'block';
                } else {
                    noResults.style.display = 'none';
                }
            }
        };

        // Attach Event Listeners
        searchInput.addEventListener('input', filterJobs);
        typeFilter.addEventListener('change', filterJobs);
    }
});