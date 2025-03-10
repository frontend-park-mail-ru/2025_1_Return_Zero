import './header.precompiled.js';

/**
 * Renders the header using the provided navigation items.
 * 
 * @param {Array} navItems - An array of navigation items to be rendered in the header.
 * @returns {string} - The rendered HTML string for the header.
 */
export function renderHeader(navItems) {
    const template = Handlebars.templates['header.hbs'];

    const content = {
        navItems,
    };

    return template(content, content);
}

/**
 * Updates the header navigation items based on the current window width.
 * 
 * If the window width is less than or equal to 1700px, the navigation items
 * will be hidden and replaced with a "More" button. When the "More" button is
 * clicked, the hidden items will appear in a grid below the "More" button.
 * 
 * The grid will have a maximum of 3 columns and 3 rows, and the items will be
 * distributed evenly across the grid.
 * 
 * If the window width is greater than 1700px, the navigation items will be
 * shown in the top-level navigation bar.
 * 
 * This function is intended to be called when the page is first loaded, and
 * when the window is resized.
 */
export function updateHeader() {
    const navList = document.getElementById("header-list");
    let removedItems = [];
    let moreButton = null;
    let isExpanded = false;
    let isGrid = false;

    const bp = 1700;
    const step = 160;
    const breakpoints = [bp - step * 3, bp - step * 2, bp - step, bp];

    function updateNavItems() {
        isExpanded = false;
        isGrid = false;
    
        let currentWidth = window.innerWidth;
    
        for (let i = 0; i < breakpoints.length; ++i) {
            const bp = breakpoints[i];
            if (currentWidth <= bp) {
                removeItems(breakpoints.length - i);
                return;
            }
        }
    
        restoreAllItems();
    }

    function removeItems(count) {
        restoreAllItems();

        for (let _ = 0; _ < count; ++_) {
            if (navList.children.length > 0) {
                removedItems.push(navList.lastElementChild);
                navList.removeChild(navList.lastElementChild);
            }
        }

        addMoreButton();
    }

    function restoreAllItems() {
        while (removedItems.length > 0) {
            navList.appendChild(removedItems.pop());
        }

        removeMoreButton();
    }

    function addMoreButton() {
        if (!moreButton) {
            moreButton = document.createElement("button");
            moreButton.id = 'MoreButton';

            const img = document.createElement("img");
            img.id = 'MoreButtonImg';
            img.src = "/static/img/Down_Circle.svg";

            moreButton.appendChild(img);
            moreButton.onclick = toggleHiddenItems;
            navList.appendChild(moreButton);
        }
    }

    function removeMoreButton() {
        if (moreButton) {
            moreButton.remove();
            moreButton = null;
            isExpanded = false;
        }
    }

    function toggleHiddenItems() {
        const img = document.getElementById('MoreButtonImg');
        img.classList.toggle("rotated");

        if (!isGrid) {
            createGrid();
            isGrid = true;
        } else {
            removeGrid();
            isGrid = false;
        }
    }

    function createGrid() {
        const grid = document.getElementById('dropdown-menu');
        grid.classList.remove('hide-grid');
        grid.classList.add('show-grid');
        grid.style.gap = '1.5rem';

        switch (navList.children.length - 1) {
            case 0:
            case 1:
                grid.style.gridTemplateColumns = 'repeat(1, 10rem)';
                grid.style.gridTemplateRows = 'repeat(3, 2rem)';
                break;
            case 2:
                grid.style.gridTemplateColumns = 'repeat(2, 10rem)';
                grid.style.gridTemplateRows = 'repeat(2, 2rem)';
                break;
            case 3:
                grid.style.gridTemplateColumns = 'repeat(1, 10rem)';
                grid.style.gridTemplateRows = 'repeat(1, 2rem)';
                break;
        }

        for (const item of removedItems) {
            grid.appendChild(item);
        }
    }

    function removeGrid() {
        const grid = document.getElementById('dropdown-menu');
        grid.classList.remove('show-grid');
        grid.classList.add('hide-grid');
    }

    setTimeout(() => {
        if (!window.__resizeListenerAdded) {
            window.addEventListener("resize", updateNavItems);
            window.__resizeListenerAdded = true; 
        }
        updateNavItems();
    }, 0);
};

