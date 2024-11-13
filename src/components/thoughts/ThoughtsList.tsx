import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle, Trash2, CheckCircle } from 'lucide-react';

interface ThoughtsListProps {
  thoughts: any[];
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
}

const ThoughtsList = ({ thoughts, onDelete, onToggleComplete }: ThoughtsListProps) => {
  const navigate = useNavigate();

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

  return (
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ThoughtsList;