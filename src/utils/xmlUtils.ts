export const convertToXML = (thoughts: any[]) => {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<data>
  <thoughts>
    ${thoughts.map(thought => `
    <thought>
      <content>${thought.content}</content>
      <completed>${thought.completed}</completed>
      ${thought.tags ? `
      <tags>
        ${thought.tags.map((tag: any) => `
        <tag>
          <name>${tag.name}</name>
        </tag>`).join('')}
      </tags>` : ''}
    </thought>`).join('')}
  </thoughts>
</data>`;

  return xmlContent;
};

export const parseXMLData = (xmlContent: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

  const thoughts = Array.from(xmlDoc.getElementsByTagName('thought')).map(thoughtEl => {
    const content = thoughtEl.getElementsByTagName('content')[0]?.textContent || '';
    const completed = thoughtEl.getElementsByTagName('completed')[0]?.textContent === 'true';
    
    const tagsEl = thoughtEl.getElementsByTagName('tags')[0];
    const tags = tagsEl ? Array.from(tagsEl.getElementsByTagName('tag')).map(tagEl => ({
      name: tagEl.getElementsByTagName('name')[0]?.textContent || ''
    })) : [];

    return { content, completed, tags };
  });

  return { thoughts };
};