// Vue 2 style deep reactivity (eager)
function defineReactiveProperty(obj, key, value) {
    if (typeof value === 'object' && value !== null) {
        makeObjectReactive(value);
    }
    
    Object.defineProperty(obj, key, {
        get() {
            console.log(`Getting ${key}`);
            return value;
        },
        set(newValue) {
            console.log(`Setting ${key}`);
            value = newValue;
        }
    });
}

function makeObjectReactive(obj) {
    Object.keys(obj).forEach(key => {
        defineReactiveProperty(obj, key, obj[key]);
    });
}

// Vue 3 style reactivity (lazy)
const vue3Reactive = target => {
    return new Proxy(target, {
        get(target, key) {
            const result = target[key];
            console.log(`Getting ${key}`);
            
            // Only make nested objects reactive when they're accessed
            if (typeof result === 'object' && result !== null) {
                return vue3Reactive(result);
            }
            return result;
        },
        set(target, key, value) {
            console.log(`Setting ${key}`);
            target[key] = value;
            return true;
        }
    });
}

// Create a large nested object for testing
function createLargeNestedObject(depth = 4, breadth = 3) {
    if (depth === 0) return { value: Math.random() };
    
    const obj = {};
    for (let i = 0; i < breadth; i++) {
        obj[`prop${i}`] = createLargeNestedObject(depth - 1, breadth);
    }
    return obj;
}

// Demo functions
function demoVue2Style() {
    const vue2Output = document.getElementById('vue2Output');
    const vue2Performance = document.getElementById('vue2Performance');
    
    console.clear();
    const startTime = performance.now();
    
    // Create and make reactive
    const originalObj = createLargeNestedObject();
    makeObjectReactive(originalObj);
    
    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(2);
    
    vue2Performance.textContent = `Time taken to make reactive: ${timeTaken}ms`;
    vue2Output.textContent = 'Object created and made reactive.\nCheck console for access logs.';
    
    // Test access
    console.log('Testing Vue 2 style access:');
    originalObj.prop0.prop1.value;
}

function demoVue3Style() {
    const vue3Output = document.getElementById('vue3Output');
    const vue3Performance = document.getElementById('vue3Performance');
    
    console.clear();
    const startTime = performance.now();
    
    // Create and make reactive
    const originalObj = createLargeNestedObject();
    const reactiveObj = vue3Reactive(originalObj);
    
    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(2);
    
    vue3Performance.textContent = `Time taken to make reactive: ${timeTaken}ms`;
    vue3Output.textContent = 'Object created and made reactive.\nCheck console for access logs.';
    
    // Test access
    console.log('Testing Vue 3 style access:');
    reactiveObj.prop0.prop1.value;
}
