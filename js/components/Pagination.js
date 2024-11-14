class Pagination {
    constructor(container, options = {}) {
        this.container = container;
        this.currentPage = 1;
        this.totalPages = 1;
        this.itemsPerPage = options.itemsPerPage || 10;
        this.onPageChange = options.onPageChange;
        this.onItemsPerPageChange = options.onItemsPerPageChange;
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="pagination-container">
                <div class="pagination-controls">
                    <button class="page-btn" id="firstPage">
                        <i class="fas fa-angle-double-left"></i>
                    </button>
                    <button class="page-btn" id="prevPage">
                        <i class="fas fa-angle-left"></i>
                    </button>
                    <div class="page-input-container">
                        <input type="number" id="pageInput" value="${this.currentPage}" min="1" max="${this.totalPages}">
                        <span>de ${this.totalPages}</span>
                    </div>
                    <button class="page-btn" id="nextPage">
                        <i class="fas fa-angle-right"></i>
                    </button>
                    <button class="page-btn" id="lastPage">
                        <i class="fas fa-angle-double-right"></i>
                    </button>
                </div>
                <div class="items-per-page">
                    <label for="itemsPerPage">Items por página:</label>
                    <select id="itemsPerPage">
                        <option value="10" selected>10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const firstPageBtn = this.container.querySelector('#firstPage');
        const prevPageBtn = this.container.querySelector('#prevPage');
        const nextPageBtn = this.container.querySelector('#nextPage');
        const lastPageBtn = this.container.querySelector('#lastPage');
        const pageInput = this.container.querySelector('#pageInput');
        const itemsPerPageSelect = this.container.querySelector('#itemsPerPage');

        firstPageBtn.addEventListener('click', () => this.goToPage(1));
        prevPageBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        nextPageBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        lastPageBtn.addEventListener('click', () => this.goToPage(this.totalPages));

        pageInput.addEventListener('change', (e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= this.totalPages) {
                this.goToPage(page);
            } else {
                e.target.value = this.currentPage;
            }
        });

        itemsPerPageSelect.addEventListener('change', (e) => {
            const newItemsPerPage = parseInt(e.target.value);
            this.itemsPerPage = newItemsPerPage;
            if (this.onItemsPerPageChange) {
                this.onItemsPerPageChange(newItemsPerPage);
            }
        });
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.currentPage = page;
            if (this.onPageChange) {
                this.onPageChange(page);
            }
            this.update();
        }
    }

    update(totalItems) {
        if (totalItems !== undefined) {
            this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
        }
        
        const pageInput = this.container.querySelector('#pageInput');
        if (pageInput) {
            pageInput.value = this.currentPage;
            pageInput.max = this.totalPages;
        }

        const totalPagesSpan = this.container.querySelector('.page-input-container span');
        if (totalPagesSpan) {
            totalPagesSpan.textContent = `de ${this.totalPages}`;
        }

        // Actualizar estado de los botones
        const firstPageBtn = this.container.querySelector('#firstPage');
        const prevPageBtn = this.container.querySelector('#prevPage');
        const nextPageBtn = this.container.querySelector('#nextPage');
        const lastPageBtn = this.container.querySelector('#lastPage');

        firstPageBtn.disabled = this.currentPage === 1;
        prevPageBtn.disabled = this.currentPage === 1;
        nextPageBtn.disabled = this.currentPage === this.totalPages;
        lastPageBtn.disabled = this.currentPage === this.totalPages;
    }
} 