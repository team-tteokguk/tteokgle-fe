export const encodeNewlines = (value: string): string => value.replace(/\n/g, '\\n');

export const decodeNewlines = (value: string): string => value.replace(/\\n/g, '\n');
