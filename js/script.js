// Zoom functionality
let scale = 1;

document.getElementById('zoom-in').addEventListener('click', () => {
    scale += 0.1;
    updateZoom();
});

document.getElementById('zoom-out').addEventListener('click', () => {
    scale = Math.max(0.1, scale - 0.1); // Prevent negative zoom
    updateZoom();
});

// Zoom with scroll wheel
const mermaidOutput = document.getElementById('mermaid-output');
mermaidOutput.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
        scale = Math.min(3, scale + 0.1); // Prevent zoom exceeding 3
    } else {
        scale = Math.max(0.1, scale - 0.1); // Prevent negative zoom
    }
    updateZoom();
});

function updateZoom() {
    mermaidOutput.style.transform = `scale(${scale})`;
    mermaidOutput.style.transformOrigin = '0 0'; // Set the origin to the top left
}

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const selectTab = document.getElementById('tabs');
    const diagramContent = document.getElementById('diagram-content');
    const codeContent = document.getElementById('code-content');

    function switchTab(tab) {
        if (tab === 'diagram') {
            diagramContent.classList.remove('hidden');
            codeContent.classList.add('hidden');
            updateActiveTab('tab-diagram');
        } else {
            diagramContent.classList.add('hidden');
            codeContent.classList.remove('hidden');
            updateActiveTab('tab-code');
        }
    }

    function updateActiveTab(activeTabId) {
        tabs.forEach(tab => {
            if (tab.id === activeTabId) {
                tab.classList.add('active', 'bg-indigo-100', 'text-indigo-700'); // Add active styles
            } else {
                tab.classList.remove('active', 'bg-indigo-100', 'text-indigo-700'); // Remove active styles
                tab.classList.add('text-gray-500'); // Reset to default text color
            }
        });
    }

    // Event listeners for tab clicks
    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            const selectedTab = this.id === 'tab-diagram' ? 'diagram' : 'code';
            switchTab(selectedTab);
        });
    });

    // Event listener for select dropdown
    selectTab.addEventListener('change', function() {
        switchTab(this.value);
    });
});
