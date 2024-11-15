import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightCircle, Trash2, CheckCircle, Tag as TagIcon } from 'lucide-react';
import { TagInput } from './TagInput';

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

const ThoughtCard = ({ thought, onDelete, onToggleComplete, onAddTag, existingTags = [] }: ThoughtCardProps) => {
  const navigate = useNavigate();
  const [showTagInput, setShowTagInput] = useState(false);

  return (
    <Card className="group hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <CheckCircle className={`h-5 w-5 ${thought.completed ? 'text-green-500' : 'text-gray-300'}`} />
          <time className="text-xs text-sage-500">
            {format(new Date(thought.created_at), 'MMM d, h:mm a')}
          </time>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={() => setShowTagInput(!showTagInput)}
          >
            <TagIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-red-600"
            onClick={() => onDelete(thought.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={() => onToggleComplete(thought.id, !thought.completed)}
          >
            <CheckCircle className={`h-4 w-4 ${thought.completed ? 'text-green-500' : ''}`} />
          </Button>
          {!thought.completed && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => navigate('/commitment-clarifier', { state: { thought: thought.content } })}
            >
              <ArrowRightCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className={`text-gray-800 text-left ${thought.completed ? 'line-through text-gray-500' : ''}`}>
          {thought.content}
        </p>
        {showTagInput && (
          <div className="mt-2">
            <TagInput 
              onTagAdd={(tag) => onAddTag(thought.id, tag)}
              existingTags={existingTags}
            />
          </div>
        )}
        {thought.tags && thought.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
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