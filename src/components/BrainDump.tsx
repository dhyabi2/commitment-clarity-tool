import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Tag as TagIcon } from "lucide-react";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { BrainDumpForm } from './brain-dump/BrainDumpForm';
import { useBrainDumpMutation } from './brain-dump/useBrainDumpMutation';

const BrainDump = () => {
  const { t, dir } = useLanguage();
  const [thought, setThought] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const { addThoughtMutation } = useBrainDumpMutation({
    onSuccess: () => {
      setThought("");
      setTags([]);
      setTagInput("");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (thought.trim()) {
      addThoughtMutation.mutate({ content: thought, tags });
    }
  };

  return (
    <div className="animate-fade-in p-4 sm:p-0" dir={dir()}>
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
        {t('brainDump.title')}
      </h2>
      <p className="text-gray-600 text-sm sm:text-base mb-4">
        {t('brainDump.description')}
      </p>
      <BrainDumpForm
        thought={thought}
        setThought={setThought}
        tags={tags}
        setTags={setTags}
        tagInput={tagInput}
        setTagInput={setTagInput}
        onSubmit={handleSubmit}
        isPending={addThoughtMutation.isPending}
      />
    </div>
  );
};

export default BrainDump;