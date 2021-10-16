export declare function copy(filePath: string, destPath: string): Promise<{
    run: () => Promise<void>;
    clear: () => void;
} & {
    result: void;
}>;
