// GitHub API Configuration
const GITHUB_CONFIG = {
    username: 'sivolko',
    repository: 'cyber-security-forum',
    apiBase: 'https://api.github.com',
    perPage: 25
};

// Global state
let currentPage = 1;
let currentFilter = 'hot';
let currentCategory = 'all';
let currentTimeFilter = 'all';
let isLoading = false;
let hasMorePages = true;
let allDiscussions = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadDiscussions();
    loadPopularTags();
    loadStats();
}

function setupEventListeners() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.tab;
            resetAndLoadDiscussions();
        });
    });
    
    // Filter changes
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            resetAndLoadDiscussions();
        });
    }
    
    const timeFilter = document.getElementById('time-filter');
    if (timeFilter) {
        timeFilter.addEventListener('change', (e) => {
            currentTimeFilter = e.target.value;
            resetAndLoadDiscussions();
        });
    }
    
    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreDiscussions);
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                handleSearch(e.target.value);
            }, 500);
        });
    }
    
    // Search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                handleSearch(searchInput.value);
            }
        });
    }
}

function resetAndLoadDiscussions() {
    currentPage = 1;
    hasMorePages = true;
    allDiscussions = [];
    const container = document.getElementById('discussions-container');
    if (container) {
        container.innerHTML = '<div class="loading-placeholder"><div class="loading-spinner"></div><p>Loading discussions...</p></div>';
    }
    loadDiscussions();
}

async function loadDiscussions() {
    if (isLoading || !hasMorePages) return;
    
    isLoading = true;
    const container = document.getElementById('discussions-container');
    
    try {
        // Try to fetch from GitHub Discussions API first
        let discussions = await fetchGitHubDiscussions();
        
        // If no discussions API enabled, fallback to mock data or issues
        if (!discussions || discussions.length === 0) {
            discussions = await fetchFallbackData();
        }
        
        if (currentPage === 1) {
            allDiscussions = discussions;
        } else {
            allDiscussions = [...allDiscussions, ...discussions];
        }
        
        renderDiscussions(allDiscussions);
        
        // Update load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            if (discussions.length < GITHUB_CONFIG.perPage) {
                hasMorePages = false;
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
        }
        
    } catch (error) {
        console.error('Error loading discussions:', error);
        renderError(container);
    } finally {
        isLoading = false;
    }
}

