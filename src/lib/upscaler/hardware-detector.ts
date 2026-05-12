/**
 * Hardware detection and capability profiling module
 * Detects GPU, CPU, and memory capabilities to determine optimal processing strategy
 */

export interface HardwareProfile {
    // GPU capabilities
    gpu: {
        available: boolean;
        device?: any; // GPUDevice
        adapter?: any; // GPUAdapter
        limits?: any; // GPUSupportedLimits
        maxBufferSize?: number;
        maxWorkgroupSize?: number;
        supportsCompute: boolean;
    };

    // CPU capabilities
    cpu: {
        logicalCores: number;
        estimatedSpeed: 'fast' | 'medium' | 'slow';
    };

    // Memory
    memory: {
        availableGB: number;
        tier: 'high' | 'medium' | 'low';
    };

    // Recommended settings
    recommended: {
        sharpenMode: 'gpu' | 'cpu';
        batchSize: number;
        enablePipeline: boolean;
        useObjectPools: boolean;
    };
}

/**
 * Detect hardware capabilities and return profile with recommendations
 */
export async function detectHardware(): Promise<HardwareProfile> {
    const profile: HardwareProfile = {
        gpu: {
            available: false,
            supportsCompute: false,
        },
        cpu: {
            logicalCores: navigator.hardwareConcurrency || 4,
            estimatedSpeed: 'medium',
        },
        memory: {
            availableGB: 4,
            tier: 'medium',
        },
        recommended: {
            sharpenMode: 'cpu',
            batchSize: 1,
            enablePipeline: false,
            useObjectPools: true,
        },
    };

    // Detect GPU capabilities
    if ('gpu' in navigator) {
        try {
            const gpu = (navigator as any).gpu;
            const adapter = await gpu.requestAdapter();

            if (adapter) {
                profile.gpu.available = true;
                profile.gpu.adapter = adapter;

                const device = await adapter.requestDevice();
                profile.gpu.device = device;
                profile.gpu.limits = adapter.limits;
                profile.gpu.maxBufferSize = adapter.limits.maxBufferSize;
                profile.gpu.maxWorkgroupSize = adapter.limits.maxComputeWorkgroupSizeX;

                // Check if compute shaders are supported
                profile.gpu.supportsCompute = true;

                console.log('GPU detected:', {
                    vendor: adapter.info?.vendor || 'Unknown',
                    device: adapter.info?.device || 'Unknown',
                    maxBufferSize: profile.gpu.maxBufferSize,
                    maxWorkgroupSize: profile.gpu.maxWorkgroupSize,
                });
            }
        } catch (e) {
            console.warn('WebGPU detection failed:', e);
        }
    }

    // Estimate memory
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        try {
            const estimate = await navigator.storage.estimate();
            const quotaGB = (estimate.quota || 0) / (1024 ** 3);

            profile.memory.availableGB = quotaGB;

            if (quotaGB >= 8) {
                profile.memory.tier = 'high';
            } else if (quotaGB >= 4) {
                profile.memory.tier = 'medium';
            } else {
                profile.memory.tier = 'low';
            }

            console.log('Memory estimate:', quotaGB.toFixed(2), 'GB');
        } catch (e) {
            console.warn('Memory estimation failed:', e);
        }
    }

    // Estimate CPU speed with quick benchmark
    const cpuSpeed = await benchmarkCPU();
    profile.cpu.estimatedSpeed = cpuSpeed;

    // Generate recommendations based on hardware profile
    profile.recommended = generateRecommendations(profile);

    console.log('Hardware profile:', profile);

    return profile;
}

/**
 * Quick CPU benchmark to estimate processing speed
 */
async function benchmarkCPU(): Promise<'fast' | 'medium' | 'slow'> {
    const start = performance.now();

    // Simple computational task
    let sum = 0;
    for (let i = 0; i < 1_000_000; i++) {
        sum += Math.sqrt(i) * Math.sin(i);
    }

    const elapsed = performance.now() - start;

    // Rough thresholds (lower is faster)
    if (elapsed < 10) return 'fast';
    if (elapsed < 30) return 'medium';
    return 'slow';
}

/**
 * Generate optimal settings based on hardware profile
 */
function generateRecommendations(profile: HardwareProfile): HardwareProfile['recommended'] {
    const recommendations: HardwareProfile['recommended'] = {
        sharpenMode: 'cpu',
        batchSize: 1,
        enablePipeline: false,
        useObjectPools: true,
    };

    // GPU sharpening: only if GPU is available and supports compute
    if (profile.gpu.available && profile.gpu.supportsCompute) {
        recommendations.sharpenMode = 'gpu';
    }

    // Batch size based on memory
    if (profile.memory.tier === 'high') {
        recommendations.batchSize = 4;
    } else if (profile.memory.tier === 'medium') {
        recommendations.batchSize = 2;
    } else {
        recommendations.batchSize = 1;
    }

    // Pipeline parallelization: enable if we have multiple cores
    if (profile.cpu.logicalCores >= 4) {
        recommendations.enablePipeline = true;
    }

    // Object pooling: always beneficial
    recommendations.useObjectPools = true;

    console.log('Recommended settings:', recommendations);

    return recommendations;
}
