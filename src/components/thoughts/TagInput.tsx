import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Tag as TagIcon } from 'lucide-react';
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only filter and show suggestions if we have a non-empty input and existing tags
    if (tagInput.trim() && Array.isArray(existingTags) && existingTags.length > 0) {
      const filtered = existingTags.filter(tag => 
        tag.toLowerCase().includes(tagInput.toLowerCase()) &&
        tag.toLowerCase() !== tagInput.toLowerCase()
      );
      setFilteredTags(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredTags([]);
    }
  }, [tagInput, existingTags]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      onTagAdd(tagInput.trim());
      setTagInput("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (tag: string) => {
    onTagAdd(tag);
    setTagInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
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
          onFocus={() => tagInput.trim() && Array.isArray(existingTags) && existingTags.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="flex-1"
        />
      </div>
      {showSuggestions && filteredTags.length > 0 && (
        <Command className="absolute z-50 w-full mt-1 border rounded-lg shadow-md bg-white">
          <CommandGroup>
            {filteredTags.map(tag => (
              <CommandItem
                key={tag}
                onSelect={() => handleSuggestionClick(tag)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100",
                )}
              >
                <TagIcon className="h-3 w-3" />
                {tag}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      )}
    </div>
  );
};