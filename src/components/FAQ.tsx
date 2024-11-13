import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const FAQ = () => {
  return (
    <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-sage-700">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="space-y-2">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left">
            What is Clear Mind and how does it work?
          </AccordionTrigger>
          <AccordionContent>
            Clear Mind is an app designed to help you manage your commitments effectively. It follows the principle that "if it's on your mind, your mind isn't clear." The app provides a trusted system to capture, clarify, and track your commitments outside of your mind.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left">
            How do I start using Clear Mind?
          </AccordionTrigger>
          <AccordionContent>
            Start by using the Brain Dump feature to capture any unfinished thoughts or tasks. Once captured, use the Commitment Clarifier to transform these thoughts into clear, actionable commitments with specific outcomes and next actions.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left">
            What are the three key steps to managing commitments?
          </AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-4 space-y-2">
              <li>Capture everything that's on your mind in the Brain Dump section</li>
              <li>Clarify your commitments by defining specific outcomes and next actions using the Commitment Clarifier</li>
              <li>Review your organized commitments regularly in the Active Commitments section</li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left">
            How do I clarify a commitment properly?
          </AccordionTrigger>
          <AccordionContent>
            When clarifying a commitment, ask yourself two key questions:
            <ol className="list-decimal pl-4 mt-2 space-y-2">
              <li>What would need to happen for this commitment to be complete?</li>
              <li>What's the very next physical action required to move forward?</li>
            </ol>
            Use the Commitment Clarifier feature to document these answers systematically.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger className="text-left">
            Why is it important to define next actions?
          </AccordionTrigger>
          <AccordionContent>
            Defining next actions creates clarity and motivation. Instead of just thinking about your commitments, you'll know exactly what physical action to take next, making it easier to make progress and maintain momentum on your projects.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default FAQ;