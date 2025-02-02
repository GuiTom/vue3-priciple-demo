// Utility functions for creating test data and UI updates

// Create a large nested object for testing
function createLargeNestedObject(depth = 4, breadth = 3) {
    if (depth === 0) return { value: Math.random() };
    
    const obj = {};
    for (let i = 0; i < breadth; i++) {
        obj[`prop${i}`] = createLargeNestedObject(depth - 1, breadth);
    }
    return obj;
}

// UI update utilities
function updatePerformanceDisplay(elementId, timeTaken) {
    const element = document.getElementById(elementId);
    element.textContent = `Time taken to make reactive: ${timeTaken}ms`;
}

function updateOutput(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
}
