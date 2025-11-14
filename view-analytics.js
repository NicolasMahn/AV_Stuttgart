#!/usr/bin/env node

/**
 * Simple command-line analytics viewer
 * Usage: node view-analytics.js [command] [options]
 */

const fs = require('fs');
const path = require('path');

const ANALYTICS_DIR = path.join(__dirname, 'analytics');

// Helper function to read all analytics files
function readAllAnalytics() {
  const events = [];
  
  try {
    const files = fs.readdirSync(ANALYTICS_DIR);
    const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));
    
    for (const file of jsonlFiles) {
      const filePath = path.join(ANALYTICS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          events.push(JSON.parse(line));
        } catch (e) {
          console.error('Error parsing line:', e.message);
        }
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('No analytics data found. Directory does not exist.');
      return [];
    }
    throw error;
  }
  
  return events;
}

// Command: summary
function showSummary() {
  const events = readAllAnalytics();
  
  if (events.length === 0) {
    console.log('No analytics data available.');
    return;
  }
  
  const uniqueVisitors = new Set(events.map(e => e.visitorId).filter(Boolean));
  const uniqueSessions = new Set(events.map(e => e.sessionId).filter(Boolean));
  
  const eventTypes = {};
  events.forEach(e => {
    eventTypes[e.eventType] = (eventTypes[e.eventType] || 0) + 1;
  });
  
  console.log('\n📊 Analytics Summary');
  console.log('='.repeat(50));
  console.log(`Total Events: ${events.length}`);
  console.log(`Unique Visitors: ${uniqueVisitors.size}`);
  console.log(`Unique Sessions: ${uniqueSessions.size}`);
  console.log('\nEvent Types:');
  Object.entries(eventTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  console.log('='.repeat(50) + '\n');
}

// Command: links
function showTopLinks() {
  const events = readAllAnalytics();
  const linkClicks = events.filter(e => e.eventType === 'link_click');
  
  if (linkClicks.length === 0) {
    console.log('No link click data available.');
    return;
  }
  
  const clickCounts = {};
  linkClicks.forEach(click => {
    const key = `${click.linkTitle || 'Unknown'}|${click.linkUrl || ''}`;
    clickCounts[key] = (clickCounts[key] || 0) + 1;
  });
  
  const sorted = Object.entries(clickCounts)
    .map(([key, count]) => {
      const [title, url] = key.split('|');
      return { title, url, count };
    })
    .sort((a, b) => b.count - a.count);
  
  console.log('\n🔗 Top Clicked Links');
  console.log('='.repeat(70));
  sorted.forEach((link, i) => {
    console.log(`${i + 1}. ${link.title} (${link.count} clicks)`);
    console.log(`   ${link.url}`);
  });
  console.log('='.repeat(70) + '\n');
}

// Command: pages
function showTopPages() {
  const events = readAllAnalytics();
  const pageViews = events.filter(e => e.eventType === 'page_view');
  
  if (pageViews.length === 0) {
    console.log('No page view data available.');
    return;
  }
  
  const pageCounts = {};
  pageViews.forEach(view => {
    const page = view.path + (view.hash || '');
    pageCounts[page] = (pageCounts[page] || 0) + 1;
  });
  
  const sorted = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  
  console.log('\n📄 Top Pages');
  console.log('='.repeat(50));
  sorted.forEach(([page, count], i) => {
    console.log(`${i + 1}. ${page}: ${count} views`);
  });
  console.log('='.repeat(50) + '\n');
}

// Command: languages
function showLanguageStats() {
  const events = readAllAnalytics();
  const langChanges = events.filter(e => e.eventType === 'language_change');
  
  console.log('\n🌍 Language Statistics');
  console.log('='.repeat(50));
  console.log(`Total language changes: ${langChanges.length}`);
  
  if (langChanges.length > 0) {
    const transitions = {};
    langChanges.forEach(change => {
      const key = `${change.fromLanguage} → ${change.toLanguage}`;
      transitions[key] = (transitions[key] || 0) + 1;
    });
    
    console.log('\nLanguage transitions:');
    Object.entries(transitions)
      .sort((a, b) => b[1] - a[1])
      .forEach(([transition, count]) => {
        console.log(`  ${transition}: ${count}`);
      });
  }
  console.log('='.repeat(50) + '\n');
}

// Command: recent
function showRecentEvents(limit = 10) {
  const events = readAllAnalytics();
  
  if (events.length === 0) {
    console.log('No events available.');
    return;
  }
  
  const recent = events
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
  
  console.log(`\n⏱️  Recent Events (Last ${limit})`);
  console.log('='.repeat(70));
  recent.forEach(event => {
    const time = new Date(event.timestamp).toLocaleString();
    console.log(`[${time}] ${event.eventType}`);
    if (event.eventType === 'link_click') {
      console.log(`  → ${event.linkTitle}: ${event.linkUrl}`);
    } else if (event.eventType === 'navigation') {
      console.log(`  → ${event.sectionName} (${event.sectionKey})`);
    } else if (event.eventType === 'page_view') {
      console.log(`  → ${event.path}${event.hash || ''}`);
    }
  });
  console.log('='.repeat(70) + '\n');
}

// Command: date
function showDataByDate(date) {
  const filePath = path.join(ANALYTICS_DIR, `analytics-${date}.jsonl`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const events = content.split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));
    
    console.log(`\n📅 Analytics for ${date}`);
    console.log('='.repeat(50));
    console.log(`Total events: ${events.length}`);
    
    const uniqueVisitors = new Set(events.map(e => e.visitorId).filter(Boolean));
    console.log(`Unique visitors: ${uniqueVisitors.size}`);
    
    const eventTypes = {};
    events.forEach(e => {
      eventTypes[e.eventType] = (eventTypes[e.eventType] || 0) + 1;
    });
    
    console.log('\nEvent breakdown:');
    Object.entries(eventTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    console.log('='.repeat(50) + '\n');
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`No data found for date: ${date}`);
    } else {
      console.error('Error reading data:', error.message);
    }
  }
}

// Main command dispatcher
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'summary';
  
  switch (command) {
    case 'summary':
      showSummary();
      break;
    
    case 'links':
      showTopLinks();
      break;
    
    case 'pages':
      showTopPages();
      break;
    
    case 'languages':
    case 'lang':
      showLanguageStats();
      break;
    
    case 'recent':
      const limit = parseInt(args[1]) || 10;
      showRecentEvents(limit);
      break;
    
    case 'date':
      if (!args[1]) {
        console.log('Usage: node view-analytics.js date YYYY-MM-DD');
        process.exit(1);
      }
      showDataByDate(args[1]);
      break;
    
    case 'all':
      showSummary();
      showTopPages();
      showTopLinks();
      showLanguageStats();
      showRecentEvents(5);
      break;
    
    case 'help':
    default:
      console.log('\n📊 Analytics Viewer');
      console.log('='.repeat(50));
      console.log('Usage: node view-analytics.js [command] [options]\n');
      console.log('Commands:');
      console.log('  summary          Show overall statistics (default)');
      console.log('  links            Show most clicked links');
      console.log('  pages            Show most viewed pages');
      console.log('  languages        Show language change statistics');
      console.log('  recent [n]       Show last n events (default: 10)');
      console.log('  date YYYY-MM-DD  Show data for specific date');
      console.log('  all              Show all reports');
      console.log('  help             Show this help message');
      console.log('='.repeat(50) + '\n');
      break;
  }
}

// Run
main();

