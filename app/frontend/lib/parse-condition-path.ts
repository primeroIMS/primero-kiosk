export function parseConditionPath(path: string, index: number | undefined): string {
    if (path.startsWith("records.") && index !== undefined) {
        return path.split(".").join(`.${index}.`);
    }

    return path;
}
