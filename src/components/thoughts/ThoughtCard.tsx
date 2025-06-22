
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, Tag as TagIcon } from 'lucide-react';
import { TagInput } from './TagInput';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useToast } from "@/components/ui/use-toast";

interface Tag {
  id: number;
  name: string;
}

interface ThoughtCardProps {
  thought: {
    id: number;
    content: string;
    completed: boolean;
    created_at: string;
    tags?: Tag[];
  };
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
  onAddTag: (thoughtId: number, tag: string) => void;
  existingTags?: string[];
}

const ThoughtCard = ({ 
  thought, 
  onDelete, 
  onToggleComplete, 
  onAddTag,
  existingTags = [] 
}: ThoughtCardProps) => {
  const navigate = useNavigate();
  const [showTagInput, setShowTagInput] = useState(false);
  const { t, dir } = useLanguage();
  const { toast } = useToast();
  const isRTL = dir() === 'rtl';

  const handleTagClick = () => {
    setShowTagInput(!showTagInput);
    if (!showTagInput) {
      toast({
        title: t('thoughts.addTagPrompt') || 'Add a tag',
        duration: 2000,
      });
    }
  };

  const validExistingTags = Array.isArray(existingTags) 
    ? existingTags.filter((tag): tag is string => typeof tag === 'string')
    : [];

  return (
    <Card className="group hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm" dir={dir()}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onToggleComplete(thought.id, !thought.completed)}
          >
            <CheckCircle className={`h-5 w-5 ${thought.completed ? 'text-green-500' : 'text-gray-300'}`} />
          </Button>
          <time className="text-sm text-sage-500 whitespace-nowrap" dir="ltr">
            {format(new Date(thought.created_at), 'MMM d, yyyy h:mm a')}
          </time>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
            onClick={handleTagClick}
          >
            <TagIcon className="h-4 w-4 hover:text-sage-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-600 h-8 w-8 p-0"
            onClick={() => onDelete(thought.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <p className={`text-gray-800 ${isRTL ? 'text-right' : 'text-left'} ${thought.completed ? 'line-through text-gray-500' : ''}`}>
          {thought.content}
        </p>
        {!thought.completed && (
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-sage-50 hover:bg-sage-100 border-sage-200 text-sage-700"
            onClick={() => navigate('/commitment-clarifier', { state: { thought: thought.content } })}
          >
            Convert to commitment
          </Button>
        )}
        {showTagInput && (
          <div className="mt-2">
            <TagInput 
              onTagAdd={(tag) => {
                onAddTag(thought.id, tag);
                toast({
                  title: t('thoughts.tagAdded') || 'Tag added successfully',
                  duration: 2000,
                });
              }}
              existingTags={validExistingTags}
              placeholder={t('thoughts.addTag')}
            />
          </div>
        )}
        {thought.tags && thought.tags.length > 0 && (
          <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
            {thought.tags.map(tag => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThoughtCard;
