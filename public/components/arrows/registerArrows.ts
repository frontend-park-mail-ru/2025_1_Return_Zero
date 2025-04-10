import './arrows';

// export function registerArrows(root: HTMLElement) {
//     const sections = root.querySelectorAll('.section');
    
//     for (const section of sections) {
//         section.addEventListener('mouseenter', (e: Event) => {
//             const target = e.currentTarget as HTMLElement;

//             const arrows = Array.from(target.querySelectorAll('#arrow'));
//             if (arrows.length > 0) {
//                 return;
//             }

//             const arrow = document.createElement('div');
//             arrow.id = 'arrow';
//             arrow.classList.add('arrow');
//             target.insertBefore(arrow, target.firstChild);
//         });

//         section.addEventListener('mouseleave', (e: Event) => {
//             const target = e.currentTarget as HTMLElement;
//             const arrows = target.querySelectorAll('#arrow');
//             for (const arrow of arrows) {
//                 target.removeChild(arrow);
//             }
//         });
//     }
// }