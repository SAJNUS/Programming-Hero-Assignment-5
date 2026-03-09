const tabButtons = document.querySelectorAll('.tab-btn');
const issuesGrid = document.getElementById('issues-grid');
const issueCount = document.getElementById('issue-count');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const selectedTab = button.dataset.tab;
        filterIssues(selectedTab);
    });
});

function filterIssues(filter) {
    console.log('Filtering issues by:', filter);
}

const sampleIssues = [
    {
        id: 1,
        title: 'Fix Navigation Menu On Mobile Devices',
        description: 'The navigation menu doesn\'t collapse properly on mobile devices.',
        priority: 'high',
        status: 'open',
        icon: 'Open-Status.png',
        tags: ['bug', 'help-wanted'],
        author: 'by john_doe',
        date: '1/15/2024'
    },
    {
        id: 2,
        title: 'Fix Navigation Menu On Mobile Devices',
        description: 'The navigation menu doesn\'t collapse properly on mobile devices.',
        priority: 'medium',
        status: 'open',
        icon: 'Open-Status.png',
        tags: ['bug', 'help-wanted'],
        author: 'by john_doe',
        date: '1/15/2024'
    },
    {
        id: 3,
        title: 'Fix Navigation Menu On Mobile Devices',
        description: 'The navigation menu doesn\'t collapse properly on mobile devices.',
        priority: 'low',
        status: 'closed',
        icon: 'Closed- Status .png',
        tags: ['bug', 'help-wanted'],
        author: 'by john_doe',
        date: '1/15/2024'
    },
    {
        id: 4,
        title: 'Fix Navigation Menu On Mobile Devices',
        description: 'The navigation menu doesn\'t collapse properly on mobile devices.',
        priority: 'high',
        status: 'open',
        icon: 'Open-Status.png',
        tags: ['bug', 'help-wanted'],
        author: 'by john_doe',
        date: '1/15/2024'
    }
];

function createIssueCard(issue) {
    const card = document.createElement('div');
    card.className = `issue-card priority-${issue.priority}`;
    
    card.innerHTML = `
        <div class="issue-header">
            <img src="assets/${issue.icon}" alt="Status" class="issue-icon">
            <span class="priority-badge priority-${issue.priority}">${issue.priority.toUpperCase()}</span>
        </div>
        <h3 class="issue-title">${issue.title}</h3>
        <p class="issue-description">${issue.description}</p>
        <div class="issue-tags">
            ${issue.tags.map(tag => `<span class="tag tag-${tag}">${tag.toUpperCase().replace('-', ' ')}</span>`).join('')}
        </div>
        <div class="issue-footer">
            <span>${issue.author}</span>
            <span>${issue.date}</span>
        </div>
    `;
    
    return card;
}

function renderIssues(issues) {
    issuesGrid.innerHTML = '';
    issues.forEach(issue => {
        const card = createIssueCard(issue);
        issuesGrid.appendChild(card);
    });
}

renderIssues(sampleIssues);
