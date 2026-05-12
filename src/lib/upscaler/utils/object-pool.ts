/**
 * Object pooling utilities for reusing expensive objects
 * Reduces garbage collection pressure and improves performance
 */

/**
 * Generic object pool
 */
class ObjectPool<T> {
    private available: T[] = [];
    private inUse = new Set<T>();
    private factory: () => T;
    private reset?: (obj: T) => void;

    constructor(factory: () => T, initialSize: number = 0, reset?: (obj: T) => void) {
        this.factory = factory;
        this.reset = reset;

        // Pre-allocate initial objects
        for (let i = 0; i < initialSize; i++) {
            this.available.push(factory());
        }
    }

    /**
     * Acquire an object from the pool
     */
    acquire(): T {
        let obj: T;

        if (this.available.length > 0) {
            obj = this.available.pop()!;
        } else {
            obj = this.factory();
        }

        this.inUse.add(obj);
        return obj;
    }

    /**
     * Release an object back to the pool
     */
    release(obj: T): void {
        if (!this.inUse.has(obj)) {
            console.warn('Attempting to release object not from this pool');
            return;
        }

        this.inUse.delete(obj);

        // Reset the object if a reset function is provided
        if (this.reset) {
            this.reset(obj);
        }

        this.available.push(obj);
    }

    /**
     * Get pool statistics
     */
    getStats() {
        return {
            available: this.available.length,
            inUse: this.inUse.size,
            total: this.available.length + this.inUse.size,
        };
    }

    /**
     * Clear the pool
     */
    clear(): void {
        this.available = [];
        this.inUse.clear();
    }
}

/**
 * Typed array pool for image processing
 */
export class TypedArrayPool {
    private pool: ObjectPool<any>;
    private size: number;

    constructor(arraySize: number, initialPoolSize: number = 2) {
        this.size = arraySize;
        this.pool = new ObjectPool(
            () => new Uint8ClampedArray(arraySize),
            initialPoolSize,
            (arr: any) => arr.fill(0) // Reset to zeros
        );
    }

    acquire(): Uint8ClampedArray {
        return this.pool.acquire();
    }

    release(array: Uint8ClampedArray): void {
        this.pool.release(array);
    }

    getStats() {
        return this.pool.getStats();
    }
}

/**
 * Frame buffer pool for video processing
 * Reuses canvas/bitmap objects
 */
export class FrameBufferPool {
    private canvasPool: ObjectPool<OffscreenCanvas>;
    private width: number;
    private height: number;

    constructor(width: number, height: number, initialSize: number = 2) {
        this.width = width;
        this.height = height;

        this.canvasPool = new ObjectPool(
            () => {
                const canvas = new OffscreenCanvas(width, height);
                return canvas;
            },
            initialSize,
            (canvas) => {
                // Clear the canvas
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, width, height);
                }
            }
        );
    }

    acquireCanvas(): OffscreenCanvas {
        return this.canvasPool.acquire();
    }

    releaseCanvas(canvas: OffscreenCanvas): void {
        this.canvasPool.release(canvas);
    }

    getStats() {
        return this.canvasPool.getStats();
    }

    clear(): void {
        this.canvasPool.clear();
    }
}

/**
 * Global pools (lazily initialized)
 */
let typedArrayPool: TypedArrayPool | null = null;
let frameBufferPool: FrameBufferPool | null = null;

export function initTypedArrayPool(size: number): TypedArrayPool {
    typedArrayPool = new TypedArrayPool(size, 2);
    return typedArrayPool;
}

export function getTypedArrayPool(): TypedArrayPool | null {
    return typedArrayPool;
}

export function initFrameBufferPool(width: number, height: number): FrameBufferPool {
    frameBufferPool = new FrameBufferPool(width, height, 2);
    return frameBufferPool;
}

export function getFrameBufferPool(): FrameBufferPool | null {
    return frameBufferPool;
}
