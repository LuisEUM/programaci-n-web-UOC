class Tabs {
    constructor(tabsContainer, onTabChange) {
        this.tabsContainer = tabsContainer;
        this.onTabChange = onTabChange;
        this.init();
    }

    init() {
        this.tabsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.handleTabChange(e.target);
            }
        });
    }

    handleTabChange(selectedTab) {
        const tabs = this.tabsContainer.querySelectorAll('.tab-btn');
        tabs.forEach(tab => tab.classList.remove('active'));
        selectedTab.classList.add('active');

        const tabName = selectedTab.dataset.tab;
        this.onTabChange(tabName);
    }

    setActiveTab(tabName) {
        const tabs = this.tabsContainer.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
} 