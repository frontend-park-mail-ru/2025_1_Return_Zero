import './header.precompiled.js';

export function renderHeader(navItems) {
    const template = Handlebars.templates['header.hbs'];

    const content = {
        navItems,
    };

    return template(content, content);
}

window.onload = function () {
    setTimeout(() => {
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
            }
            else {
                removeGrid();
                isGrid = false;
            }
        }

        function createGrid() {
            const grid = document.getElementById('dropdown-menu');
            grid.classList.remove('hide');
            grid.classList.add('show');
            grid.style.gap = '1.5rem';

            switch (navList.children.length - 1) {
                case 0:
                    grid.style.gridTemplateColumns = 'repeat(1, 10rem)';
                    grid.style.gridTemplateRows = 'repeat(3, 2rem)'; 
                    break;
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
            grid.classList.remove('show');
            grid.classList.add('hide');
        }

        setTimeout(() => {
            window.addEventListener("resize", updateNavItems); 
        }, 0);

        updateNavItems();
    }, 0);
};





