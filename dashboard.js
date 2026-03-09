const tabButtons = document.querySelectorAll('.tab-btn');
const issuesGrid = document.getElementById('issues-grid');
const issueCount = document.getElementById('issue-count');
const loadingSpinner = document.getElementById('loading-spinner');

let allIssues = [];
let currentFilter = 'all';

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        currentFilter = button.dataset.tab;
        filterIssues(currentFilter);
    });
});

function filterIssues(filter) {
    let filteredIssues = allIssues;
    
    if (filter === 'open') {
        filteredIssues = allIssues.filter(issue => issue.status === 'open');
    } else if (filter === 'closed') {
        filteredIssues = allIssues.filter(issue => issue.status === 'closed');
    }
    
    renderIssues(filteredIssues);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

function createIssueCard(issue) {
    const card = document.createElement('div');
    const statusClass = issue.status.toLowerCase();
    const priorityClass = issue.priority.toLowerCase();
    const statusIcon = issue.status === 'open' ? 'Open-Status.png' : 'Closed- Status .png';
    
    card.className = `issue-card status-${statusClass}`;
    
    card.innerHTML = `
        <div class="issue-header">
            <img src="assets/${statusIcon}" alt="Status" class="issue-icon">
            <span class="priority-badge priority-${priorityClass}">${issue.priority.toUpperCase()}</span>
        </div>
        <h3 class="issue-title">${issue.title}</h3>
        <p class="issue-description">${issue.description}</p>
        <div class="issue-tags">
            <span class="tag tag-bug">${issue.label.toUpperCase()}</span>
        </div>
        <div class="issue-footer">
            <span>by ${issue.author}</span>
            <span>${formatDate(issue.createdAt)}</span>
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

function showLoading() {
    loadingSpinner.classList.remove('hidden');
    issuesGrid.style.display = 'none';
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
    issuesGrid.style.display = 'grid';
}

async function fetchIssues() {
    showLoading();
    
    try {
        const response = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await response.json();
        
        allIssues = data;
        issueCount.textContent = allIssues.length;
        
        filterIssues(currentFilter);
        hideLoading();
    } catch (error) {
        console.error('Error fetching issues:', error);
        hideLoading();
        issuesGrid.innerHTML = '<p style="text-align: center; color: #6a737d;">Failed to load issues. Please try again later.</p>';
    }
}

fetchIssues();
