'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  description?: string;
}

export interface CustomSelectProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  label?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function CustomSelect<T extends string | number>({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  disabled = false,
  className = '',
  triggerClassName = '',
  menuClassName = '',
  label,
  icon,
  size = 'md',
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedOption = options.find(opt => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen && highlightedIndex >= 0 && highlightedIndex < options.length) {
        onChange(options[highlightedIndex].value);
        setIsOpen(false);
      } else {
        setIsOpen(prev => !prev);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        setHighlightedIndex(options.length - 1);
      } else {
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1));
      }
    }
  };

  // Scroll active option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && menuRef.current) {
      const activeElement = menuRef.current.children[highlightedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const sizeClasses = {
    sm: 'py-1.5 px-3 text-xs',
    md: 'py-2 px-3.5 text-xs',
    lg: 'py-2.5 px-4 text-sm',
  };

  return (
    <div className={`relative ${className}`} ref={containerRef} onKeyDown={handleKeyDown}>
      {label && (
        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        className={`group flex w-full items-center justify-between rounded-xl border border-border bg-card text-foreground transition-all duration-200 focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20 hover:border-foreground/30 ${
          sizeClasses[size]
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${triggerClassName}`}
      >
        <span className="flex items-center gap-2 truncate pr-2">
          {selectedOption?.icon || icon ? (
            <span className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground">
              {selectedOption?.icon || icon}
            </span>
          ) : null}
          <span className={`truncate font-medium ${!selectedOption ? 'text-muted-foreground' : 'text-foreground'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        <span className="flex items-center gap-1.5 shrink-0 pl-1">
          {selectedOption?.badge && (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
              {selectedOption.badge}
            </span>
          )}
          <ChevronDown
            className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover:text-foreground ${
              isOpen ? 'rotate-180 text-foreground' : ''
            }`}
          />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          ref={menuRef}
          className={`absolute left-0 right-0 z-50 mt-1.5 max-h-64 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 ${menuClassName}`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = highlightedIndex === index;

            return (
              <div
                key={String(option.value)}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors duration-150 ${
                  isSelected
                    ? 'bg-muted text-foreground font-semibold'
                    : isHighlighted
                    ? 'bg-muted/60 text-foreground'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  {option.icon && (
                    <span className="shrink-0 text-muted-foreground">
                      {option.icon}
                    </span>
                  )}
                  <div className="truncate">
                    <div className="truncate">{option.label}</div>
                    {option.description && (
                      <div className="text-[10px] text-muted-foreground font-normal truncate mt-0.5">
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  {option.badge && (
                    <span className="rounded bg-background border border-border px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground uppercase">
                      {option.badge}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
