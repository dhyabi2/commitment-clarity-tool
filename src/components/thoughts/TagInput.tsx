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
  existingTags = [] // Default to empty array
}: TagInputProps) => {
  const [tagInput, setTagInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset filtered tags when existingTags changes
  useEffect(() => {
    if (!Array.isArray(existingTags)) {
      setFilteredTags([]);
      return;
    }
  }, [existingTags]);

  // Filter tags based on input
  useEffect(() => {
    // Reset if no input or invalid existingTags
    if (!tagInput.trim() || !Array.isArray(existingTags)) {
      setShowSuggestions(false);
      setFilteredTags([]);
      return;
    }

    // Filter valid tags
    const validTags = existingTags.filter(tag => tag && typeof tag === 'string');
    const filtered = validTags.filter(tag => 
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      tag.toLowerCase() !== tagInput.toLowerCase()
    );
    
    setFilteredTags(filtered);
    setShowSuggestions(filtered.length > 0);
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
    if (tag && typeof tag === 'string') {
      onTagAdd(tag.trim());
      setTagInput("");
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const handleBlur = () => {
    // Use setTimeout to allow click events on suggestions to fire before hiding
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleFocus = () => {
    if (tagInput.trim() && Array.isArray(existingTags) && existingTags.length > 0) {
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
      {showSuggestions && Array.isArray(filteredTags) && filteredTags.length > 0 && (
        <div className="absolute z-50 w-full mt-1">
          <Command className="border rounded-lg shadow-md bg-white">
            <CommandGroup>
              {filteredTags.map((tag, index) => (
                tag && (
                  <CommandItem
                    key={`${tag}-${index}`}
                    onSelect={() => handleSuggestionClick(tag)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100",
                    )}
                  >
                    <TagIcon className="h-3 w-3" />
                    {tag}
                  </CommandItem>
                )
              ))}
            </CommandGroup>
          </Command>
        </div>
      )}
    </div>
  );
};