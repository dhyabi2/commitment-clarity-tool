
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, Tag as TagIcon, ArrowRight, Circle } from 'lucide-react';
import { TagInput } from './TagInput';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useToast } from "@/components/ui/use-toast";
import { useAuthErrorHandler } from '@/hooks/useAuthErrorHandler';

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
  const { handleAuthError } = useAuthErrorHandler();
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

  const handleDelete = async (id: number) => {
    try {
      onDelete(id);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      onToggleComplete(id, completed);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAddTag = async (thoughtId: number, tag: string) => {
    try {
      onAddTag(thoughtId, tag);
      toast({
        title: t('thoughts.tagAdded') || 'Tag added successfully',
        duration: 2000,
      });
    } catch (error) {
      handleAuthError(error);
    }
  };

  const validExistingTags = Array.isArray(existingTags) 
    ? existingTags.filter((tag): tag is string => typeof tag === 'string')
    : [];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm border border-sage-100" dir={dir()}>
      <CardContent className="p-5">
        {/* Content */}
        <div className="mb-4">
          <p className={`text-gray-800 leading-relaxed ${isRTL ? 'text-right' : 'text-left'} ${thought.completed ? 'line-through text-gray-500' : ''}`}>
            {thought.content}
          </p>
        </div>

        {/* Tags */}
        {thought.tags && thought.tags.length > 0 && (
          <div className={`flex flex-wrap gap-2 mb-4 ${isRTL ? 'justify-end' : 'justify-start'}`}>
            {thought.tags.map(tag => (
              <Badge key={tag.id} variant="secondary" className="text-xs bg-sage-100 text-sage-700 hover:bg-sage-200">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Tag Input */}
        {showTagInput && (
          <div className="mb-4">
            <TagInput 
              onTagAdd={(tag) => handleAddTag(thought.id, tag)}
              existingTags={validExistingTags}
              placeholder={t('thoughts.addTag')}
            />
          </div>
        )}

        {/* Actions Row */}
        <div className="flex flex-col gap-3">
          {/* Primary Actions */}
          <div className="flex flex-wrap gap-2">
            {/* Mark Complete/Incomplete */}
            <Button
              variant={thought.completed ? "secondary" : "outline"}
              size="sm"
              className={`flex items-center gap-2 h-9 ${
                thought.completed 
                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                  : 'border-sage-200 text-sage-700 hover:bg-sage-50'
              }`}
              onClick={() => handleToggleComplete(thought.id, !thought.completed)}
            >
              {thought.completed ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              <span className="text-sm">
                {thought.completed ? t('thoughts.markIncomplete') || 'Mark Incomplete' : t('thoughts.markComplete') || 'Mark Complete'}
              </span>
            </Button>

            {/* Convert to Commitment - Only show for incomplete thoughts */}
            {!thought.completed && (
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2 h-9 bg-sage-600 hover:bg-sage-700 text-white"
                onClick={() => navigate('/commitment-clarifier', { state: { thought: thought.content } })}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm">{t('thoughts.convertToCommitment') || 'Convert to Commitment'}</span>
              </Button>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="flex justify-between items-center pt-2 border-t border-sage-100">
            <div className="flex items-center gap-1">
              <time className="text-xs text-sage-500" dir="ltr">
                {format(new Date(thought.created_at), 'MMM d, yyyy h:mm a')}
              </time>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Add Tag */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-sage-600 hover:text-sage-700 hover:bg-sage-50"
                onClick={handleTagClick}
              >
                <TagIcon className="h-4 w-4 mr-1" />
                <span className="text-xs">{t('thoughts.addTag') || 'Tag'}</span>
              </Button>

              {/* Delete */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(thought.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span className="text-xs">{t('thoughts.delete') || 'Delete'}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThoughtCard;
