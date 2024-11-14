class CollectionModal {
    constructor() {
        this.modal = document.getElementById("collectionModal");
        this.closeModalBtn = document.getElementById("closeModal");
        this.collectionButtons = document.querySelectorAll(".collection-btn");
        this.init();
    }

    init() {
        this.closeModalBtn.addEventListener("click", () => this.close());
        this.collectionButtons.forEach((button) => {
            button.addEventListener("click", (e) => this.handleCollectionSelection(e));
        });
    }

    open() {
        this.modal.style.display = "block";
    }

    close() {
        this.modal.style.display = "none";
    }

    handleCollectionSelection(e) {
        const collection = e.target.dataset.collection;
        const dataSource = Config.USE_MOCK_DATA ? "mock" : "api";

        console.log(`Selected collection: ${collection}`);
        UI.handleCollectionSelection(collection);
        this.close();
    }
} 