async function fetchGitHubDiscussions() {
    try {
        // Note: GitHub Discussions API requires GraphQL and special permissions
        // For now, we'll use a combination of issues and mock data
        const response = await fetch(
            `${GITHUB_CONFIG.apiBase}/repos/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/issues?state=all&per_page=${GITHUB_CONFIG.perPage}&page=${currentPage}&sort=created&direction=desc`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const issues = await response.json();
        
        // Transform issues to discussion format
        return issues.map(issue => ({
            id: issue.id,
            title: issue.title,
            body: issue.body,
            author: {
                login: issue.user.login,
                avatar_url: issue.user.avatar_url
            },
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            comments: issue.comments,
            url: issue.html_url,
            labels: issue.labels,
            state: issue.state,
            reactions: {
                '+1': Math.floor(Math.random() * 20),
                '-1': Math.floor(Math.random() * 5),
                'heart': Math.floor(Math.random() * 10)
            }
        }));
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        return [];
    }
}

async function fetchFallbackData() {
    // Generate mock cybersecurity discussions
    const mockDiscussions = [
        {
            id: 1,
            title: "CVE-2024-1234: Critical RCE in Popular Web Framework",
            body: "A critical remote code execution vulnerability has been discovered in a widely-used web framework. This post discusses the technical details, exploitation methods, and recommended mitigations.",
            author: {
                login: "security_researcher",
                avatar_url: "/assets/images/default-avatar.svg"
            },
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString(),
            comments: 15,
            url: "#",
            labels: [{name: "vulnerability-research", color: "ff4444"}],
            category: "Vulnerability Research",
            state: "open",
            reactions: { '+1': 25, '-1': 2, 'heart': 8 }
        },
        {
            id: 2,
            title: "Building a Threat Hunting Program: Best Practices and Tools",
            body: "This comprehensive guide covers the essential components of building an effective threat hunting program, including tooling recommendations, methodologies, and team structure.",
            author: {
                login: "threat_hunter",
                avatar_url: "/assets/images/default-avatar.svg"
            },
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 7200000).toISOString(),
            comments: 8,
            url: "#",
            labels: [{name: "threat-intel", color: "0099ff"}],
            category: "Threat Intelligence",
            state: "open",
            reactions: { '+1': 18, '-1': 0, 'heart': 12 }
        },
        {
            id: 3,
            title: "Analysis of Recent APT Campaign Targeting Healthcare Sector",
            body: "Detailed analysis of a sophisticated APT campaign that has been targeting healthcare organizations globally. Includes IOCs, TTPs, and attribution analysis.",
            author: {
                login: "malware_analyst",
                avatar_url: "/assets/images/default-avatar.svg"
            },
            created_at: new Date(Date.now() - 259200000).toISOString(),
            updated_at: new Date(Date.now() - 10800000).toISOString(),
            comments: 22,
            url: "#",
            labels: [{name: "malware-analysis", color: "8b00ff"}, {name: "apt", color: "666666"}],
            category: "Malware Analysis",
            state: "open",
            reactions: { '+1': 32, '-1': 1, 'heart': 15 }
        },
        {
            id: 4,
            title: "Red Team Exercise: Lessons Learned from a Finance Sector Engagement",
            body: "Sharing insights and lessons learned from a recent red team engagement in the financial sector, including novel attack vectors and defensive gaps identified.",
            author: {
                login: "red_teamer",
                avatar_url: "/assets/images/default-avatar.svg"
            },
            created_at: new Date(Date.now() - 345600000).toISOString(),
            updated_at: new Date(Date.now() - 14400000).toISOString(),
            comments: 11,
            url: "#",
            labels: [{name: "pentest", color: "00ff44"}, {name: "red-team", color: "ff0000"}],
            category: "Penetration Testing",
            state: "open",
            reactions: { '+1': 21, '-1': 0, 'heart': 7 }
        },
        {
            id: 5,
            title: "Open Source SIEM: Building Detection Rules for Cloud Environments",
            body: "A practical guide to creating effective detection rules for cloud environments using open source SIEM solutions. Includes real-world examples and best practices.",
            author: {
                login: "security_engineer",
                avatar_url: "/assets/images/default-avatar.svg"
            },
            created_at: new Date(Date.now() - 432000000).toISOString(),
            updated_at: new Date(Date.now() - 18000000).toISOString(),
            comments: 6,
            url: "#",
            labels: [{name: "security-tools", color: "ffaa00"}, {name: "cloud", color: "0088cc"}],
            category: "Security Tools",
            state: "open",
            reactions: { '+1': 14, '-1': 0, 'heart': 5 }
        }
    ];
    
    // Apply filters to mock data
    let filteredDiscussions = [...mockDiscussions];
    
    // Category filter
    if (currentCategory !== 'all') {
        filteredDiscussions = filteredDiscussions.filter(d => 
            d.category.toLowerCase().replace(/\s+/g, '-') === currentCategory
        );
    }
    
    // Time filter
    if (currentTimeFilter !== 'all') {
        const now = new Date();
        const timeThreshold = {
            'today': 24 * 60 * 60 * 1000,
            'week': 7 * 24 * 60 * 60 * 1000,
            'month': 30 * 24 * 60 * 60 * 1000
        }[currentTimeFilter];
        
        if (timeThreshold) {
            filteredDiscussions = filteredDiscussions.filter(d => 
                now - new Date(d.created_at) <= timeThreshold
            );
        }
    }
    
    // Sort based on current filter
    switch (currentFilter) {
        case 'hot':
            filteredDiscussions.sort((a, b) => 
                (b.reactions['+1'] + b.comments) - (a.reactions['+1'] + a.comments)
            );
            break;
        case 'new':
            filteredDiscussions.sort((a, b) => 
                new Date(b.created_at) - new Date(a.created_at)
            );
            break;
        case 'top':
            filteredDiscussions.sort((a, b) => 
                b.reactions['+1'] - a.reactions['+1']
            );
            break;
    }
    
    return filteredDiscussions;
}

