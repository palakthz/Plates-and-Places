document.addEventListener('DOMContentLoaded', () => {
    const filterLinks = document.querySelectorAll('.dropdown-item');
    const storyCards = document.querySelectorAll('.story-card'); // fixed selector

    filterLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Active styling
            filterLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const selectedCategory = this.dataset.category;
            console.log("Selected:", selectedCategory);

            storyCards.forEach(card => {
                const cardCategory = card.dataset.category;
                card.classList.toggle('d-none', !(selectedCategory === 'All' || selectedCategory === cardCategory));
            });
        });
    });
});


filterLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // remove active class from all
        filterLinks.forEach(l => l.classList.remove('active'));
        // add active to the one clicked
        this.classList.add('active');

        const selectedCategory = this.dataset.category;
        console.log("Selected:", selectedCategory);

        storyCards.forEach(card => {
            const cardCategory = card.dataset.category;
            card.classList.toggle('d-none', !(selectedCategory === 'All' || selectedCategory === cardCategory));
        });
    });
});


