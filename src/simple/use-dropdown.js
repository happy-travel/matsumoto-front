import { useState, useEffect, useCallback } from "react";

export default function useDropdown(holderEl, dropdownEl) {
    holderEl = holderEl.current;
    dropdownEl = dropdownEl.current;

    const [isOpen, setIsOpen] = useState(null);

    const toggleCurrent = useCallback(toggleState => {
        setIsOpen(toggleState !== undefined ? Boolean(toggleState) : !isOpen);
    }, [isOpen]);

    const onWindowClick = useCallback(event => {
        const clickOnHolder =
            dropdownEl && (event.target === dropdownEl || dropdownEl.contains(event.target));
        const clickOnDropdown =
            holderEl && (event.target === holderEl || holderEl.contains(event.target));

        if (!clickOnHolder && !clickOnDropdown && isOpen === true) {
            setTimeout(() => {
                toggleCurrent(false);
            });
        }
    }, [isOpen]);

    const onEsc = useCallback(event => {
        if (event.key === "Escape" && isOpen === true) {
            toggleCurrent(false);
        }
    }, [isOpen]);

    useEffect(() => {
        window.addEventListener("click", onWindowClick);
        return () => window.removeEventListener("click", onWindowClick);
    });

    useEffect(() => {
        window.addEventListener("keyup", onEsc);
        return () => window.removeEventListener("keyup", onEsc);
    });

    return [isOpen, toggleCurrent];
}