function renderDiscussions(discussions) {
    const container = document.getElementById('discussions-container');
    if (!container) return;
    
    if (discussions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💬</div>
                <h3>No discussions found</h3>
                <p>Be the first to start a discussion in this category!</p>
                <a href="https://github.com/${GITHUB_CONFIG.username}/${GITHUB_CONFIG.repository}/discussions/new" target="_blank" class="btn btn-primary">Start Discussion</a>
            </div>
        `;
        return;
    }
    
    const discussionsHtml = discussions.map(discussion => `
        <article class="discussion-card" onclick="openDiscussion('${discussion.url}')">
            <div class="discussion-header">
                <div class="discussion-meta">
                    <span class="discussion-category">${discussion.category || 'General'}</span>
                    <span class="discussion-date">${formatRelativeTime(discussion.created_at)}</span>
                </div>
                <h2 class="discussion-title">${discussion.title}</h2>
                <div class="discussion-excerpt">
                    ${discussion.body ? truncateText(discussion.body, 150) : ''}
                </div>
                ${discussion.labels && discussion.labels.length > 0 ? `
                    <div class="discussion-tags">
                        ${discussion.labels.map(label => `<span class="tag">${label.name}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="discussion-footer">
                <div class="discussion-stats">
                    <div class="stat-item">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 1l7 7h-4v7H5V8H1l7-7z"/>
                        </svg>
                        <span>${discussion.reactions ? discussion.reactions['+1'] : 0}</span>
                    </div>
                    <div class="stat-item">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2.678 11.894a1 1 0 01.287.801 10.97 10.97 0 01-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 01.71-.074A8.06 8.06 0 008 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 01-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 00.244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 01-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                        </svg>
                        <span>${discussion.comments || 0}</span>
                    </div>
                </div>
                
                <div class="discussion-author">
                    <img src="${discussion.author.avatar_url}" alt="${discussion.author.login}" class="author-avatar">
                    <span class="author-name">${discussion.author.login}</span>
                </div>
            </div>
        </article>
    `).join('');
    
    container.innerHTML = discussionsHtml;
}

function loadMoreDiscussions() {
    currentPage++;
    loadDiscussions();
}

function renderError(container) {
    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Failed to load discussions</h3>
            <p>There was an error loading the discussions. Please try again later.</p>
            <button onclick="resetAndLoadDiscussions()" class="btn btn-secondary">Retry</button>
        </div>
    `;
}

function handleSearch(query) {
    if (!query.trim()) {
        resetAndLoadDiscussions();
        return;
    }
    
    const filteredDiscussions = allDiscussions.filter(discussion => 
        discussion.title.toLowerCase().includes(query.toLowerCase()) ||
        (discussion.body && discussion.body.toLowerCase().includes(query.toLowerCase())) ||
        (discussion.labels && discussion.labels.some(label => 
            label.name.toLowerCase().includes(query.toLowerCase())
        ))
    );
    
    renderDiscussions(filteredDiscussions);
}

async function loadPopularTags() {
    const tagsContainer = document.getElementById('popular-tags');
    if (!tagsContainer) return;
    
    const popularTags = [
        'vulnerability', 'malware', 'pentest', 'siem', 'incident-response',
        'threat-hunting', 'forensics', 'cloud-security', 'zero-day', 'apt'
    ];
    
    const tagsHtml = popularTags.map(tag => `
        <a href="#" class="tag-item" onclick="searchByTag('${tag}')">${tag}</a>
    `).join('');
    
    tagsContainer.innerHTML = tagsHtml;
}

async function loadStats() {
    const totalDiscussionsEl = document.getElementById('total-discussions');
    const activeTodayEl = document.getElementById('active-today');
    const totalContributorsEl = document.getElementById('total-contributors');
    
    // Mock stats - in a real implementation, these would come from GitHub API
    if (totalDiscussionsEl) totalDiscussionsEl.textContent = '247';
    if (activeTodayEl) activeTodayEl.textContent = '12';
    if (totalContributorsEl) totalContributorsEl.textContent = '89';
}

function searchByTag(tag) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = tag;
        handleSearch(tag);
    }
}

function openDiscussion(url) {
    if (url && url !== '#') {
        window.open(url, '_blank');
    }
}

// Utility functions
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Category color mapping
function getCategoryColor(category) {
    const colors = {
        'vulnerability-research': '#ff4444',
        'incident-response': '#ff8800',
        'threat-intel': '#0099ff',
        'malware-analysis': '#8b00ff',
        'pentest': '#00ff44',
        'security-tools': '#ffaa00',
        'compliance': '#0088cc',
        'security-news': '#666666'
    };
    
    return colors[category] || '#666666';
}

// Export functions for global access
window.resetAndLoadDiscussions = resetAndLoadDiscussions;
window.searchByTag = searchByTag;
window.openDiscussion = openDiscussion;