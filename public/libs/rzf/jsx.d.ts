import { VNode, child } from './VDom';

declare global {
    namespace JSX {
        type Element = VNode;

        // Base props common to most elements
        interface BaseHTMLAttributes {
            key?: string | number | null;
            class?: string;
            className?: string;
            style?: Record<string, string | number>;
            id?: string;
            title?: string;
            lang?: string;
            tabIndex?: number;
            role?: string; // ARIA

            // Event Handlers
            onClick?: (event: MouseEvent) => void;
            onChange?: (event: Event) => void;
            onSubmit?: (event: Event) => void;
            onInput?: (event: InputEvent) => void;
            onFocus?: (event: FocusEvent) => void;
            onBlur?: (event: FocusEvent) => void;
            onKeyDown?: (event: KeyboardEvent) => void;
            onKeyUp?: (event: KeyboardEvent) => void;
            onKeyPress?: (event: KeyboardEvent) => void;
            onMouseDown?: (event: MouseEvent) => void;
            onMouseUp?: (event: MouseEvent) => void;
            onMouseEnter?: (event: MouseEvent) => void;
            onMouseLeave?: (event: MouseEvent) => void;
            onTouchStart?: (event: TouchEvent) => void;
            onTouchEnd?: (event: TouchEvent) => void;
            onTouchMove?: (event: TouchEvent) => void;

            // Data attributes
            [key: `data-${string}`]: any;

            // Allow any other string-based attribute as a fallback
            [key: string]: any;
        }

        interface IntrinsicElements {
            // Core Elements
            div: BaseHTMLAttributes;
            span: BaseHTMLAttributes;
            p: BaseHTMLAttributes;
            i: BaseHTMLAttributes;
            b: BaseHTMLAttributes;
            strong: BaseHTMLAttributes;
            em: BaseHTMLAttributes;
            small: BaseHTMLAttributes;
            sub: BaseHTMLAttributes;
            sup: BaseHTMLAttributes;
            br: BaseHTMLAttributes;
            hr: BaseHTMLAttributes;

            // Headings
            h1: BaseHTMLAttributes;
            h2: BaseHTMLAttributes;
            h3: BaseHTMLAttributes;
            h4: BaseHTMLAttributes;
            h5: BaseHTMLAttributes;
            h6: BaseHTMLAttributes;

            // Links and Media
            a: BaseHTMLAttributes & {
                href?: string;
                target?: string;
                rel?: string;
                download?: boolean | string;
            };
            img: BaseHTMLAttributes & {
                src?: string;
                alt?: string;
                width?: string | number;
                height?: string | number;
                loading?: 'eager' | 'lazy';
            };

            // Lists
            ul: BaseHTMLAttributes;
            ol: BaseHTMLAttributes & {
                start?: number;
                type?: '1' | 'a' | 'A' | 'i' | 'I';
                reversed?: boolean;
            };
            li: BaseHTMLAttributes & {
                value?: number;
            };

            // Forms
            form: BaseHTMLAttributes & {
                action?: string;
                method?: 'GET' | 'POST';
                encType?: string;
                target?: string;
                noValidate?: boolean;
            };
            input: BaseHTMLAttributes & {
                type?: string;
                value?: string | number | readonly string[];
                checked?: boolean;
                placeholder?: string;
                disabled?: boolean;
                name?: string;
                required?: boolean;
                readOnly?: boolean;
                min?: string | number;
                max?: string | number;
                step?: string | number;
                multiple?: boolean;
                pattern?: string;
                accept?: string;
            };
            button: BaseHTMLAttributes & {
                type?: 'button' | 'submit' | 'reset';
                disabled?: boolean;
                name?: string;
                value?: string;
            };
            label: BaseHTMLAttributes & {
                htmlFor?: string;
            };
            textarea: BaseHTMLAttributes & {
                value?: string | number | readonly string[];
                placeholder?: string;
                disabled?: boolean;
                name?: string;
                required?: boolean;
                readOnly?: boolean;
                rows?: number;
                cols?: number;
                wrap?: 'hard' | 'soft' | 'off';
            };
            select: BaseHTMLAttributes & {
                value?: string | number | readonly string[];
                disabled?: boolean;
                name?: string;
                required?: boolean;
                multiple?: boolean;
                size?: number;
            };
            option: BaseHTMLAttributes & {
                value?: string | number;
                disabled?: boolean;
                selected?: boolean;
                label?: string;
            };
            optgroup: BaseHTMLAttributes & {
                label?: string;
                disabled?: boolean;
            };
            fieldset: BaseHTMLAttributes & {
                disabled?: boolean;
                name?: string;
            };
            legend: BaseHTMLAttributes;

            // Tables
            table: BaseHTMLAttributes;
            caption: BaseHTMLAttributes;
            thead: BaseHTMLAttributes;
            tbody: BaseHTMLAttributes;
            tfoot: BaseHTMLAttributes;
            tr: BaseHTMLAttributes;
            th: BaseHTMLAttributes & {
                scope?: 'col' | 'row' | 'colgroup' | 'rowgroup';
                colSpan?: number;
                rowSpan?: number;
            };
            td: BaseHTMLAttributes & {
                colSpan?: number;
                rowSpan?: number;
            };
            colgroup: BaseHTMLAttributes;
            col: BaseHTMLAttributes & {
                span?: number;
            };

            // Semantic/Layout Elements
            header: BaseHTMLAttributes;
            footer: BaseHTMLAttributes;
            main: BaseHTMLAttributes;
            nav: BaseHTMLAttributes;
            section: BaseHTMLAttributes;
            article: BaseHTMLAttributes;
            aside: BaseHTMLAttributes;
            address: BaseHTMLAttributes;
            figure: BaseHTMLAttributes;
            figcaption: BaseHTMLAttributes;

            // Details & Dialog
            details: BaseHTMLAttributes & {
                open?: boolean;
            };
            summary: BaseHTMLAttributes;
            dialog: BaseHTMLAttributes & {
                open?: boolean;
            };

            // Other
            blockquote: BaseHTMLAttributes & {
                cite?: string;
            };
            pre: BaseHTMLAttributes;
            code: BaseHTMLAttributes;
            svg: BaseHTMLAttributes & {
                viewBox?: string;
                xmlns?: string;
            };
            path: BaseHTMLAttributes & {
                d?: string;
                fill?: string;
                stroke?: string;
            };
        }

        // --- Explicit Definitions for Component Props and Children ---

        /**
         * Defines the property name used for passing attributes to components.
         * TypeScript uses this to know where to type-check the props object.
         */
        interface ElementAttributesProperty {
             props: {}; // The name 'props' is conventional. Type {} is a placeholder.
        }

        /**
         * Defines the property name used for passing children to components.
         * TypeScript uses this to know where children are placed within the props object.
         */
        interface ElementChildrenAttribute {
             children: {}; // The name 'children' is conventional. Type {} is a placeholder.
        }

        // --- End Explicit Definitions ---
    }
}

export {};