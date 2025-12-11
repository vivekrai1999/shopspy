import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps {
    options?: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    error?: string;
    required?: boolean;
    maxHeight?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'outline' | 'filled' | 'ghost';
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    showSelectedIndicator?: boolean;
    showItemCount?: boolean;
    emptyMessage?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    showCardBackground?: boolean;
    groupedOptions?: Record<string, SelectOption[]>;
    className?: string;
    containerClassName?: string;
}

const Select: React.FC<SelectProps> = ({
    options = [],
    groupedOptions,
    value,
    onChange,
    placeholder = 'Select...',
    disabled = false,
    label,
    error,
    required = false,
    maxHeight = '300px',
    size = 'md',
    variant = 'default',
    placement = 'bottom-start',
    showSelectedIndicator = true,
    showItemCount = true,
    emptyMessage = 'No options available',
    searchable = false,
    searchPlaceholder = 'Search...',
    showCardBackground = false,
    className,
    containerClassName,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dropdownContentRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Flatten grouped options if provided
    const allOptions = groupedOptions
        ? Object.values(groupedOptions).flat()
        : (options || []);

    const selectedOption = allOptions.find(option => option.value === value);

    // Filter options based on search term
    const filteredOptions = searchable
        ? allOptions.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : allOptions;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Focus search input when dropdown opens and searchable is true
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    // Scroll to selected option
    useEffect(() => {
        if (isOpen && dropdownContentRef.current && value) {
            const selectedElement = dropdownContentRef.current.querySelector(`[data-value="${value}"]`);
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    block: 'nearest',
                    behavior: 'auto'
                });
            }
        }
    }, [isOpen, value]);

    const handleOptionClick = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm('');
        } else if (event.key === 'ArrowDown' && isOpen) {
            event.preventDefault();
            const currentIndex = filteredOptions.findIndex(option => option.value === value);
            const nextIndex = (currentIndex + 1) % filteredOptions.length;
            if (filteredOptions[nextIndex] && !filteredOptions[nextIndex].disabled) {
                onChange(filteredOptions[nextIndex].value);
            }
        } else if (event.key === 'ArrowUp' && isOpen) {
            event.preventDefault();
            const currentIndex = filteredOptions.findIndex(option => option.value === value);
            const prevIndex = currentIndex <= 0 ? filteredOptions.length - 1 : currentIndex - 1;
            if (filteredOptions[prevIndex] && !filteredOptions[prevIndex].disabled) {
                onChange(filteredOptions[prevIndex].value);
            }
        } else if (event.key === 'Enter' && !isOpen) {
            event.preventDefault();
            setIsOpen(true);
        }
    };

    // Size classes
    const sizeClasses = {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-3 py-2 text-sm',
        lg: 'px-4 py-2.5 text-base',
    };

    // Variant classes - adapted for dark mode
    const variantClasses = {
        default: 'border border-white/10 bg-gray-900/50 hover:border-white/20 focus:border-blue-500 shadow-sm',
        outline: 'border-2 border-white/10 bg-transparent hover:border-white/20 focus:border-blue-500',
        filled: 'border border-white/10 bg-gray-800/50 hover:bg-gray-800 focus:border-blue-500',
        ghost: 'border border-transparent bg-transparent hover:bg-gray-800/50 focus:border-white/10',
    };

    // Placement classes for dropdown
    const placementClasses = {
        'bottom-start': 'top-full left-0 mt-1',
        'bottom-end': 'top-full right-0 mt-1',
        'top-start': 'bottom-full left-0 mb-1',
        'top-end': 'bottom-full right-0 mb-1',
    };

    // Base container classes
    const baseContainerClasses = showCardBackground
        ? 'mb-4 rounded-lg p-2 shadow-sm bg-white'
        : containerClassName || '';

    // Render grouped options if provided
    const renderOptions = () => {
        if (groupedOptions) {
            return Object.entries(groupedOptions).map(([groupLabel, groupOptions]) => {
                const filteredGroupOptions = searchable
                    ? groupOptions.filter(option =>
                        option.label.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    : groupOptions;

                if (filteredGroupOptions.length === 0) return null;

                return (
                    <div key={groupLabel}>
                        <div className="px-3 py-1.5 text-xs font-semibold text-white/60 uppercase tracking-wider bg-gray-800/50 sticky top-0">
                            {groupLabel}
                        </div>
                        {filteredGroupOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                data-value={option.value}
                                disabled={option.disabled}
                                className={`
                                    w-full px-3 py-2 text-left text-sm
                                    transition-colors duration-150 flex items-center justify-between
                                    ${option.value === value
                                        ? 'bg-blue-500/20 text-blue-400 font-medium'
                                        : 'text-white/90 hover:bg-gray-700/50'
                                    }
                                    ${option.disabled
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'cursor-pointer focus:outline-none focus:bg-gray-700/50'
                                    }
                                `}
                                onClick={() => !option.disabled && handleOptionClick(option.value)}
                            >
                                <span className="truncate flex-1">{option.label}</span>
                                {option.value === value && showSelectedIndicator && (
                                    <Check className="h-4 w-4 text-blue-400 ml-2 flex-shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                );
            });
        }

        return filteredOptions.map((option) => (
            <button
                key={option.value}
                type="button"
                data-value={option.value}
                disabled={option.disabled}
                className={`
                    w-full px-3 py-2 text-left text-sm
                    transition-colors duration-150 flex items-center justify-between
                    ${option.value === value
                        ? 'bg-blue-500/20 text-blue-400 font-medium'
                        : 'text-white/90 hover:bg-gray-700/50'
                    }
                    ${option.disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer focus:outline-none focus:bg-gray-700/50'
                    }
                `}
                onClick={() => !option.disabled && handleOptionClick(option.value)}
            >
                <span className="truncate flex-1">{option.label}</span>
                {option.value === value && showSelectedIndicator && (
                    <Check className="h-4 w-4 text-blue-400 ml-2 flex-shrink-0" />
                )}
            </button>
        ));
    };

    return (
        <div className={`relative ${baseContainerClasses}`} ref={dropdownRef}>
            {label && (
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    className={`
                        flex items-center justify-between w-full
                        ${sizeClasses[size]}
                        ${variantClasses[variant]}
                        rounded-lg font-medium text-white
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-gray-800
                        transition-all duration-200
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                        ${className || ''}
                    `}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    onKeyDown={handleKeyDown}
                >
                    <span className={`truncate ${selectedOption ? 'text-white' : 'text-white/60'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`ml-2 h-4 w-4 text-white/60 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </button>

                {error && (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                )}

                {isOpen && (
                    <div
                        className={`
                            absolute z-[9999] bg-gray-800 rounded-lg shadow-xl border border-white/10 min-w-full
                            ${placementClasses[placement]}
                        `}
                        style={{ maxWidth: '100%', width: 'max-content', minWidth: '100%' }}
                    >
                        {searchable && (
                            <div className="p-2 border-b border-white/10">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full px-3 py-1.5 text-sm border border-white/10 rounded-md bg-gray-900/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}

                        <div
                            ref={dropdownContentRef}
                            className="py-1 overflow-y-auto"
                            style={{ maxHeight }}
                        >
                            {filteredOptions.length === 0 && (!groupedOptions || Object.values(groupedOptions).flat().length === 0) ? (
                                <div className="px-3 py-2 text-sm text-white/60 text-center">
                                    {emptyMessage}
                                </div>
                            ) : (
                                renderOptions()
                            )}
                        </div>

                        {showItemCount && filteredOptions.length > 10 && (
                            <div className="px-3 py-2 border-t border-white/10 bg-gray-800/50">
                                <span className="text-xs text-white/60">
                                    {filteredOptions.length} {filteredOptions.length === 1 ? 'item' : 'items'}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Select;
