/**
 * Type declarations for figlet importable font modules.
 * These are untyped .js files that export raw font data as strings.
 */
declare module "figlet/importable-fonts/*" {
    const font: string;
    export default font;
}
