import React, { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightCircle, Trash2, CheckCircle, Tag as TagIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface Tag {
  id: number;
  name: string;
}

interface Thought {
  id: number;
  content: string;
  completed: boolean;
  created_at: string;
  tags?: Tag[];
}

interface ThoughtsListProps {
  thoughts: Thought[];
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
  selectedTag: string | null;
  onTagClick: (tag: string | null) => void;
}

const ThoughtsList = ({ thoughts, onDelete, onToggleComplete, selectedTag, onTagClick }: ThoughtsListProps) => {
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState<string>("");
  const [editingThoughtId, setEditingThoughtId] = useState<number | null>(null);

  if (thoughts.length === 0) {
    return (
      <Card className="p-8 text-center bg-white/50 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-sage-600 mb-2">
          {thoughts.some(t => t.completed) ? 'No completed thoughts' : 'No thoughts found'}
        </h2>
        <p className="text-sage-500 mb-4">
          {thoughts.some(t => t.completed) 
            ? 'Complete some thoughts to see them here'
            : 'Start by capturing your thoughts in the brain dump area'}
        </p>
        <Button 
          onClick={() => navigate('/')} 
          className="bg-sage-500 hover:bg-sage-600"
        >
          Go to Brain Dump
        </Button>
      </Card>
    );
  }

  // Get unique tags from all thoughts
  const allTags = Array.from(new Set(thoughts.flatMap(thought => thought.tags?.map(tag => tag.name) || []))).sort();

  const handleTagAdd = async (thoughtId: number) => {
    if (tagInput.trim()) {
      // Add tag logic will be handled by the parent component
      setTagInput("");
      setEditingThoughtId(null);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, thoughtId: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd(thoughtId);
    }
  };

  return (
    <div className="space-y-6">
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            variant={selectedTag === null ? "secondary" : "outline"}
            className="cursor-pointer"
            onClick={() => onTagClick(null)}
          >
            All
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
      )}
      
      <div className="grid gap-4">
        {thoughts.map((thought) => (
          <Card key={thought.id} className="group hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-5 w-5 ${thought.completed ? 'text-green-500' : 'text-gray-300'}`} />
                <time className="text-sm text-sage-500">
                  {format(new Date(thought.created_at), 'MMM d, yyyy h:mm a')}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => setEditingThoughtId(editingThoughtId === thought.id ? null : thought.id)}
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
                    Clarify <ArrowRightCircle className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className={`text-gray-800 text-left ${thought.completed ? 'line-through text-gray-500' : ''}`}>
                {thought.content}
              </p>
              {editingThoughtId === thought.id && (
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => handleTagInputKeyDown(e, thought.id)}
                    placeholder="Add a tag and press Enter"
                    className="flex-1"
                  />
                </div>
              )}
              {thought.tags && thought.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {thought.tags.map(tag => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ThoughtsList;