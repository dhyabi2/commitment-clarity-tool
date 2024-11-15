interface ThoughtData {
  id: number;
  content: string;
  completed: boolean;
  created_at: string;
  tags?: { id: number; name: string; }[];
}

interface CommitmentData {
  id: number;
  outcome: string;
  nextaction: string;
  completed: boolean;
  created_at: string;
}

export const convertToXML = (thoughts: ThoughtData[], commitments: CommitmentData[]): string => {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<userData>
  <thoughts>
    ${thoughts.map(thought => `
    <thought>
      <id>${thought.id}</id>
      <content>${escapeXml(thought.content)}</content>
      <completed>${thought.completed}</completed>
      <created_at>${thought.created_at}</created_at>
      ${thought.tags ? `
      <tags>
        ${thought.tags.map(tag => `
        <tag>
          <id>${tag.id}</id>
          <name>${escapeXml(tag.name)}</name>
        </tag>`).join('')}
      </tags>` : ''}
    </thought>`).join('')}
  </thoughts>
  <commitments>
    ${commitments.map(commitment => `
    <commitment>
      <id>${commitment.id}</id>
      <outcome>${escapeXml(commitment.outcome)}</outcome>
      <nextaction>${escapeXml(commitment.nextaction)}</nextaction>
      <completed>${commitment.completed}</completed>
      <created_at>${commitment.created_at}</created_at>
    </commitment>`).join('')}
  </commitments>
</userData>`;

  return xmlContent;
};

export const parseXMLData = (xmlString: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  
  const thoughts: ThoughtData[] = Array.from(xmlDoc.querySelectorAll('thought')).map(thought => ({
    id: parseInt(thought.querySelector('id')?.textContent || '0'),
    content: unescapeXml(thought.querySelector('content')?.textContent || ''),
    completed: thought.querySelector('completed')?.textContent === 'true',
    created_at: thought.querySelector('created_at')?.textContent || new Date().toISOString(),
    tags: Array.from(thought.querySelectorAll('tag')).map(tag => ({
      id: parseInt(tag.querySelector('id')?.textContent || '0'),
      name: unescapeXml(tag.querySelector('name')?.textContent || '')
    }))
  }));

  const commitments: CommitmentData[] = Array.from(xmlDoc.querySelectorAll('commitment')).map(commitment => ({
    id: parseInt(commitment.querySelector('id')?.textContent || '0'),
    outcome: unescapeXml(commitment.querySelector('outcome')?.textContent || ''),
    nextaction: unescapeXml(commitment.querySelector('nextaction')?.textContent || ''),
    completed: commitment.querySelector('completed')?.textContent === 'true',
    created_at: commitment.querySelector('created_at')?.textContent || new Date().toISOString()
  }));

  return { thoughts, commitments };
};

const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

const unescapeXml = (safe: string): string => {
  return safe.replace(/&lt;|&gt;|&amp;|&apos;|&quot;/g, c => {
    switch (c) {
      case '&lt;': return '<';
      case '&gt;': return '>';
      case '&amp;': return '&';
      case '&apos;': return '\'';
      case '&quot;': return '"';
      default: return c;
    }
  });
};