// Vue 2 style deep reactivity implementation (eager/deep traversal)

function defineReactiveProperty(obj, key, value) {
    if (typeof value === 'object' && value !== null) {
        makeObjectReactive(value);
    }
    
    Object.defineProperty(obj, key, {
        get() {
            console.log(`[Vue 2] Getting ${key}`);
            return value;
        },
        set(newValue) {
            console.log(`[Vue 2] Setting ${key}`);
            value = newValue;
        }
    });
}

function makeObjectReactive(obj) {
    Object.keys(obj).forEach(key => {
        defineReactiveProperty(obj, key, obj[key]);
    });
}

// Demo function for Vue 2 style
function demoVue2Style() {
    console.clear();
    console.log('=== Vue 2 Style Reactivity Demo ===');
    
    const startTime = performance.now();
    
    // Create and make reactive
    const originalObj = createLargeNestedObject();

    makeObjectReactive(originalObj);

    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(2);
    
    // Update UI
    updatePerformanceDisplay('vue2Performance', timeTaken);
    updateOutput('vue2Output', 'Object created and made reactive.\nCheck console for access logs.');
    
    // Test access
    console.log('\nTesting Vue 2 style property access:');
    originalObj.prop0.prop1.value;
    
    return originalObj;
}
