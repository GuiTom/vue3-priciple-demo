// Vue 3 style reactivity implementation (lazy/on-demand)

const vue3Reactive = target => {
    return new Proxy(target, {
        get(target, key) {
            const result = target[key];
            console.log(`[Vue 3] Getting ${key}`);
            
            // Only make nested objects reactive when they're accessed
            if (typeof result === 'object' && result !== null) {
                return vue3Reactive(result);
            }
            return result;
        },
        set(target, key, value) {
            console.log(`[Vue 3] Setting ${key}`);
            target[key] = value;
            return true;
        }
    });
}

// Demo function for Vue 3 style
function demoVue3Style() {
    console.clear();
    console.log('=== Vue 3 Style Reactivity Demo ===');
    
    const startTime = performance.now();
    
    // Create and make reactive
    const originalObj = createLargeNestedObject();
    const reactiveObj = vue3Reactive(originalObj);
    
    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(2);
    
    // Update UI
    updatePerformanceDisplay('vue3Performance', timeTaken);
    updateOutput('vue3Output', 'Object created and made reactive.\nCheck console for access logs.');
    
    // Test access
    console.log('\nTesting Vue 3 style property access:');
    reactiveObj.prop0.prop1.value;
    
    return reactiveObj;
}
