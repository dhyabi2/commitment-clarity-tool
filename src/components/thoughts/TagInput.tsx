import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Tag as TagIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TagInputProps {
  onTagAdd: (tag: string) => void;
  placeholder?: string;
  existingTags?: string[];
}

export const TagInput = ({ 
  onTagAdd, 
  placeholder = "Add a tag and press Enter",
  existingTags = [] 
}: TagInputProps) => {
  const [tagInput, setTagInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Initialize and validate existingTags
  const validExistingTags = (existingTags || []).filter(tag => 
    typeof tag === 'string' && tag.trim().length > 0
  );

  // Filter tags based on input
  useEffect(() => {
    if (!tagInput.trim()) {
      setShowSuggestions(false);
      setFilteredTags([]);
      setSelectedIndex(-1);
      return;
    }

    const filtered = validExistingTags.filter(tag => 
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      tag.toLowerCase() !== tagInput.toLowerCase()
    );
    
    setFilteredTags(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [tagInput, validExistingTags]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredTags.length) {
        onTagAdd(filteredTags[selectedIndex]);
      } else if (tagInput.trim()) {
        onTagAdd(tagInput.trim());
      }
      setTagInput("");
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredTags.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (tag: string) => {
    if (tag.trim()) {
      onTagAdd(tag.trim());
      setTagInput("");
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.focus();
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
      setTimeout(() => {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }, 200);
    }
  };

  const handleFocus = () => {
    if (tagInput.trim() && filteredTags.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <TagIcon className="h-4 w-4 text-gray-500" />
        <Input
          ref={inputRef}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex-1"
        />
      </div>
      {showSuggestions && filteredTags.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="fixed w-[inherit] mt-1 bg-white border rounded-lg shadow-lg"
          style={{ 
            zIndex: 99999,
            position: 'absolute',
            width: '100%'
          }}
        >
          <div className="py-1">
            {filteredTags.map((tag, index) => (
              <button
                key={tag}
                onClick={() => handleSuggestionClick(tag)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm",
                  "hover:bg-gray-100 focus:bg-gray-100 outline-none",
                  "flex items-center gap-2",
                  index === selectedIndex && "bg-gray-100"
                )}
              >
                <TagIcon className="h-3 w-3" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};