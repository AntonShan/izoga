import { VersionSelector } from "./metadata-parser.types";

export const META_LINE_REGEX = /^##\s+(.*?):\s+([^\r\n]+)$/;
export const EMPTY_LINE_CHECK = /^\s*?$/;
export const META_LINE_KEYWORD = "##";
export const COMMENT_LINE = /^\s*?(?:#|;){1}(?:\s.*?)?$/;
// export const COMMENT_LINE = /^\s*?(?:#|;).*?$/;
export const ADDON_WITH_VERSION = /(?:([a-zA-Z-.\d]+)(?:(>=|<=|=)(\d+))?)/;
export const versionSelectorMap = new Map<string, VersionSelector>([
    [">=", VersionSelector.greaterThan],
    ["<=", VersionSelector.lessThan],
    ["=", VersionSelector.equals],
]);
