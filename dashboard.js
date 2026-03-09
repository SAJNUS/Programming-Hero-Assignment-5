const tabButtons = document.querySelectorAll('.tab-btn');
const issuesGrid = document.getElementById('issues-grid');
const issueCount = document.getElementById('issue-count');
const loadingSpinner = document.getElementById('loading-spinner');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('btn-search');

let allIssues = [];
let currentFilter = 'all';
let isSearchMode = false;

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        currentFilter = button.dataset.tab;
        filterIssues(currentFilter);
    });
});

function filterIssues(filter) {
    if (isSearchMode) {
        return;
    }
    
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
    const status = issue.status || 'open';
    const priority = issue.priority || 'medium';
    const statusClass = status.toLowerCase();
    const priorityClass = priority.toLowerCase();
    const statusIcon = status === 'open' ? 'Open-Status.png' : 'Closed- Status .png';
    const title = issue.title || 'Untitled Issue';
    const description = issue.description || 'No description available';
    const label = issue.label || 'general';
    const author = issue.author || 'unknown';
    const createdAt = issue.createdAt || new Date().toISOString();
    
    card.className = `issue-card status-${statusClass}`;
    card.style.cursor = 'pointer';
    card.dataset.issueId = issue._id;
    
    card.innerHTML = `
        <div class="issue-header">
            <img src="assets/${statusIcon}" alt="Status" class="issue-icon">
            <span class="priority-badge priority-${priorityClass}">${priority.toUpperCase()}</span>
        </div>
        <h3 class="issue-title">${title}</h3>
        <p class="issue-description">${description}</p>
        <div class="issue-tags">
            <span class="tag tag-bug">${label.toUpperCase()}</span>
        </div>
        <div class="issue-footer">
            <span>by ${author}</span>
            <span>${formatDate(createdAt)}</span>
        </div>
    `;
    
    card.addEventListener('click', () => openModal(issue._id));
    
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
        const result = await response.json();
        
        allIssues = result.data;
        issueCount.textContent = allIssues.length;
        
        filterIssues(currentFilter);
        hideLoading();
    } catch (error) {
        console.error('Error fetching issues:', error);
        hideLoading();
        issuesGrid.innerHTML = '<p style="text-align: center; color: #6a737d;">Failed to load issues. Please try again later.</p>';
    }
}

const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close-btn');

async function openModal(issueId) {
    modalOverlay.classList.add('active');
    
    try {
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`);
        const issue = await response.json();
        
        const title = issue.title || 'Untitled Issue';
        const description = issue.description || 'No description available';
        const status = issue.status || 'open';
        const label = issue.label || 'general';
        const priority = issue.priority || 'medium';
        const author = issue.author || 'unknown';
        
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-description').textContent = description;
        
        const statusBadge = document.getElementById('modal-status');
        statusBadge.textContent = status;
        statusBadge.className = `modal-status-badge status-${status.toLowerCase()}`;
        
        document.getElementById('modal-label').textContent = label.toUpperCase();
        document.getElementById('modal-priority-tag').textContent = `${priority.toUpperCase()} PRIORITY`;
        
        document.getElementById('modal-author').textContent = author;
        
        const priorityBadge = document.getElementById('modal-priority');
        priorityBadge.textContent = priority.toUpperCase();
        priorityBadge.className = `modal-priority-badge priority-${priority.toLowerCase()}`;
    } catch (error) {
        console.error('Error fetching issue details:', error);
    }
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

modalCloseBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

async function searchIssues(searchText) {
    if (!searchText || searchText.trim() === '') {
        isSearchMode = false;
        filterIssues(currentFilter);
        return;
    }
    
    showLoading();
    isSearchMode = true;
    
    try {
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(searchText)}`);
        const result = await response.json();
        
        const searchResults = result.data || [];
        issueCount.textContent = searchResults.length;
        renderIssues(searchResults);
        hideLoading();
    } catch (error) {
        console.error('Error searching issues:', error);
        hideLoading();
        issuesGrid.innerHTML = '<p style="text-align: center; color: #6a737d;">Failed to search issues. Please try again later.</p>';
    }
}

searchButton.addEventListener('click', () => {
    const searchText = searchInput.value;
    searchIssues(searchText);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchText = searchInput.value;
        searchIssues(searchText);
    }
});

fetchIssues();
