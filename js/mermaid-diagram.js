// Initialize Mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    flowchart: { useMaxWidth: true },
    sequence: { useMaxWidth: true },
    gantt: { useMaxWidth: true },
    journey: { useMaxWidth: true },
    er: { useMaxWidth: true },
    themeVariables: {
        primaryColor: '#ffcc00',
        edgeLabelBackground: '#ffffff',
        tertiaryColor: '#ffffff'
    }
});

document.getElementById('generate').addEventListener('click', async () => {
    const schemaInput = document.getElementById('schema-input').value;
    const mermaidDiagram = convertSchemaToMermaid(schemaInput);

    document.getElementById('mermaid-output').removeAttribute('data-processed'); // Allow Mermaid to re-process the diagram

    document.getElementById('mermaid-output').innerHTML = mermaidDiagram; // Set the Mermaid diagram
    document.getElementById('mermaid-raw').innerHTML = mermaidDiagram; // Set the raw Mermaid code

    try {
        await mermaid.run();
    } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        alert('Failed to render diagram: ' + error.message);
    }
});

// Declare dragging variables
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;

// Function to convert schema to Mermaid format
function convertSchemaToMermaid(schema) {
    const lines = schema.split('\n');
    let mermaid = 'erDiagram\n';
    const tables = {};

    lines.forEach(line => {
        const tableMatch = line.match(/create_table\s+"(\w+)"/);
        if (tableMatch) {
            const tableName = tableMatch[1];
            tables[tableName] = [];
        }

        const columnMatch = line.match(/t\.(\w+)\s+"(\w+)"/);
        if (columnMatch) {
            const type = columnMatch[1];
            const columnName = columnMatch[2];
            const lastTable = Object.keys(tables).pop();
            if (lastTable) {
                tables[lastTable].push({ name: columnName, type });
            }
        }

        const foreignKeyMatch = line.match(/add_foreign_key\s+"(\w+)",\s+"(\w+)"/);
        if (foreignKeyMatch) {
            const fromTable = foreignKeyMatch[1];
            const toTable = foreignKeyMatch[2];
            mermaid += `${fromTable} ||--o{ ${toTable} : "has"\n`;
        }
    });

    for (const table in tables) {
        mermaid += `${table} {\n`;
        tables[table].forEach(col => {
            mermaid += `  ${col.type} ${col.name}\n`;
        });
        mermaid += `}\n`;
    }

    return mermaid;
}

// Add draggable functionality
const mermaidContainer = document.getElementById('mermaid');

mermaidContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - mermaidContainer.offsetLeft;
    startY = e.pageY - mermaidContainer.offsetTop;
    scrollLeft = mermaidContainer.scrollLeft;
    scrollTop = mermaidContainer.scrollTop;
    mermaidContainer.style.cursor = 'grabbing'; // Change cursor to grabbing
});

mermaidContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    mermaidContainer.style.cursor = 'grab'; // Change cursor back to grab
});

mermaidContainer.addEventListener('mouseup', () => {
    isDragging = false;
    mermaidContainer.style.cursor = 'grab'; // Change cursor back to grab
});

mermaidContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - mermaidContainer.offsetLeft;
    const y = e.pageY - mermaidContainer.offsetTop;
    const walkX = (x - startX) * 1; // Adjust the multiplier for sensitivity
    const walkY = (y - startY) * 1; // Adjust the multiplier for sensitivity
    mermaidContainer.scrollLeft = scrollLeft - walkX;
    mermaidContainer.scrollTop = scrollTop - walkY;
});
