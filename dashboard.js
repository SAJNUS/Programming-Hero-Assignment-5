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
    
    issueCount.textContent = filteredIssues.length;
    renderIssues(filteredIssues);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function getLabelClass(label) {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('bug')) return 'tag-bug';
    if (labelLower.includes('help')) return 'tag-help-wanted';
    if (labelLower.includes('enhancement')) return 'tag-enhancement';
    if (labelLower.includes('documentation')) return 'tag-documentation';
    if (labelLower.includes('good first issue') || labelLower.includes('good-first-issue')) return 'tag-good-first-issue';
    return 'tag-default';
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
    const author = issue.author || 'unknown';
    const createdAt = issue.createdAt || new Date().toISOString();
    
    let labelsHTML = '';
    if (issue.labels && issue.labels.length > 0) {
        labelsHTML = issue.labels.map(label => 
            `<span class="tag ${getLabelClass(label)}">${label.toUpperCase()}</span>`
        ).join('');
    } else {
        labelsHTML = '<span class="tag tag-default">GENERAL</span>';
    }
    
    card.className = `issue-card status-${statusClass}`;
    card.style.cursor = 'pointer';
    card.dataset.issueId = issue.id;
    
    card.innerHTML = `
        <div class="issue-header">
            <img src="assets/${statusIcon}" alt="Status" class="issue-icon">
            <span class="priority-badge priority-${priorityClass}">${priority.toUpperCase()}</span>
        </div>
        <h3 class="issue-title">${title}</h3>
        <p class="issue-description">${description}</p>
        <div class="issue-tags">
            ${labelsHTML}
        </div>
        <div class="issue-footer">
            <span>by ${author}</span>
            <span>${formatDate(createdAt)}</span>
        </div>
    `;
    
    card.addEventListener('click', () => openIssueModal(issue.id));
    
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

async function openIssueModal(id) {
    modalOverlay.classList.add('active');
    
    try {
        // Fetch issue details from API
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const result = await response.json();
        
        // Extract issue data from response.data
        const issue = result.data;
        
        // Populate modal with issue data
        document.getElementById('modal-title').textContent = issue.title;
        document.getElementById('modal-description').textContent = issue.description;
        
        const statusBadge = document.getElementById('modal-status');
        statusBadge.textContent = issue.status === 'open' ? 'Opened' : 'Closed';
        statusBadge.className = `modal-status-badge status-${issue.status}`;
        
        const metaInfo = document.getElementById('modal-meta-info');
        metaInfo.textContent = `Opened by ${issue.author} • ${formatDate(issue.createdAt)}`;
        
        // Render labels dynamically
        const tagsContainer = document.getElementById('modal-tags');
        tagsContainer.innerHTML = '';
        
        if (issue.labels && issue.labels.length > 0) {
            issue.labels.forEach(label => {
                const labelTag = document.createElement('span');
                labelTag.className = `modal-tag ${getLabelClass(label)}`;
                labelTag.textContent = label.toUpperCase();
                tagsContainer.appendChild(labelTag);
            });
        }
        
        // Set assignee
        document.getElementById('modal-author').textContent = issue.assignee || issue.author;
        
        // Set priority badge
        const priorityBadge = document.getElementById('modal-priority');
        priorityBadge.textContent = issue.priority.toUpperCase();
        priorityBadge.className = `modal-priority-badge priority-${issue.priority.toLowerCase()}`;
        
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

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
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
