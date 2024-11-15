import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tag as TagIcon } from 'lucide-react';
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface TagManagerProps {
  allTags: string[];
  selectedTag: string | null;
  onTagClick: (tag: string | null) => void;
}

export const TagManager = ({ allTags, selectedTag, onTagClick }: TagManagerProps) => {
  const { t } = useLanguage();
  
  if (allTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Badge
        variant={selectedTag === null ? "secondary" : "outline"}
        className="cursor-pointer"
        onClick={() => onTagClick(null)}
      >
        {t('thoughts.allTags')}
      </Badge>
      {allTags.map(tag => (
        <Badge
          key={tag}
          variant={selectedTag === tag ? "secondary" : "outline"}
          className="cursor-pointer"
          onClick={() => onTagClick(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export const TagInput = ({ 
  onTagAdd, 
  placeholder = "Add a tag and press Enter"
}: { 
  onTagAdd: (tag: string) => void;
  placeholder?: string;
}) => {
  const [tagInput, setTagInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      onTagAdd(tagInput.trim());
      setTagInput("");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <TagIcon className="h-4 w-4 text-gray-500" />
      <Input
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1"
      />
    </div>
  );
};