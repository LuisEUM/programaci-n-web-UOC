class Card {
    static createBasicCard(data, options = {}) {
        // console.log('Creating card for:', data); // Log de depuración
        const card = document.createElement('div');
        card.className = `card ${options.isSelected ? 'selected' : ''} ${options.extraClasses || ''}`;
        if (data.id) card.setAttribute('data-id', data.id);

        // ID Badge
        if (options.showId) {
            card.appendChild(this.createIdBadge(data.id));
        }

        // Checkbox
        if (options.selectable) {
            card.appendChild(this.createCheckbox(options.isSelected, options.onSelect));
        }

        // Image
        card.appendChild(this.createImage(data.thumbnail, data.title || data.name));

        // Info Container
        const infoContainer = this.createInfoContainer(data, options);
        card.appendChild(infoContainer);

        return card;
    }

    static createIdBadge(id) {
        const badge = document.createElement('div');
        badge.className = 'card-id';
        badge.textContent = `ID: ${id}`;
        return badge;
    }

    static createCheckbox(isChecked, onChange) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'card-checkbox';
        checkbox.checked = isChecked;
        if (onChange) checkbox.addEventListener('change', onChange);
        return checkbox;
    }

    static createImage(thumbnail, alt) {
        const img = document.createElement('img');
        img.src = `${thumbnail.path}/portrait_xlarge.${thumbnail.extension}`;
        img.alt = alt;
        img.className = 'card-image';
        img.loading = 'lazy';
        img.onerror = () => {
            img.src = 'https://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available/portrait_xlarge.jpg';
        };
        return img;
    }

    static createInfoContainer(data, options) {
        const info = document.createElement('div');
        info.className = 'card-info';

        // Title
        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = data.title || data.name;
        info.appendChild(title);

        // Description
        if (data.description) {
            const description = document.createElement('p');
            description.className = 'card-description';
            description.textContent = Utils.truncateText(data.description, 150);
            info.appendChild(description);
        }

        // Metadata
        if (options.showMetadata) {
            info.appendChild(this.createMetadata(data));
        }

        // Lists (creators, characters, comics, etc.)
        this.appendLists(info, data);

        // Action Buttons
        if (options.actions) {
            options.actions.forEach(action => {
                info.appendChild(this.createActionButton(action));
            });
        }

        return info;
    }

    static createMetadata(data) {
        // console.log('Creating metadata for:', data); // Debug log
        
        const metadata = document.createElement('div');
        metadata.className = 'card-metadata';
        
        const metadataItems = [];
        if (data.issueNumber !== undefined) metadataItems.push(`Issue #${data.issueNumber}`);
        if (data.price !== undefined && data.price !== null) metadataItems.push(`$${Number(data.price).toFixed(2)}`);
        if (data.pageCount) metadataItems.push(`${data.pageCount} páginas`);

        metadata.innerHTML = metadataItems.map(item => `<span>${item}</span>`).join('');
        return metadata;
    }

    static appendLists(container, data) {
        // console.log('Appending lists for:', data); // Debug log
        
        const lists = [
            { key: 'creators', label: 'Creadores' },
            { key: 'characters', label: 'Personajes' },
            { key: 'comics', label: 'Comics' },
            { key: 'series', label: 'Series' }
        ];

        lists.forEach(({ key, label }) => {
            if (Array.isArray(data[key]) && data[key].length > 0) {
                const element = document.createElement('div');
                element.className = `card-${key}`;
                element.innerHTML = `<strong>${label}:</strong> ${data[key].slice(0, 3).join(', ')}${data[key].length > 3 ? '...' : ''}`;
                container.appendChild(element);
            }
        });
    }

    static createActionButton(action) {
        const button = document.createElement('button');
        button.className = action.className;
        button.innerHTML = action.icon ? `<i class="${action.icon}"></i> ${action.text}` : action.text;
        if (action.onClick) button.addEventListener('click', action.onClick);
        if (action.disabled) button.disabled = action.disabled;
        return button;
    }
} 